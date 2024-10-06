import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovimentacaoProdutoPage } from './movimentacao-produto.page';

const routes: Routes = [
  {
    path: '',
    component: MovimentacaoProdutoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovimentacaoProdutoPageRoutingModule {}
