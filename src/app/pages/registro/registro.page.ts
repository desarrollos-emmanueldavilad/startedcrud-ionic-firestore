import { FirebaseService } from './../../services/firebase.service';
import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup, FormControl, AbstractControl} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CompletarRegistroService } from 'src/app/services/completar-registro.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {


  validations_form: FormGroup;
  errorMessage = '';
  successMessage = '';
  image: any;

  validation_messages = {
    'email': [
      {type: 'required', message: 'Correo requerido.'},
      {type: 'pattern', message: 'Correo inválido.'}
    ],
    'password': [
      {type: 'required', message: 'Contraseña requerida.'},
      {type: 'minlength', message: 'Debe tener más de 5 dígitos.'}
    ],
    'confirmPassword': [
      {type: 'required', message: 'Contraseña requerida.'},
      {type: 'minlength', message: 'Debe tener más de 5 dígitos.'},
      {type: 'notMatch', message: 'Las contraseñas deben ser iguales.'}
    ]
  };

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private camera: Camera
  ) {
  }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        password: new FormControl('', Validators.compose([
          Validators.minLength(5),
          Validators.required
        ])),
        confirmPassword: new FormControl('', Validators.compose([
          Validators.minLength(5),
          Validators.required,
          PasswordValidator.MatchPassword
        ])),
        check: new FormControl('', Validators.required),
      }
    );
  }

  tryRegister(value){
    this.authService.doRegister(value)
     .then(res => {
       console.log(res);
       this.errorMessage = "Ocurrio un error al crear tu cuenta";
       this.successMessage = "Tu Cuenta fue creada..";
       this.router.navigate(['/completar-registro'])
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = "La contraseña o el correo no son correctos";
     })
  }

  goLoginPage(){
    this.router.navigate(["/login"]);
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
