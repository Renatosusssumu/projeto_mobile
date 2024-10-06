import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndexeddbService } from '../service/indexeddb.service';  // Importando o serviço IndexedDB

@Component({
  selector: 'app-menu-estoque',
  templateUrl: './menu-estoque.page.html',
  styleUrls: ['./menu-estoque.page.scss'],
})
export class MenuEstoquePage implements OnInit {
  @ViewChild('vencimentoModal', { static: false }) vencimentoModal!: IonModal;
  @ViewChild('listaModal', { static: false }) listaModal!: IonModal;
  alertButtons = ['OK'];
  public folder!: string;
  categoriaForm: FormGroup;
  produtos: any[]=[];
  categorias: any[]=[];

  constructor(
    private fb: FormBuilder, 
    private navCtrl: NavController, 
    private activatedRoute: ActivatedRoute,
    private indexeddbService: IndexeddbService  // Injetando o IndexedDBService
  ) { 
    // Formulário para adição de categorias
    this.categoriaForm = this.fb.group({
      categoria: ['', Validators.required],
    });
  }

  // Ao submeter, adiciona a categoria ao banco de dados e navega
  async onSubmit() {
    if (this.categoriaForm.valid) {
      const categoria = this.categoriaForm.value.categoria;

      // Verificar se a categoria já existe
      const existingCategory = await this.indexeddbService.getCategoryByName(categoria);
      if (existingCategory) {
        console.log('Categoria já existe:', existingCategory);
        return;
      }
      
      // Adicionando categoria ao IndexedDB
      try {
        await this.indexeddbService.addData('Categorias', { Nome: categoria });
        console.log('Categoria adicionada com sucesso');
        this.loadCategoria();
        // Redireciona o usuário após adicionar a categoria
        this.navCtrl.navigateForward('/menu-estoque', {
          queryParams: this.categoriaForm.value
        });
      } catch (error) {
        console.error('Erro ao adicionar a categoria:', error);
      }
    }
  }

  ngOnInit() {
    // Capturando algum parâmetro de rota, se houver
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.loadProduto();
  }
  ionViewWillEnter() {
    this.loadProduto(); // Carrega os estoques ao entrar na página
    this.loadCategoria();
  }

  loadProduto(){
    this.indexeddbService.getAllData('Produto').then((produtos) => {
      this.produtos = produtos;
    });
  }

  loadCategoria(){
    this.indexeddbService.getAllData('Categorias').then((categorias) => {
      this.categorias = categorias;
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
}
