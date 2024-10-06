import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovimentacaoProdutoPageRoutingModule } from './movimentacao-produto-routing.module';

import { MovimentacaoProdutoPage } from './movimentacao-produto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MovimentacaoProdutoPageRoutingModule
  ],
  declarations: [MovimentacaoProdutoPage]
})
export class MovimentacaoProdutoPageModule {}
