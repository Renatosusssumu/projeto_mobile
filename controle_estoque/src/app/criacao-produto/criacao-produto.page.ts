import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-criacao-produto',
  templateUrl: './criacao-produto.page.html',
  styleUrls: ['./criacao-produto.page.scss'],
})

export class CriacaoProdutoPage implements OnInit {
  
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  criacaoprodForm: FormGroup;

  ngOnInit() {
    this.folder = 'CadastroProd'
  }
  constructor(private fb: FormBuilder, private navCtrl: NavController) {
    this.criacaoprodForm = this.fb.group({
      nomeprod: ['', Validators.required],
      cod: ['', Validators.required],
      quant: ['', Validators.required],
      quantmin: ['', Validators.required],
      dataval: ['', Validators.required],
      categ: ['', Validators.required],
      valpag: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.criacaoprodForm.valid) {
      this.navCtrl.navigateForward('/menu-estoque', {
        queryParams: this.criacaoprodForm.value
      });
    }
  }
  

}
