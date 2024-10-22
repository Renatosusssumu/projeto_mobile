import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, NavParams } from '@ionic/angular';
import { IndexeddbService } from '../service/indexeddb.service';  // Importe o serviço de IndexedDB

@Component({
  selector: 'app-criacao-produto',
  templateUrl: './criacao-produto.page.html',
  styleUrls: ['./criacao-produto.page.scss'],
})
export class CriacaoProdutoPage implements OnInit {

  public folder!: string;
  criacaoprodForm: FormGroup;
  idestoque!:string;
  categoria:any[]=[];

  // Injetar o serviço IndexedDB
  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private indexeddbService: IndexeddbService,
    private route: ActivatedRoute
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
    this.loadCategorias();
  
    this.route.queryParams.subscribe(params => {
      this.idestoque = params['idestoque'];
      const produtoId = params['produtoId']; // Capturar o ID do produto se houver
      if (produtoId) {
        this.loadProduto(produtoId); // Carregar dados do produto
      }
    });
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
        ValorPago: this.criacaoprodForm.value.valpag,
        Esto:this.idestoque,
      };

      // Adicionando o produto no banco de dados (IndexedDB)
      this.indexeddbService.addData('Produto', produto);

      // Redirecionar para o menu de estoque após salvar
      this.navCtrl.navigateForward('/menu-estoque',{
        queryParams:{idestoque: this.idestoque}
      });
    }
  }

  loadCategorias() {
    this.indexeddbService.getAllData('Categorias').then((categoria) => {
      this.categoria = categoria.filter(categoria => categoria.Esto === this.idestoque);
    });
  }

  ionViewWillEnter() {
    this.loadCategorias();
  }

  voltar (){
    this.navCtrl.navigateForward('/menu-estoque',{
      queryParams:{idestoque: this.idestoque}
    });
  }
  loadProduto(produtoId: string) {
    this.indexeddbService.getAllData('Produto').then(produtos => {
      const produto = produtos.find(p => p.id === produtoId);
      if (produto) {
        // Preenche o formulário com os dados do produto
        this.criacaoprodForm.patchValue({
          nomeprod: produto.Nome,
          cod: produto.CodigoBarras,
          quant: produto.QuantidadeEstoque,
          quantmin: produto.QuantidadeMinima,
          dataval: produto.DataValidade,
          categ: produto.Categoria,
          valpag: produto.ValorPago
        });
      }
    });
  }
   
}
