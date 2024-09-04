import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuEstoquePage } from './menu-estoque.page';

describe('MenuEstoquePage', () => {
  let component: MenuEstoquePage;
  let fixture: ComponentFixture<MenuEstoquePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuEstoquePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
