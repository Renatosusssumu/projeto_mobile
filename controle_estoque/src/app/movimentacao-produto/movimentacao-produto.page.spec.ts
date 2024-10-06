import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';


import { MovimentacaoProdutoPage } from './movimentacao-produto.page';

describe('MovimentacaoProdutoPage', () => {
  let component: MovimentacaoProdutoPage;
  let fixture: ComponentFixture<MovimentacaoProdutoPage>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [MovimentacaoProdutoPage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(MovimentacaoProdutoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
