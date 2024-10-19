import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from '@ionic/angular';
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
  idestoque !: string;
  produtos:any[]=[];

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

  loadProduto(){
    this.indexeddbService.getAllData('Produto').then((produtos) => {
      this.produtos = produtos;
    });
  }

  loadHistorico() {
    this.indexeddbService.getAllData('Historico').then((historicos) => {
      this.historicos = historicos.filter(historicos => historicos.Esto === this.idestoque);
    });
  }

  // Método para enviar os dados do formulário e salvar no IndexedDB
  // Método para enviar os dados do formulário e salvar no IndexedDB
onSubmit() {
  if (this.historicoForm.valid) {
    // Extrair dados do formulário
    const acao = this.historicoForm.value.acao;
    const quantidade = this.historicoForm.value.quantidade;
    const produtoId = this.historicoForm.value.produto;

    // Buscar todos os produtos no IndexedDB e filtrar pelo ID
    this.indexeddbService.getAllData('Produto').then((produtos) => {
      const produto = produtos.find(p => p.id === produtoId);
      if (!produto) {
        console.error('Produto não encontrado');
        return;
      }

      // Atualizar a quantidade com base na ação
      let novaQuantidade;
      if (acao === 'comprou') {
        novaQuantidade = produto.QuantidadeEstoque + quantidade; // Aumentar a quantidade se for uma compra
      } else if (acao === 'vendeu') {
        novaQuantidade = produto.QuantidadeEstoque - quantidade; // Diminuir a quantidade se for uma venda
        if (novaQuantidade < 0) {
          novaQuantidade = 0; // Garantir que a quantidade não seja negativa
        }
      }

      // Atualizar o produto com a nova quantidade
      produto.QuantidadeEstoque = novaQuantidade;
      this.indexeddbService.updateData('Produto', produto).then(() => {
        console.log('Produto atualizado com sucesso');

        // Adicionando o histórico no banco de dados (IndexedDB)
        const historico = {
          Acao: acao,
          Quantidade: quantidade,
          Produto: produtoId,
          Data: new Date().toISOString(), // Adicionar data do dispositivo
          Esto: this.idestoque
        };

        this.indexeddbService.addData('Historico', historico).then(() => {
          this.loadHistorico(); // Recarregar o histórico para exibir o novo item
          this.historicoForm.reset(); // Limpar o formulário após adicionar
        });
      }).catch(error => {
        console.error('Erro ao atualizar o produto:', error);
      });
    }).catch(error => {
      console.error('Erro ao buscar os produtos:', error);
    });

  }
}


  getProdutoNome(produtoId: number): string {
    const produto = this.produtos.find(prod => prod.id === produtoId);
    return produto ? produto.Nome : 'Produto desconhecido';
  }

  voltar (){
    this.navCtrl.navigateForward('/menu-estoque',{
      queryParams:{idestoque: this.idestoque}
    });
  }

}
