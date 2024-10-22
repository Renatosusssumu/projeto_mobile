import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal, NavController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndexeddbService } from '../service/indexeddb.service';  

@Component({
  selector: 'app-menu-estoque',
  templateUrl: './menu-estoque.page.html',
  styleUrls: ['./menu-estoque.page.scss'],
})
export class MenuEstoquePage implements OnInit {

  @ViewChild('produtoModal', { static: false }) produtoModal!: IonModal;
  @ViewChild('vencimentoModal', { static: false }) vencimentoModal!: IonModal;
  @ViewChild('listaModal', { static: false }) listaModal!: IonModal;
  alertButtons = ['OK'];
  public folder!: string;
  categoriaForm: FormGroup;
  produtos: any[]=[];
  selectedProduto: any = null;
  categorias: any[]=[];
  vencidos: any[]=[];
  idestoque !: string;
  listaCompras: any[] = [];

  


  constructor(
    private fb: FormBuilder, 
    private navCtrl: NavController, 
    private activatedRoute: ActivatedRoute,

    private indexeddbService: IndexeddbService,  // Injetando o IndexedDBService
    private route: ActivatedRoute

  ) { 
    
    this.categoriaForm = this.fb.group({
      categoria: ['', Validators.required],
    });
  }

  
  async onSubmit() {
    if (this.categoriaForm.valid) {
      const categoria = this.categoriaForm.value.categoria;

      
      const existingCategory = await this.indexeddbService.getCategoryByName(categoria);
      if (existingCategory) {
        console.log('Categoria já existe:', existingCategory);
        return;
      }
      try {
        const categoria = {
          Nome: this.categoriaForm.value.categoria,
          Esto: this.idestoque,
        }
        await this.indexeddbService.addData('Categorias', categoria);
        console.log('Categoria adicionada com sucesso');

        this.loadCategoria();

      } catch (error) {
        console.error('Erro ao adicionar a categoria:', error);
      }
    }
  }


  ngOnInit() {
    this.loadProduto();
    this.loadCategoria();
    this.produtosVencidos();
    
    this.route.queryParams.subscribe(params => {
      this.idestoque = params['idestoque'];
      console.log('ID Estoque recebido:', this.idestoque);  // Verifique se o ID foi corretamente recebido
    });
  }

  ionViewWillEnter() {
    this.loadProduto(); // Carrega os estoques ao entrar na página
    this.loadCategoria();
    this.produtosVencidos();
    this.loadListaCompras();
  }

  loadProduto(){
    this.indexeddbService.getAllData('Produto').then((produtos) => {
      this.produtos = produtos.filter(produtos => produtos.Esto == this.idestoque);
    });
  }

  loadCategoria(){
    this.indexeddbService.getAllData('Categorias').then((categorias) => {
      this.categorias = categorias.filter(categoria => categoria.Esto == this.idestoque);
    });
  }

  loadListaCompras() {
    this.indexeddbService.getAllData('Produto').then((produtos) => {
      this.listaCompras = produtos.filter(produto => produto.QuantidadeEstoque < produto.QuantidadeMinima && produto.Esto == this.idestoque);
    });
  }
  

  produtosVencidos(){
    const today = new Date();
  const formattedDate = today.toISOString().split('T')[0]; // Pega apenas a data, no formato YYYY-MM-DD
  this.indexeddbService.getAllData('Produto').then((vencidos) => {
    this.vencidos = vencidos.filter(produto => {
      const dataValidade = produto.DataValidade.split('T')[0]; // Pega apenas a parte da data da validade
      return dataValidade < formattedDate && produto.Esto == this.idestoque; // Compara as datas
    });
  });
  }

  deleteProduto(id: number){
    this.indexeddbService.deleteData('Produto', id).then(() => {
      this.loadProduto(); // Recarrega a lista de produto
    });
  }
  
  deleteCategoria(id: number){
    this.indexeddbService.deleteData('Categorias', id).then(() => {
      this.loadCategoria(); // Recarrega a lista de categoria
    });
  }

  // Métodos para fechar os modais
  dismissVencimento() {
    if (this.vencimentoModal) {
      this.vencimentoModal.dismiss();
    }
  }

  dismissLista() {
    if (this.listaModal) {
      this.listaModal.dismiss();
    }
  }

   // Abrir o modal com os detalhes do produto
   openProdutoModal(produto: any) {
    this.selectedProduto = produto;  // Defina o produto selecionado
    this.produtoModal.present();     // Abra o modal
  }

  // Fechar o modal
  dismissProdutoModal() {
    if (this.produtoModal) {
      this.produtoModal.dismiss();
      this.selectedProduto = null;   // Limpar o produto selecionado ao fechar o modal
    }
  }

  criacaoProd (){
    this.navCtrl.navigateForward('/criacao-produto',{
      queryParams:{idestoque: this.idestoque}
    });
  }

  historico (){
    this.navCtrl.navigateForward('/historico',{
      queryParams:{idestoque: this.idestoque}
    });
  }
  voltar (){
    this.navCtrl.navigateForward('/folder/inbox',{
      queryParams:{idestoque: this.idestoque}
    });
  }

}

