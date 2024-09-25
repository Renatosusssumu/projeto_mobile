import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IndexeddbService } from '../services/indexeddb.service';  // Importe o serviço de IndexedDB

@Component({
  selector: 'app-criacao-produto',
  templateUrl: './criacao-produto.page.html',
  styleUrls: ['./criacao-produto.page.scss'],
})
export class CriacaoProdutoPage implements OnInit {

  public folder!: string;
  criacaoprodForm: FormGroup;

  // Injetar o serviço IndexedDB
  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private indexeddbService: IndexeddbService
  ) {
    // Inicializando o formulário
    this.criacaoprodForm = this.fb.group({
      nomeprod: ['', Validators.required],
      cod: ['', Validators.required],
      quant: ['', Validators.required],
      quantmin: ['', Validators.required],
      dataval: ['', Validators.required],
      categ: ['', Validators.required],
      valpag: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.folder = 'Cadastro de Produto';
  }

  // Método para enviar os dados do formulário e salvar no IndexedDB
  onSubmit() {
    if (this.criacaoprodForm.valid) {
      // Extrair dados do formulário
      const produto = {
        Nome: this.criacaoprodForm.value.nomeprod,
        CodigoBarras: this.criacaoprodForm.value.cod,
        QuantidadeEstoque: this.criacaoprodForm.value.quant,
        QuantidadeMinima: this.criacaoprodForm.value.quantmin,
        DataValidade: this.criacaoprodForm.value.dataval,
        Categoria: this.criacaoprodForm.value.categ,
        ValorPago: this.criacaoprodForm.value.valpag
      };

      // Adicionando o produto no banco de dados (IndexedDB)
      this.indexeddbService.addData('Produto', produto);

      // Redirecionar para o menu de estoque após salvar
      this.navCtrl.navigateForward('/menu-estoque');
    }
  }
}
