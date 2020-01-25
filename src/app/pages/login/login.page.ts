import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';
  passReset: boolean = false;

  validation_messages = {
    'email': [
      {type: 'required', message: 'Correo requerido.'},
      {type: 'pattern', message: 'Por favor ingresar un correo valido.'}
    ],
    'password': [
      {type: 'required', message: 'Contraseña requerida.'},
      {type: 'minlength', message: 'La contraseña debe tener mas de 5 digitos.'}
    ]
  };

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
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
    });
  }

  tryLogin(value) {
    this.authService.doLogin(value)
      .then(res => {
        this.router.navigate(['/tabs/tab1']);
      }, err => {
        this.errorMessage = err.message;
        console.log(err);
      });
  }

  goRegisterPage() {
    this.router.navigate(['/registro']);
  }

  resetPassword() {
    this.authService.resetPassword(this.validations_form.value['email'])
    .then(() => this.passReset = true)
  }

}
