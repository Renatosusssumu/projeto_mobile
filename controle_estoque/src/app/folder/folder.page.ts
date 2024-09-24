import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  @ViewChild(IonModal, { static: false }) modal!: IonModal;  // Agora o segundo argumento está presente
  alertButtons = ['OK'];
  public folder!: string;
  criacaoestForm: FormGroup;

  constructor(private fb: FormBuilder, private navCtrl: NavController, private activatedRoute: ActivatedRoute) {
    this.criacaoestForm = this.fb.group({
      nomeest: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.criacaoestForm.valid) {
      this.navCtrl.navigateForward('/folder', {
        queryParams: this.criacaoestForm.value
      });
    }
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }
  
  cancel() {
    if (this.modal) {
      this.modal.dismiss();  // Fechar o modal
    }
  }
}
