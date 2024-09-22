import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CriacaoProdutoPageRoutingModule } from './criacao-produto-routing.module';
import { CriacaoProdutoPage } from './criacao-produto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CriacaoProdutoPageRoutingModule
  ],
  declarations: [CriacaoProdutoPage]
})
export class CriacaoProdutoPageModule {}
