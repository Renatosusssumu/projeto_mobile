import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'menu-estoque',
    loadChildren: () => import('./menu-estoque/menu-estoque.module').then( m => m.MenuEstoquePageModule)
  },
  {
    path: 'criacao-produto',
    loadChildren: () => import('./criacao-produto/criacao-produto.module').then( m => m.CriacaoProdutoPageModule)
  },
  {
    path: 'historico',
    loadChildren: () => import('./historico/historico.module').then( m => m.HistoricoPageModule)
  },  {
    path: 'movimentacao-produto',
    loadChildren: () => import('./movimentacao-produto/movimentacao-produto.module').then( m => m.MovimentacaoProdutoPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
