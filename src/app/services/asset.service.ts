import { Injectable } from '@angular/core';
import { AssetType } from 'app/enums/asset.type.model';
import { CategoryType } from 'app/enums/category.type.model';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor() { }

  getAll() {
    const randomLength = Math.floor(Math.random() * (30 - 4 + 1)) + 4;
    const assets = [];
  
    for (let i = 0; i < randomLength; i++) {
      const randomCategoryType = Object.values(CategoryType)[Math.floor(Math.random() * Object.values(CategoryType).length)];
      const randomAssetType = Object.values(AssetType)[Math.floor(Math.random() * Object.values(AssetType).length)];
  
      // Data aleatória no último ano
      const endDate = new Date();
      const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
      const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
  
      // Calculando o número de parcelas
      const monthsDiff = this.diffInMonths(randomDate, new Date());
  
      assets.push({
        id: i + 1,
        date: randomDate,
        name: `Name ${i + 1}`,
        type: randomCategoryType,
        class: randomAssetType,
        installments: monthsDiff,
        amount: Math.floor(Math.random() * 1000) + 1, // Valor aleatório entre 1 e 1000
        editMode: false
      });
    }
  
    return assets;
  }
  
  private diffInMonths(date1, date2) {
    const diffInTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffInTime / (1000 * 60 * 60 * 24 * 30));
  }
}
