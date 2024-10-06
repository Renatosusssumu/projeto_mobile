import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndexeddbService } from '../service/indexeddb.service'; // Ajuste o caminho conforme necessário

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  @ViewChild(IonModal, { static: false }) modal!: IonModal;
  alertButtons = ['OK'];
  public folder!: string;
  criacaoestForm: FormGroup;
  estoques: any[] = [];
  estoqueEditando: any = null; // Variável para armazenar o estoque em edição

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private indexeddbService: IndexeddbService
  ) {
    this.criacaoestForm = this.fb.group({
      nomeest: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.loadEstoques(); // Carrega estoques ao iniciar
  }

  loadEstoques() {
    this.indexeddbService.getAllData('Estoque').then((estoques) => {
      this.estoques = estoques;
    });
  }

  onSubmit() {
    if (this.criacaoestForm.valid) {
      const nome = this.criacaoestForm.value.nomeest;
      if (this.estoqueEditando) {
        // Atualizar o estoque existente
        this.estoqueEditando.Nome = nome;
        this.indexeddbService.updateData('Estoque', this.estoqueEditando).then(() => {
          this.loadEstoques(); // Recarrega a lista de estoques
          this.modal.dismiss(); // Fecha o modal
          this.estoqueEditando = null; // Resetar o modo de edição
        });
      } else {
        // Criar novo estoque
        const novoEstoque = { Nome: nome };
        this.indexeddbService.addData('Estoque', novoEstoque).then(() => {
          this.loadEstoques(); // Recarrega a lista de estoques
          this.modal.dismiss(); // Fecha o modal
        });
      }
    }
  }

  deleteEstoque(id: number) {
    this.indexeddbService.deleteData('Estoque', id).then(() => {
      this.loadEstoques(); // Recarrega a lista de estoques
    });
  }

  editEstoque(estoque: any) {
    this.estoqueEditando = estoque; // Definir o estoque que será editado
    this.criacaoestForm.patchValue({
      nomeest: estoque.Nome, // Preencher o formulário com os dados do estoque
    });
    this.modal.present(); // Abrir o modal para edição
  }

  cancel() {
    if (this.modal) {
      this.modal.dismiss(); // Fechar o modal
      this.estoqueEditando = null; // Resetar o modo de edição
    }
  }
}
