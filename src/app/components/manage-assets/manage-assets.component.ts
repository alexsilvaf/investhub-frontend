import { Component, HostListener, OnInit } from '@angular/core';
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
  preLoadedType: 'receive' | 'expense';

  assets = [
    {
      id: 1,
      date: new Date(),
      name: 'Geraldo',
      type: CategoryType.RECEIVE,
      class: AssetType.LOAN,
      installments: 0,
      amount: 0,
      editMode: false
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    const savedState = localStorage.getItem('savedState');
    const state = savedState ? JSON.parse(savedState) : history.state;

    if (state && state.type) {
      history.state.type = state.type;
      if (state.type === 'receive') {
      } else if (state.type === 'expense') {
      }
    }

    localStorage.removeItem('savedState');
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    const savedState = localStorage.getItem('savedState');
    const state = savedState ? JSON.parse(savedState) : history.state;

    if (state && state.type || this.preLoadedType) {
      localStorage.setItem('savedState', JSON.stringify(state));
    }
  }

  addRow() {
    this.assets.push({
      id: null,
      date: new Date(),
      name: '',
      type: null,
      class: null,
      installments: 0,
      amount: 0,
      editMode: true
    });
  }

  saveRow(row) {
    row.editMode = false;
    // Aqui, você pode adicionar lógica adicional para salvar a linha, 
    // por exemplo, fazer uma chamada API para salvar os dados no backend.
  }

  cancelEdit(row) {
    const index = this.assets.indexOf(row);
    if (index > -1) {
      this.assets.splice(index, 1);
    }
  }

}
