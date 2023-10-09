import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CategoryType } from 'app/enums/category.type.model';
import { CategoryChart } from 'app/models/category.model';
import { ColorService } from 'app/services/color.service';
import { Chart, registerables } from 'chart.js';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('receiveChart') receiveChart: ElementRef;
  @ViewChild('expenseChart') expenseChart: ElementRef;
  @ViewChild('scrollDiv1') scrollDiv1: ElementRef;
  @ViewChild('scrollDiv2') scrollDiv2: ElementRef;

  categoryList: CategoryChart[] = [];
  categoryReceiveList: CategoryChart[] = [];
  categoryExpenseList: CategoryChart[] = [];

  colors = [];

  constructor(
    private colorService: ColorService,
    private router: Router) { }

  ngAfterViewInit() {
    var receiveChart = this.receiveChart?.nativeElement?.getContext('2d');
    var expenseChart = this.expenseChart?.nativeElement?.getContext('2d');

    this.categoryList = [
      {
        name: 'Salário',
        type: CategoryType.RECEIVE,
        totalValue: 4000,
      },
      {
        name: 'Dividendos',
        type: CategoryType.RECEIVE,
        totalValue: 800,
      },
      {
        name: 'Alimentação',
        type: CategoryType.EXPENSE,
        totalValue: 1200,
      },
      {
        name: 'Transporte',
        type: CategoryType.EXPENSE,
        totalValue: 200,
      },
      {
        name: 'Moradia',
        type: CategoryType.EXPENSE,
        totalValue: 800,
      },
      {
        name: 'Lazer',
        type: CategoryType.EXPENSE,
        totalValue: 500,
      },
      {
        name: 'Outros',
        type: CategoryType.EXPENSE,
        totalValue: 500,
      },
    ]
    if (this.categoryList && this.categoryList.length > 0) {
      this.colors = this.categoryList.map((_, index) => this.colorService.getColorForIndex(index));

      this.categoryReceiveList = this.categoryList.filter(category => category.type == CategoryType.RECEIVE);
      this.categoryExpenseList = this.categoryList.filter(category => category.type == CategoryType.EXPENSE);

      var myReceiveChart = new Chart(receiveChart, {
        type: 'pie',
        data: {
          datasets: [{
            data: this.categoryList.filter(category => category.type == CategoryType.RECEIVE).map(category => category.totalValue),
            backgroundColor: this.colors,
            borderWidth: 1 // Você pode ajustar a largura da borda conforme necessário
          }]
        },
        options: {
          plugins: {
            legend: {
              position: 'left'
            }
          }
        }
      });

      var myExpenseChart = new Chart(expenseChart, {
        type: 'pie',
        data: {
          datasets: [{
            data: this.categoryList.filter(category => category.type == CategoryType.EXPENSE).map(category => category.totalValue),
            backgroundColor: this.colors,
            borderWidth: 1 // Você pode ajustar a largura da borda conforme necessário
          }]
        },
        options: {
          plugins: {
            legend: {
              position: 'left'
            }
          }
        }
      });
    } else {

      // Se os gráficos já estiverem inicializados, destrua-os
      if (myReceiveChart) {
        myReceiveChart.destroy();
      }
      if (myExpenseChart) {
        myExpenseChart.destroy();
      }

      // Defina a altura dos elementos do gráfico como 0
      if (this.receiveChart?.nativeElement) {
        this.receiveChart.nativeElement.style.height = '0px';
      }
      if (this.expenseChart?.nativeElement) {
        this.expenseChart.nativeElement.style.height = '0px';
      }
    }
    setTimeout(() => {
      this.checkForScrollbar([this.scrollDiv1, this.scrollDiv2]);
    }, 0);
  }

  getColorForCategory(category: CategoryChart): string {
    let index: number;
    if (category.type == CategoryType.RECEIVE) {
      index = this.categoryReceiveList.indexOf(category);
    } else {
      index = this.categoryExpenseList.indexOf(category);
    }
    return this.colors[index % this.colors.length];
  }

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

  get hasReceiveChartData(): boolean {
    return this.categoryReceiveList && this.categoryReceiveList.length > 0;
  }

  get hasExpenseChartData(): boolean {
    return this.categoryExpenseList && this.categoryExpenseList.length > 0;
  }

  get totalValue(): number {
    let totalReceive = this.categoryReceiveList.reduce((acc, category) => acc + category.totalValue, 0);
    let totalExpense = this.categoryExpenseList.reduce((acc, category) => acc + category.totalValue, 0);
    return (totalReceive - totalExpense);
  }

  get totalExpense(): number {
    return this.categoryExpenseList.reduce((acc, category) => acc + category.totalValue, 0);
  }

  get totalReceive(): number {
    return this.categoryReceiveList.reduce((acc, category) => acc + category.totalValue, 0);
  }
}
