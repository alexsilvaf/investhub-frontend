import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AssetType } from 'app/enums/asset.type.model';
import { CategoryType } from 'app/enums/category.type.model';

@Component({
  selector: 'app-manage-assets',
  templateUrl: './manage-assets.component.html',
  styleUrls: ['./manage-assets.component.css']
})
export class ManageAssetsComponent implements OnInit {
  assetTypes = Object.values(AssetType);
  categoryTypes = Object.values(CategoryType);
  selectedCategoryType: CategoryType;

  assets = [
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
    const savedState = localStorage.getItem('savedState');
    const state = savedState ? JSON.parse(savedState) : history.state;

    if (state && state.type) {
      history.state.type = state.type;
      this.selectedCategoryType = state.type;
      if (state.type === 'receive') {
      } else if (state.type === 'expense') {
      }
    } else {
      this.selectedCategoryType = CategoryType.RECEIVE;
    }

    localStorage.removeItem('savedState');
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    const savedState = localStorage.getItem('savedState');
    const state = savedState ? JSON.parse(savedState) : history.state;

    if (state && state.type || this.selectedCategoryType) {
      localStorage.setItem('savedState', JSON.stringify(state));
    }
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedCategoryType = this.categoryTypes[event.index];
  }

  addRow() {
    let assetOnEditMode = this.assets.find(asset => asset.editMode);
    if (assetOnEditMode) {
      this.snackBar.open('Salve ou cancele a edição do ativo atual.', 'Fechar', {
        duration: 3000, // Duração em milissegundos. A mensagem desaparecerá após esse tempo.
        verticalPosition: 'bottom', // 'top' para exibir no topo
        horizontalPosition: 'right', // 'start' ou 'end' para exibir à esquerda ou à direita
      });
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
  }

  editRow(row) {
    row.editMode = true;
  }

  deleteRow(row) {
    const index = this.assets.indexOf(row);
    if (index > -1) {
      this.assets.splice(index, 1);
    }
  }

  saveRow(row) {
    if (!row.name || !row.type || !row.class) { //Caso algum destes atributos sejam nulos, a linha não será salva e o usuário receberá a mensagem.
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['custom-snackbar']
      });
      return;
    }

    row.editMode = false;
  }


  cancelEdit(row) {
    const index = this.assets.indexOf(row);
    if (index > -1) {
      if (row.id) {
        row.editMode = false
      } else {
        this.assets.splice(index, 1);
      }
    }
  }

}
