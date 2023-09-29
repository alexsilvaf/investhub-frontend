import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Stock } from 'app/models/stock.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.css']
})
export class InvestmentComponent implements AfterViewInit {

  @ViewChild('lineChart') lineChart: ElementRef;

  chartData = [800.00, 1600.00,1400.00, 2000.00, 1900.00, 2400.00] //Deve retornar o saldo total do usuário referente a cada mês abaixo
  chartLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] //Deve exibir os meses do ano começando pelo mês do ano passado até o mês atual
  stockList: Stock[] = [];
  totalValue = '';

  ngAfterViewInit() {
    var ctx = this.lineChart.nativeElement.getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartLabel,
        datasets: [{
          data: this.chartData,
          fill: true,
          backgroundColor: 'rgba(144, 238, 144, 0.4)', // Verde claro transparente
          borderColor: 'rgba(144, 238, 144, 1)', // Verde claro opaco
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Mantém a proporção ao redimensionar
        plugins: {
          legend: {
            display: false, // Oculta a legenda
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    this.stockList = [
      {
        ticker: 'VALE3', 
        name: 'VALE', 
        type: 'Ação',
        quantity: 23,
        currentPrice: 72.00, 
      },
      {
        ticker: 'BBDC3', 
        name: 'Bradesco S.A', 
        type: 'Ação',
        quantity: 102,
        currentPrice: 32.00, 
      },
      {
        ticker: 'TAEE3', 
        name: 'Taesa', 
        type: 'Ação',
        quantity: 102,
        currentPrice: 32.00, 
      },
      {
        ticker: 'URPR11', 
        name: 'Urca Prime Renda',
        type: 'Fundo Imobiliário',
        quantity: 102,
        currentPrice: 32.00, 
      },
      {
        ticker: 'HGLG11', 
        name: 'Bradesco S.A',
        type: 'Fundo Imobiliário',
        quantity: 102,
        currentPrice: 32.00, 
      }
    ]
    if(this.stockList) {
      this.totalValue = `R$ ${this.stockList.reduce((acc, stock) => acc + stock.quantity * stock.currentPrice, 0)
        .toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  getFullPrice(stock: Stock): number{
    return stock.quantity * stock.currentPrice;
  }

  get hasChartData(): boolean {
    return this.chartData && this.chartData.length > 0;
  }
}
