import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CriacaoProdutoPage } from './criacao-produto.page';

describe('CriacaoProdutoPage', () => {
  let component: CriacaoProdutoPage;
  let fixture: ComponentFixture<CriacaoProdutoPage>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [CriacaoProdutoPage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CriacaoProdutoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
