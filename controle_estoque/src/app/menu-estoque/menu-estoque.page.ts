import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndexeddbService } from '../service/indexeddb.service';  

@Component({
  selector: 'app-menu-estoque',
  templateUrl: './menu-estoque.page.html',
  styleUrls: ['./menu-estoque.page.scss'],
})
export class MenuEstoquePage implements OnInit {
  @ViewChild(IonModal, { static: false }) modal!: IonModal;
  @ViewChild('produtoModal', { static: false }) produtoModal!: IonModal;
  @ViewChild('vencimentoModal', { static: false }) vencimentoModal!: IonModal;
  @ViewChild('listaModal', { static: false }) listaModal!: IonModal;
  alertButtons = ['OK'];
  public folder!: string;
  categoriaForm: FormGroup;
  produtos: any[] = [];
  produtosFiltrados: any[] = []; // Definir produtosFiltrados
  selectedProduto: any = null;
  categorias: any[] = [];
  vencidos: any[] = [];
  idestoque!: string;
  listaCompras: any[] = [];
  searchTerm: string = ''; // Definir searchTerm
  categoriaEditando : any =null;



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


  async ngOnInit() {
    // Capturando algum parâmetro de rota, se houver
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;

    this.loadProduto();
    this.loadCategoria();
    this.produtosVencidos();
    
    this.route.queryParams.subscribe(params => {
      this.idestoque = params['idestoque'];
      console.log('ID Estoque recebido:', this.idestoque);
    });
  }

  ionViewWillEnter() {
    this.loadProduto(); // Carrega os estoques ao entrar na página
    this.loadCategoria();
    this.produtosVencidos();
    this.loadListaCompras();
  }

  filterProducts() {
    const term = this.searchTerm.toLowerCase(); // Normalizar termo de busca
    this.produtosFiltrados = this.produtos.filter(produto => {
      const nome = produto.nome?.toLowerCase() || '';
      const codigoBarra = produto.codigoBarra?.toLowerCase() || '';
      const categoria = produto.categoria?.toLowerCase() || '';
      
      return nome.includes(term) || codigoBarra.includes(term) || categoria.includes(term);
    });
  }

  async onSubmit() {
    if (this.categoriaForm.valid) {
      const categoriaNome = this.categoriaForm.value.categoria;
    
      if (this.categoriaEditando && this.categoriaEditando.id) {
        // Atualizar categoria existente
        const categoriaAtualizada = { 
          ...this.categoriaEditando,  // Preserva o id e outros atributos
          Nome: categoriaNome 
        };
    
        try {
          await this.indexeddbService.updateData('Categorias', categoriaAtualizada);
          console.log('Categoria atualizada com sucesso!');
          this.loadCategoria(); // Recarrega as categorias
        } catch (error) {
          console.error('Erro ao atualizar a categoria:', error);
        }
      } else {
        // Criar nova categoria
        try {
          const novaCategoria = { Nome: categoriaNome, Esto: this.idestoque };
          await this.indexeddbService.addData('Categorias', novaCategoria);
          console.log('Categoria adicionada com sucesso!');
          this.loadCategoria(); // Recarrega as categorias
        } catch (error) {
          console.error('Erro ao adicionar a categoria:', error);
        }
      }
    
      // Fechar o modal após salvar
      this.modal.dismiss();
      this.categoriaEditando = null; // Limpar o objeto de edição
    }
  }
  
  

  loadProduto() {
    this.indexeddbService.getAllData('Produto').then((produtos) => {
      this.produtos = produtos.filter(produtos => produtos.Esto == this.idestoque);
    });
  }

  loadCategoria() {
    this.indexeddbService.getAllData('Categorias').then((categorias) => {
      this.categorias = categorias.filter(categoria => categoria.Esto == this.idestoque);
    });
  }

  loadListaCompras() {
    this.indexeddbService.getAllData('Produto').then((produtos) => {
      this.listaCompras = produtos.filter(produto => produto.QuantidadeEstoque < produto.QuantidadeMinima && produto.Esto == this.idestoque);
    });
  }

  produtosVencidos() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Pega apenas a data, no formato YYYY-MM-DD
    this.indexeddbService.getAllData('Produto').then((vencidos) => {
      this.vencidos = vencidos.filter(produto => {
        const dataValidade = produto.DataValidade.split('T')[0]; // Pega apenas a parte da data da validade
        return dataValidade < formattedDate && produto.Esto == this.idestoque; // Compara as datas
      });
    });
  }

  deleteProduto(id: number) {
    this.indexeddbService.deleteData('Produto', id).then(() => {
      this.loadProduto(); // Recarrega a lista de produto
    });
  }

  deleteCategoria(id: number) {
    this.indexeddbService.deleteData('Categorias', id).then(() => {
      this.loadCategoria(); // Recarrega a lista de categoria
    });
  }

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

  openProdutoModal(produto: any) {
    this.selectedProduto = produto;  // Defina o produto selecionado
    this.produtoModal.present();     // Abra o modal
  }

  dismissProdutoModal() {
    if (this.produtoModal) {
      this.produtoModal.dismiss();
      this.selectedProduto = null;   // Limpar o produto selecionado ao fechar o modal
    }
  }

  criacaoProd() {
    this.navCtrl.navigateForward('/criacao-produto', {
      queryParams: { idestoque: this.idestoque }
    });
  }

  historico() {
    this.navCtrl.navigateForward('/historico', {
      queryParams: { idestoque: this.idestoque }
    });
  }

  voltar() {
    this.navCtrl.navigateForward('/folder/inbox', {
      queryParams: { idestoque: this.idestoque }
    });
  }
  editProduto(produto: any) {
    // Navegar para a página de criação de produto, passando os dados do produto a ser editado
    this.navCtrl.navigateForward('/criacao-produto', {
      queryParams: {
        idestoque: this.idestoque,
        produtoId: produto.id // Passando o ID do produto a ser editado
      }
    });
  }
  editCategoria(categoria: any) {
    this.categoriaEditando = categoria; // Definir a categoria que será editada
    
    // Preencher o formulário com os dados da categoria
    this.categoriaForm.patchValue({
      categoria: categoria.Nome, // Preenche o campo de nome
    });
  
    // Abrir o modal para edição
    if (this.modal) {
      this.modal.present();
    } else {
      console.error('Modal não foi encontrado');
    }
  }
  
  
  
}
