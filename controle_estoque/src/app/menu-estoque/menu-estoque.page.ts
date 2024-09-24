import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-menu-estoque',
  templateUrl: './menu-estoque.page.html',
  styleUrls: ['./menu-estoque.page.scss'],
})
export class MenuEstoquePage implements OnInit {
  @ViewChild(IonModal, { static: false }) modal!: IonModal;  // Agora o segundo argumento está presente
  alertButtons = ['OK'];
  public folder!: string;
  categoriaForm: FormGroup;

  constructor(private fb: FormBuilder, private navCtrl:NavController, private activatedRoute: ActivatedRoute) { 
    this.categoriaForm = this.fb.group({
      categoria:['', Validators.required],
    });
  }

  onSubmit(){
    if (this.categoriaForm.valid){
      this.navCtrl.navigateForward('/menu-estoque',{
        queryParams: this.categoriaForm.value
      });
    }
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  cancel(){
    if (this.modal){
      this.modal.dismiss();
    }
  }

}
