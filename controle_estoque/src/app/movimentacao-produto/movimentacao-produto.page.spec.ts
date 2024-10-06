import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovimentacaoProdutoPage } from './movimentacao-produto.page';

describe('MovimentacaoProdutoPage', () => {
  let component: MovimentacaoProdutoPage;
  let fixture: ComponentFixture<MovimentacaoProdutoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimentacaoProdutoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
