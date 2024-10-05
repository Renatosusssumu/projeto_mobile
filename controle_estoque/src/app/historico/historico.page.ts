import { Component, OnInit, inject } from '@angular/core';
import { IndexeddbService } from '../service/indexeddb.service'; // Certifique-se de importar o serviço IndexedDB correto

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {
  historicos: any[] = []; // Array para armazenar as entradas do histórico

  constructor(private indexeddbService: IndexeddbService) { }

  ngOnInit() {
    this.loadHistoricos(); // Carregar históricos na inicialização
  }

  // Método para carregar todas as entradas de histórico do IndexedDB
  loadHistoricos() {
    this.indexeddbService.getAllData('Historico').then(data => {
      this.historicos = data; // Atualizar o array com os dados recebidos
    }).catch(error => console.error('Falha ao carregar históricos:', error));
  }

  // Método para adicionar uma nova entrada ao histórico (exemplo)
  addHistorico(data: any) {
    this.indexeddbService.addData('Historico', data).then(() => {
      this.loadHistoricos(); // Recarregar o histórico após adicionar
    }).catch(error => console.error('Falha ao adicionar histórico:', error));
  }

}
