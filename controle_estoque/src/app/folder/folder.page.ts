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
  estoques: any[] = []; // Adicione esta linha

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private indexeddbService: IndexeddbService // Injetando o serviço
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
      this.estoques = estoques; // Atualiza a lista de estoques
    });
  }

  onSubmit() {
    if (this.criacaoestForm.valid) {
      const novoEstoque = {
        Nome: this.criacaoestForm.value.nomeest
      };
      this.indexeddbService.addData('Estoque', novoEstoque).then(() => {
        this.loadEstoques(); // Recarrega a lista de estoques
        this.modal.dismiss(); // Fecha o modal
      });
    }
  }

  deleteEstoque(id: number) {
    this.indexeddbService.deleteData('Estoque', id).then(() => {
      this.loadEstoques(); // Recarrega a lista de estoques
    });
  }

  editEstoque(estoque: any) {
    
  }

  cancel() {
    if (this.modal) {
      this.modal.dismiss(); // Fechar o modal
    }
  }
}
