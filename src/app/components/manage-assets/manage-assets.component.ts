import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AssetType } from 'app/enums/asset.type.model';
import { CategoryType } from 'app/enums/category.type.model';
import { AssetService } from 'app/services/asset.service';
import { ColorService } from 'app/services/color.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-manage-assets',
  templateUrl: './manage-assets.component.html',
  styleUrls: ['./manage-assets.component.css'],
})
export class ManageAssetsComponent implements OnInit, AfterViewInit {
  @ViewChild('nameInput') nameInput: ElementRef;
  @ViewChild('assetTypeChart') assetTypeChart: ElementRef;

  assetTypes = Object.values(AssetType);
  categoryTypes = Object.values(CategoryType);
  selectedCategoryType: CategoryType;
  totalValuesByCategory: number[] = [];

  totalAreaChart: any;
  colors = [];

  edittedAsset: any;

  assets = [];
  selectedValues: string[] = [];

  constructor(private router: Router,
    private assetService: AssetService,
    private colorService: ColorService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    const savedState = sessionStorage.getItem('savedState');
    const state = savedState ? JSON.parse(savedState) : history.state;

    if (state && state.type) {
      history.state.type = state.type;
      this.selectedCategoryType = state.type;
    } else {
      this.selectedCategoryType = CategoryType.RECEIVE;
    }

    this.assets = this.assetService.getAll();

    this.colors = this.assets.map((_, index) => this.colorService.getColorForIndex(index));

    sessionStorage.removeItem('savedState');
    this.updateChartData();
  }

  ngAfterViewInit() {
    this.createChart();
    this.updateChartData();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    const savedState = sessionStorage.getItem('savedState');
    const state = savedState ? JSON.parse(savedState) : history.state;

    if (state && state.type || this.selectedCategoryType) {
      sessionStorage.setItem('savedState', JSON.stringify(state));
    }
  }

  get getSelectedIndex() {
    return this.categoryTypes.indexOf(this.selectedCategoryType);
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedCategoryType = this.categoryTypes[event.index];
    this.createChart();
    this.assets?.map(asset => asset.editMode = false);
  }

