import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { IndexeddbService } from '../service/indexeddb.service'; // Certifique-se de importar o serviço IndexedDB correto

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {

  historicoForm: FormGroup;
  historicos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private indexeddbService: IndexeddbService
  ) {
    // Inicializando o formulário
    this.historicoForm = this.fb.group({
      acao: ['', Validators.required],
      quantidade: ['', Validators.required],
      produto: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadHistorico(); // Carregar histórico na inicialização
  }

  ionViewWillEnter() {
    this.loadHistorico(); // Carregar histórico sempre que a tela for exibida
  }

  loadHistorico() {
    this.indexeddbService.getAllData('Historico').then((historicos) => {
      this.historicos = historicos;
    });
  }

  // Método para enviar os dados do formulário e salvar no IndexedDB
  onSubmit() {
    if (this.historicoForm.valid) {
      // Extrair dados do formulário
      const historico = {
        Acao: this.historicoForm.value.acao,
        Quantidade: this.historicoForm.value.quantidade,
        Produto: this.historicoForm.value.produto,
        Data: new Date().toISOString() // Adicionar data do dispositivo
      };

      // Adicionando o histórico no banco de dados (IndexedDB)
      this.indexeddbService.addData('Historico', historico).then(() => {
        this.loadHistorico(); // Recarregar o histórico para exibir o novo item
        this.historicoForm.reset(); // Limpar o formulário após adicionar
      });

      // Redirecionar para a página de histórico
      this.navCtrl.navigateForward('/historico');
    }
  }
}
