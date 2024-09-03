import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuEstoquePage } from './menu-estoque.page';

const routes: Routes = [
  {
    path: '',
    component: MenuEstoquePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuEstoquePageRoutingModule {}
