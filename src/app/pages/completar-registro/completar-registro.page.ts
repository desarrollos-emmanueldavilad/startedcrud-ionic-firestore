import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Component, OnInit } from '@angular/core';
import { CompletarRegistroService } from 'src/app/services/completar-registro.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';



@Component({
  selector: 'app-completar-registro',
  templateUrl: './completar-registro.page.html',
  styleUrls: ['./completar-registro.page.scss'],
})
export class CompletarRegistroPage implements OnInit {

  validations_form: FormGroup;
  errorMessage = '';
  successMessage = '';
  image: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private firebaseService: CompletarRegistroService,
    private camera: Camera,
    private imagePicker: ImagePicker,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private webview: WebView,
  ) { }

  ngOnInit() {
    this.resetFields();
  }

  resetFields(){
    this.image = './assets/imgs/retech.png';
    this.validations_form = this.formBuilder.group({
      nombre: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      fechaNacimiento: new FormControl('', Validators.required),
      edad: new FormControl('', Validators.required),
    });
  }

  onSubmit(value){
    const data = {
      nombre: value.nombre,
      email: value.email,
      apellido: value.apellido,
      fechaNacimiento: value.fechaNacimiento,
      edad: value.edad,
      image: this.image
    }
    this.firebaseService.createInquilinoPerfil(data)
      .then(
        res => {
          this.router.navigate(['/tabs/tab1']);
        }
      )
  }


  openImagePicker(){
    this.imagePicker.hasReadPermission()
      .then((result) => {
        if(result == false){
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        }
        else if(result == true){
          this.imagePicker.getPictures({
            maximumImagesCount: 1
          }).then(
            (results) => {
              for (var i = 0; i < results.length; i++) {
                this.uploadImageToFirebase(results[i]);
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  async uploadImageToFirebase(image){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    const toast = await this.toastCtrl.create({
      message: 'Image was updated successfully',
      duration: 3000
    });
    this.presentLoading(loading);
    let image_src = this.webview.convertFileSrc(image);
    let randomId = Math.random().toString(36).substr(2, 5);

    //uploads img to firebase storage
    this.firebaseService.uploadImage(image_src, randomId)
      .then(photoURL => {
        this.image = photoURL;
        loading.dismiss();
        toast.present();
      }, err =>{
        console.log(err);
      })
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  getPicture(){
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100
    }
    this.camera.getPicture( options )
    .then(imageData => {
      this.image = `data:image/jpeg;base64,${imageData}`;
    })
    .catch(error =>{
      console.error( error );
    });
  }
}
