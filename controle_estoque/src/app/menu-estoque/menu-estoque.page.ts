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
  alertButtons = ['OK'];
  public folder!: string;
  categoriaForm: FormGroup;
  produtos: any[] = []; 
  produtosFiltrados: any[] = []; 
  searchTerm: string = ''; 

  constructor(
    private fb: FormBuilder, 
    private navCtrl: NavController, 
    private activatedRoute: ActivatedRoute,
    private indexeddbService: IndexeddbService  
  ) { 
    
    this.categoriaForm = this.fb.group({
      categoria: ['', Validators.required],
    });
  }

  async ngOnInit() {
    
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;

    
    this.produtos = await this.indexeddbService.getAllData('Produtos');
    this.produtosFiltrados = this.produtos; 
  }

  
  filterProducts() {
    const term = this.searchTerm.toLowerCase(); 

    this.produtosFiltrados = this.produtos.filter(produto => {
      const nome = produto.nome?.toLowerCase() || '';
      const codigoBarra = produto.codigoBarra?.toLowerCase() || '';
      const categoria = produto.categoria?.toLowerCase() || '';
      
      
      return nome.includes(term) || codigoBarra.includes(term) || categoria.includes(term);
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
        await this.indexeddbService.addData('Categorias', { Nome: categoria });
        console.log('Categoria adicionada com sucesso');
        
        this.navCtrl.navigateForward('/menu-estoque', {
          queryParams: this.categoriaForm.value
        });
      } catch (error) {
        console.error('Erro ao adicionar a categoria:', error);
      }
    }
  }
  cancel() {
    if (this.modal) {
      this.modal.dismiss();
    }
  }
}
