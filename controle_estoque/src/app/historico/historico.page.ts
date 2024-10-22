import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { IndexeddbService } from '../service/indexeddb.service'; // Certifique-se de importar o serviço IndexedDB correto

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {

  historicoForm: FormGroup;
  historicos: any[] = [];
  historicosFiltrados: any[] = []; // Para armazenar os históricos filtrados
  idestoque!: string;
  produtos: any[] = [];
  dataSelecionada: string = ''; // Para armazenar a data selecionada pelo usuário

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private indexeddbService: IndexeddbService,
    private route: ActivatedRoute
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
    this.route.queryParams.subscribe(params => {
      this.idestoque = params['idestoque'];
      console.log('ID Estoque:', this.idestoque);
    });
  }

  ionViewWillEnter() {
    this.loadHistorico(); // Carregar histórico sempre que a tela for exibida
    this.loadProduto();
  }

  loadProduto() {
    this.indexeddbService.getAllData('Produto').then((produtos) => {
      this.produtos = produtos;
    });
  }

  loadHistorico() {
    this.indexeddbService.getAllData('Historico').then((historicos) => {
      this.historicos = historicos.filter(historico => historico.Esto === this.idestoque);
      this.historicosFiltrados = this.historicos; // Iniciar a lista de filtrados com todos os históricos
    });
  }

  // Método para enviar os dados do formulário e salvar no IndexedDB
  onSubmit() {
    if (this.historicoForm.valid) {
      const acao = this.historicoForm.value.acao;
      const quantidade = this.historicoForm.value.quantidade;
      const produtoId = this.historicoForm.value.produto;

      this.indexeddbService.getAllData('Produto').then((produtos) => {
        const produto = produtos.find(p => p.id === produtoId);
        if (!produto) {
          console.error('Produto não encontrado');
          return;
        }

        let novaQuantidade;
        if (acao === 'comprou') {
          novaQuantidade = produto.QuantidadeEstoque + quantidade;
        } else if (acao === 'vendeu') {
          novaQuantidade = produto.QuantidadeEstoque - quantidade;
          if (novaQuantidade < 0) novaQuantidade = 0;
        }

        produto.QuantidadeEstoque = novaQuantidade;
        this.indexeddbService.updateData('Produto', produto).then(() => {
          const historico = {
            Acao: acao,
            Quantidade: quantidade,
            Produto: produtoId,
            Data: new Date().toISOString(), // Data da ação
            Esto: this.idestoque
          };

          this.indexeddbService.addData('Historico', historico).then(() => {
            this.loadHistorico();
            this.historicoForm.reset();
          });
        });
      });
    }
  }

  // Função chamada ao selecionar uma data
  onDateChange(event: any) {
    this.dataSelecionada = event.detail.value.split('T')[0]; // Extrai a data no formato YYYY-MM-DD
  }

  // Função para filtrar o histórico pela data selecionada
  filtrarHistoricoPorData() {
    if (this.dataSelecionada) {
      this.historicosFiltrados = this.historicos.filter(historico => {
        const dataHistorico = historico.Data.split('T')[0]; // Extrai a data do histórico
        return dataHistorico === this.dataSelecionada; // Compara com a data selecionada
      });
    } else {
      this.historicosFiltrados = this.historicos; // Se não houver data selecionada, exibe todos os históricos
    }
  }

  getProdutoNome(produtoId: number): string {
    const produto = this.produtos.find(prod => prod.id === produtoId);
    return produto ? produto.Nome : 'Produto desconhecido';
  }

  voltar() {
    this.navCtrl.navigateForward('/menu-estoque', {
      queryParams: { idestoque: this.idestoque }
    });
  }
}
