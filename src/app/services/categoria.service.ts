// message.service.ts

import { Injectable } from '@angular/core';
import { CategoryType } from 'app/enums/category.type.model';
import { CategoryHistory } from 'app/models/category-history.model ';
import { CategoryChart } from 'app/models/category.model';
import { response } from 'express';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  getAllReceive(): CategoryChart[] {
    let response = [
      {
        name: 'Salário',
        type: CategoryType.RECEIVE,
        totalValue: 4000,
      },
      {
        name: 'Investimentos',
        type: CategoryType.RECEIVE,
        totalValue: 2300,
      }
    ]
    return response;
  }

  getHistoryExpenseChartModel(): CategoryHistory[] {
    let response = [];
    let currentDate = new Date(); // Data atual
    currentDate.setMonth(currentDate.getMonth() - 1); // Começar do mês anterior ao atual
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
  
    for (let index = 0; index < 12; index++) {
      // Calcula o mês e ano correto subtraindo o índice
      let year = currentYear;
      let month = currentMonth - index;
  
      // Ajusta a data se o mês for negativo, significando que cruzou o ano
      if (month < 0) {
        month += 12; // Ajusta o mês para o ano anterior
        year--; // Diminui o ano
      }
  
      // Cria a nova data com o mês e ano calculados
      let date = new Date(year, month, 1);
  
      // Gerar um valor aleatório entre 800 e 4000
      let randomValue = Math.random() * (4000 - 800) + 800;
  
      // Adiciona o objeto ao início da resposta para manter a ordem correta
      response.unshift({
        month: date.toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' }), // Formato mm/aa
        totalValue: randomValue
      });
    }
    return response;
  }
  
}
