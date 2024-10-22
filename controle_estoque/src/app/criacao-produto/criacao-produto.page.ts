import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IndexeddbService } from '../service/indexeddb.service'; 

interface Produto {
  id?: string;
  Nome: string;
  CodigoBarras: string;
  QuantidadeEstoque: number;
  QuantidadeMinima: number;
  DataValidade: string;
  Categoria: string;
  ValorPago: number;
  Esto: string;
}

@Component({
  selector: 'app-criacao-produto',
  templateUrl: './criacao-produto.page.html',
  styleUrls: ['./criacao-produto.page.scss'],
})
export class CriacaoProdutoPage implements OnInit {
  public folder!: string;
  criacaoprodForm: FormGroup;
  idestoque!: string;
  categoria: any[] = [];
  produtoId!: string | null; // Alterado para ser null ou string

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private indexeddbService: IndexeddbService,
    private route: ActivatedRoute
  ) {
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
      this.produtoId = params['produtoId'] || null; // Captura o ID do produto se houver
      if (this.produtoId) {
        this.loadProduto(this.produtoId); // Carregar dados do produto
      }
    });
  }

  async onSubmit() {
    if (this.criacaoprodForm.valid) {
      const produto: Produto = {
        Nome: this.criacaoprodForm.value.nomeprod,
        CodigoBarras: this.criacaoprodForm.value.cod,
        QuantidadeEstoque: this.criacaoprodForm.value.quant,
        QuantidadeMinima: this.criacaoprodForm.value.quantmin,
        DataValidade: this.criacaoprodForm.value.dataval,
        Categoria: this.criacaoprodForm.value.categ,
        ValorPago: this.criacaoprodForm.value.valpag,
        Esto: this.idestoque,
      };

      try {
        if (this.produtoId) {
          // Atualiza o produto existente
          produto.id = this.produtoId; // Adiciona o ID ao objeto do produto
          await this.indexeddbService.updateData('Produto', produto);
          console.log('Produto atualizado com sucesso');
        } else {
          // Adiciona um novo produto
          await this.indexeddbService.addData('Produto', produto);
        }

        // Redirecionar para o menu de estoque após salvar
        this.navCtrl.navigateForward('/menu-estoque', {
          queryParams: { idestoque: this.idestoque }
        });
      } catch (error) {
        console.error('Erro ao salvar ou atualizar o produto', error);
      }
    }
  }

  loadCategorias() {
    this.indexeddbService.getAllData('Categorias').then((categoria) => {
      this.categoria = categoria.filter(c => c.Esto === this.idestoque);
    });
  }

  ionViewWillEnter() {
    this.loadCategorias();
  }

  voltar() {
    this.navCtrl.navigateForward('/menu-estoque', {
      queryParams: { idestoque: this.idestoque }
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
