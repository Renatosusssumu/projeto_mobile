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
  @ViewChild(IonModal, { static: false }) modal!: IonModal;  // Agora o segundo argumento está presente
  alertButtons = ['OK'];
  public folder!: string;
  categoriaForm: FormGroup;

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
  }

  

  cancel() {
    if (this.modal) {
      this.modal.dismiss();
    }
  }
}