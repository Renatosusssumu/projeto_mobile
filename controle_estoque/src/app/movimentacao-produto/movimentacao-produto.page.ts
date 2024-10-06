import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { IndexeddbService } from '../service/indexeddb.service';

@Component({
  selector: 'app-movimentacao-produto',
  templateUrl: './movimentacao-produto.page.html',
  styleUrls: ['./movimentacao-produto.page.scss'],
})
export class MovimentacaoProdutoPage implements OnInit {

  movimentacaoprodForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private indexeddbService: IndexeddbService
  ) { 
    this.movimentacaoprodForm = this.fb.group({
      acao: ['', Validators.required],
      produto: ['', Validators.required],
      quant: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.movimentacaoprodForm.valid) {
      // Capturar a data e hora atuais do dispositivo
      const currentDateTime = new Date().toISOString();

      const movimentacao = {
        Acao: this.movimentacaoprodForm.value.acao,
        Produto: this.movimentacaoprodForm.value.produto,
        Quantidade: this.movimentacaoprodForm.value.quant,
        Data: currentDateTime // Adiciona a data e hora atual
      };

      // Armazenar a movimentação no IndexedDB
      this.indexeddbService.addData('Movimentacao', movimentacao);

      // Navegar para a página de movimentação do produto
      this.navCtrl.navigateForward('movimentacao-produto');
    }
  }

}
