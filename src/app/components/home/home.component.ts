import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CategoryType } from 'app/enums/category.type.model';
import { CategoryChart } from 'app/models/category.model';
import { Stock } from 'app/models/stock.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  @ViewChild('receiveChart') receiveChart: ElementRef;
  @ViewChild('expenseChart') expenseChart: ElementRef;
  @ViewChild('categoryField', { static: false }) categoryField: ElementRef;

  receiveChartData = [800.00, 1600.00,1400.00, 2000.00, 1900.00, 2400.00] //Deve retornar o saldo total do usuário referente a cada mês abaixo
  receiveChartLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] //Deve exibir os meses do ano começando pelo mês do ano passado até o mês atual
  categoryList: CategoryChart[] = [];
  categoryReceiveList: CategoryChart[] = [];
  categoryExpenseList: CategoryChart[] = [];
  
  colors = ['rgb(208, 100, 100)', 'rgb(94, 208, 144)', 'rgb(90, 144, 208)', 'rgb(238, 238, 90)', 'rgb(235, 114, 74)', 'rgb(204, 204, 204)'];
  
  //FormField de categoria
  value: string;
  previousValue: string;
  editMode: boolean = false;

  //TODO: TROCAR AS CORES DO GRÁFICO.
  ngAfterViewInit() {
    var receiveChart = this.receiveChart.nativeElement.getContext('2d');
    var expenseChart = this.expenseChart.nativeElement.getContext('2d');

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
    if(this.categoryList) {
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
    }
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


  get hasChartData(): boolean {
    return this.receiveChartData && this.receiveChartData.length > 0;
  }

  get totalValue(): string {
    let totalReceive = this.categoryReceiveList.reduce((acc, category) => acc + category.totalValue, 0);
    let totalExpense = this.categoryExpenseList.reduce((acc, category) => acc + category.totalValue, 0);
    return (totalReceive - totalExpense).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  get totalExpense(): string {
    return this.categoryExpenseList.reduce((acc, category) => acc + category.totalValue, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  get totalReceive(): string {
    return this.categoryReceiveList.reduce((acc, category) => acc + category.totalValue, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  switchEditMode(){
    this.editMode = !this.editMode;
    if (this.editMode) {
      setTimeout(() => {
        this.categoryField.nativeElement.focus();
      });
    }
  }

  // Quando o input ganha foco, armazene o valor atual para que possamos reverter para ele se a ação for cancelada
  onFocus() {
      this.previousValue = this.value;
  }

  // Função para confirmar o valor
  confirmValue() {
      // Aqui você pode adicionar lógica adicional se necessário
      console.log("Valor confirmado:", this.value);
      this.onFocus();
      this.switchEditMode();
  }

  // Função para cancelar a ação e reverter para o valor anterior
  cancelValue() {
      this.value = this.previousValue;
      this.switchEditMode();
  }
}
