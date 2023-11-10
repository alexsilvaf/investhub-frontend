import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AssetType } from 'app/enums/asset.type.model';
import { CategoryType } from 'app/enums/category.type.model';

@Component({
  selector: 'app-manage-assets',
  templateUrl: './manage-assets.component.html',
  styleUrls: ['./manage-assets.component.css'],
})
export class ManageAssetsComponent implements OnInit {
  @ViewChild('nameInput') nameInput: ElementRef;
  
  assetTypes = Object.values(AssetType);
  categoryTypes = Object.values(CategoryType);
  selectedCategoryType: CategoryType;

  edittedAsset: any;

  assets = [ //Movimentações Financeiras ao invés de asset
    {
      id: 1,
      date: new Date(),
      name: 'Geraldo',
      type: CategoryType.RECEIVE,
      class: AssetType.LOAN,
      installments: 0,
      amount: 30,
      editMode: false
    },
    {
      id: 2,
      date: new Date(),
      name: 'Daniel',
      type: CategoryType.EXPENSE,
      class: AssetType.LOAN,
      installments: 0,
      amount: 300,
      editMode: false
    }
  ];

  constructor(private router: Router,
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

    sessionStorage.removeItem('savedState');
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    const savedState = sessionStorage.getItem('savedState');
    const state = savedState ? JSON.parse(savedState) : history.state;

    if (state && state.type || this.selectedCategoryType) {
      sessionStorage.setItem('savedState', JSON.stringify(state));
    }
  }

  get getSelectedIndex(){
    return this.categoryTypes.indexOf(this.selectedCategoryType);
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedCategoryType = this.categoryTypes[event.index];
    this.assets?.map(asset => asset.editMode = false);
  }

  addRow() {
    let assetOnEditMode = this.assets.find(asset => asset.editMode);
    if (assetOnEditMode) {
      if(this.validateEditForm()){
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
      if(this.nameInput){
        this.nameInput.nativeElement.focus();
      }
    });
  }


  editRow(row) {
    if(this.validateEditForm()){
      return;
    }
    this.assets?.map(asset => asset.editMode = false);
    
    this.edittedAsset = Object.assign({}, row);
    row.editMode = true;
    //timeSet
    setTimeout(() => {
      if(this.nameInput){
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
    console.log(row)
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
    if(isEditMode && (!this.edittedAsset?.name || !this.edittedAsset?.type || !this.edittedAsset?.class)){
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
