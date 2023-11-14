import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CategoryType } from 'app/enums/category.type.model';
import { CategoryChart } from 'app/models/category.model';
import { ColorService } from 'app/services/color.service';
import { Chart, registerables } from 'chart.js';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'app/services/categoria.service';
import { CategoryHistory } from 'app/models/category-history.model ';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('receiveExpenseChart') receiveExpenseChart: ElementRef;
  @ViewChild('historyChart') historyChart: ElementRef;
  @ViewChild('scrollDiv1') scrollDiv1: ElementRef;
  @ViewChild('scrollDiv2') scrollDiv2: ElementRef;

  receiveList: CategoryChart[] = [];
  categoryHistoryList: CategoryHistory[] = [];

  colors = [];

  constructor(
    private categoryService: CategoryService,
    private colorService: ColorService,
    private router: Router) { }

  ngAfterViewInit() {
    var receiveExpenseChart = this.receiveExpenseChart?.nativeElement?.getContext('2d');
    var historyChart = this.historyChart?.nativeElement?.getContext('2d');

    this.receiveList = this.categoryService.getAllReceive();
    this.categoryHistoryList = this.categoryService.getHistoryExpenseChartModel();

    var myHistoryChart = new Chart(historyChart, {
      type: 'bar', // Mudar para gráfico de barras
      data: {
        labels: this.categoryHistoryList.map(category => category.month), // Asumindo que 'month' já está no formato 'mm/aa'
        datasets: [{
          data: this.categoryHistoryList.map(category => category.totalValue),
          backgroundColor: 'rgba(144, 238, 144, 0.4)', // Cor de fundo das barras (verde claro transparente)
          borderColor: 'rgba(144, 238, 144, 1)', // Cor da borda das barras (verde claro opaco)
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // Remove a legenda do gráfico
          }
        },
        scales: {
          y: {
            display: false, // Remove as legendas do eixo y (esquerda)
            beginAtZero: true // Começa a escala no zero
          },
          x: {
            // Configurações adicionais para o eixo x, se necessário
            grid: {
              display: false // Isso removerá as linhas de grade verticais do eixo x
            }
          }
        }
      }
    });

    if (this.receiveList && this.receiveList.length > 0) {
      this.colors = this.receiveList.map((_, index) => this.colorService.getColorForIndex(index));

      var myReceiveExpenseChart = new Chart(receiveExpenseChart, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [this.totalExpense, this.totalReceive],
            backgroundColor: this.colors,
            borderWidth: 1 // Você pode ajustar a largura da borda conforme necessário
          }]
        },
        options: {
          plugins: {
            legend: {
              position: 'left'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataIndex == 0 ? 'Despesas' : 'Receitas';
                  return label + ': ' + context.formattedValue;
                }
              }
            }
          },
          onHover: (event, chartElement) => {
            const canvas = myReceiveExpenseChart.canvas;
            canvas.style.cursor = chartElement.length ? 'pointer' : 'default';
          },
          onClick: (evt, element) => {
            if (element.length > 0) {
              var index = element[0].index;
              // Verifica qual dado foi clicado e realiza a ação correspondente
              if (index === 0) {
                // Redireciona para a página de despesas
                this.navigateToManagment('expense');
              } else if (index === 1) {
                // Redireciona para a página de receitas
                this.navigateToManagment('receive');
              }
            }
          }
        }
      });

    } else {

      // Se os gráficos já estiverem inicializados, destrua-os
      if (myReceiveExpenseChart) {
        myReceiveExpenseChart.destroy();
      }
      if (myHistoryChart) {
        myHistoryChart.destroy();
      }

      // Defina a altura dos elementos do gráfico como 0
      if (this.receiveExpenseChart?.nativeElement) {
        this.receiveExpenseChart.nativeElement.style.height = '0px';
      }
      if (this.historyChart?.nativeElement) {
        this.historyChart.nativeElement.style.height = '0px';
      }
    }
    setTimeout(() => {
      this.checkForScrollbar([this.scrollDiv1, this.scrollDiv2]);
    }, 0);
  }

  /*getColorForCategory(category: CategoryChart): string {
    let index: number;
    if (category.type == CategoryType.RECEIVE) {
      index = this.receiveList.indexOf(category);
    } else {
      index = this.receiveList.indexOf(category);
    }
    return this.colors[index % this.colors.length];
  }*/

  checkForScrollbar(scrollDivs: ElementRef[]) {
    scrollDivs.forEach(scrollDiv => {
      const parentElement = scrollDiv?.nativeElement;
      const children = parentElement?.children;
      let totalChildrenWidth = 0;

      for (let i = 0; i < children?.length; i++) {
        const child = children[i];
        const style = window.getComputedStyle(child);
        const marginLeft = parseFloat(style.marginLeft || '0');
        const marginRight = parseFloat(style.marginRight || '0');

        totalChildrenWidth += child.offsetWidth + marginLeft + marginRight;
      }

      if (totalChildrenWidth > parentElement?.offsetWidth) {
        // A largura total dos elementos filhos (incluindo margens) é maior que a largura do elemento pai
        parentElement.classList.add('has-scrollbar');
      } else {
        parentElement?.classList.remove('has-scrollbar');
      }
    });
  }

  navigateToManagment(type: 'receive' | 'expense') {
    let categotyType = type == 'receive' ? CategoryType.RECEIVE : CategoryType.EXPENSE;
    this.router.navigate(['/management'], { state: { type: categotyType } });
  }

  get hasReceiveExpenseChartData(): boolean {
    return this.receiveList && this.receiveList.length > 0;
  }

  get hasHistoryData(): boolean {
    return this.categoryHistoryList && this.categoryHistoryList.length > 0;
  }

  get totalValue(): number {
    return (this.totalReceive - this.totalExpense);
  }

  get totalExpense(): number {
    return this.categoryHistoryList[this.categoryHistoryList.length - 1]?.totalValue || 0;
  }

  get totalReceive(): number {
    return this.receiveList.reduce((acc, category) => acc + category.totalValue, 0);
  }
}
