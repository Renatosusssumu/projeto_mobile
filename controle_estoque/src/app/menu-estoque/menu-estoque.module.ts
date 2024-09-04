import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuEstoquePageRoutingModule } from './menu-estoque-routing.module';

import { MenuEstoquePage } from './menu-estoque.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuEstoquePageRoutingModule
  ],
  declarations: [MenuEstoquePage]
})
export class MenuEstoquePageModule {}