  createChart() {
    if (this.assetTypeChart) {
      const canvas = this.assetTypeChart.nativeElement as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
  
      if (this.totalAreaChart) {
        this.totalAreaChart.destroy(); // Destruir a instância anterior do gráfico
      }
  
      this.totalAreaChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: this.totalValuesByCategory,
            backgroundColor: this.getBackgroundColor(false),
            borderColor: this.getBackgroundColor(true),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false // Remove a legenda do gráfico
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.label || '';
                  console.log(context)
                  if (label) {
                    label += ': ';
                  }
                  label += context.parsed + '%';
                  return label;
                }
              }
            }
          },
          scales: {
            y: {
              display: false, // Remove as legendas do eixo y
              beginAtZero: true
            },
            x: {
              grid: {
                display: false // Remove as linhas de grade do eixo x
              }
            }
          }
        }
      });
    }
  }

  getBackgroundColor(isBorder) {
    if(this.selectedCategoryType === CategoryType.RECEIVE) {
      if(isBorder){
        return ['rgba(144, 238, 144)', 'rgba(0, 0, 0, 0)'];
      } else {
        return ['rgba(144, 238, 144, 0.4)', 'rgba(0, 0, 0, 0)'];
      }
    } else {
      if(isBorder){
        return ['rgba(0, 0, 0, 0)', 'rgba(255, 0, 0)'];
      } else {
        return ['rgba(0, 0, 0, 0)', 'rgba(255, 0, 0, 0.4)'];
      }
    }
  }
  
  updateChartData() {
    // Calcula o total geral
    const totalGeral = this.assets.reduce((acc, asset) => acc + asset.amount, 0);
  
    // Calcula o total para a categoria selecionada (e.g., "Receitas")
    const totalPorCategoriaSelecionada = this.assets
      .filter(asset => asset.type === this.selectedCategoryType)
      .reduce((acc, asset) => acc + asset.amount, 0);
  
    let totalSelecionado = 0;
    if (this.selectedValues.length > 0) {
      // Soma dos ativos selecionados dentro da categoria selecionada
      totalSelecionado = this.assets
        .filter(asset => asset.type === this.selectedCategoryType && this.selectedValues.includes(asset.class))
        .reduce((acc, asset) => acc + asset.amount, 0);
    } else {
      // Usa o total da categoria se nenhuma classe específica estiver selecionada
      totalSelecionado = totalPorCategoriaSelecionada;
    }
  
    // Calcula a porcentagem que o total selecionado representa do total geral
    const porcentagemSelecionada = (totalSelecionado / totalGeral) * 100;
    const porcentagemNaoSelecionada = 100 - porcentagemSelecionada;
  
    if(this.selectedCategoryType === CategoryType.RECEIVE) {
    // Atualiza o gráfico com a porcentagem calculada
    this.totalValuesByCategory = [porcentagemSelecionada, porcentagemNaoSelecionada];
    } else {
      this.totalValuesByCategory = [porcentagemNaoSelecionada, porcentagemSelecionada];
    }

    if(this.totalAreaChart) {
      this.totalAreaChart.data.datasets[0].data = this.totalValuesByCategory;
      this.totalAreaChart.update();
    }
  }
 

  toggleSelection(type: string) {
    const index = this.selectedValues.indexOf(type);
    if (index > -1) {
      this.selectedValues.splice(index, 1); // Remova se já estiver selecionado
    } else {
      this.selectedValues.push(type); // Adicione se não estiver selecionado
    }
    this.updateChartData();
  }

  isSelected(type: string): boolean {
    return this.selectedValues.includes(type);
  }

  addRow() {
    let assetOnEditMode = this.assets.find(asset => asset.editMode);
    if (assetOnEditMode) {
      if (this.validateEditForm()) {
        return;
      } else {
        this.snackBar.open('Salve ou cancele a edição do ativo atual.', 'Fechar', {
          duration: 3000, // Duração em milissegundos. A mensagem desaparecerá após esse tempo.
          verticalPosition: 'bottom', // 'top' para exibir no topo
          horizontalPosition: 'right', // 'start' ou 'end' para exibir à esquerda ou à direita
        });
      }
      return;
    }

    this.assets.push({
      id: null,
      date: new Date(),
      name: '',
      type: this.selectedCategoryType,
      class: null,
      installments: 0,
      amount: 0,
      editMode: true
    });
    this.edittedAsset = Object.assign({}, this.assets[this.assets.length - 1]);

    setTimeout(() => {
      if (this.nameInput) {
        this.nameInput.nativeElement.focus();
      }
    });
  }


  editRow(row) {
    if (this.validateEditForm()) {
      return;
    }
    this.assets?.map(asset => asset.editMode = false);

    this.edittedAsset = Object.assign({}, row);
    row.editMode = true;
    //timeSet
    setTimeout(() => {
      if (this.nameInput) {
        this.nameInput.nativeElement.focus();
      }
    }, 0);
  }

  deleteRow(row) {
    const index = this.assets.indexOf(row);
    if (index > -1) {
      this.assets.splice(index, 1);
      this.snackBar.open('Ativo excluído com sucesso.', 'Desfazer', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['custom-snackbar']
      }).onAction().subscribe(() => {
        this.assets.splice(index, 0, row);
      });
    }
  }

  saveRow(row) {
    if (this.validateEditForm()) {
      return;
    }

    row = Object.assign(row, this.edittedAsset);
    row.id = row.id || this.assets.length + 1;
    row.editMode = false;
  }

  cancelEdit(row) {
    const index = this.assets.indexOf(row);
    if (index > -1) {
      if (row.id) {
        row.editMode = false;
      } else {
        this.assets.splice(index, 1);
      }
    }
  }

  validateEditForm(): boolean {
    let isEditMode = this.assets.find(asset => asset.editMode);
    if (isEditMode && (!this.edittedAsset?.name || !this.edittedAsset?.type || !this.edittedAsset?.class)) {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['custom-snackbar']
      });
      return true;
    }
    return false;
  }

}
