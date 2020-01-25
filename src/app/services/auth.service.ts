import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseService } from './firebase.service';
import { Inquilino, UserInterface } from '../pages/models/user';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;

  constructor(
    private firebaseService: FirebaseService,
    public afAuth: AngularFireAuth,
    private afsAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    public ngZone: NgZone
  ){}

  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
    .then(() => {
    this.router.navigate(['login']);
    })
    }

 /* doRegister(value) {
    return new Promise((resolve, reject) => {
      this.afsAuth.auth.createUserWithEmailAndPassword(value.email, value.password)
        .then(userData => {
        this.SendVerificationMail(); // Sending email verification notification, when new user registers
          resolve(userData),
            this.updateUserData(userData.user)
        }).catch(err => console.log(reject(err)))
    });
  }*/

  // Sign up with email/password
  doRegister(value) {
  return this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password)
  .then((result) => {
  this.SendVerificationMail(); // Sending email verification notification, when new user registers
  }).catch((error) => {
  window.alert(error.message)
  })
  }

  // Sign in with email/password
  doLogin(value) {
  return this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password)
  .then((result) => {
  if (result.user.emailVerified !== true) {
  this.SendVerificationMail();
  window.alert('Por favor confirma tu correo electronico.');
  } else {
  this.ngZone.run(() => {
  this.router.navigate(['/tabs/tab1']);
  });
  }
  this.SetUserData(result.user);
  }).catch((error) => {
  window.alert(error.message)
  })
  }

  resetPassword(email: string) {
    var auth = firebase.auth();
    return auth.sendPasswordResetEmail(email)
      .then(() => alert("Se te envio un correo electronico"))
      .catch((error) => console.log(error))
  }

 /* private updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`inquilinos/${user.uid}`);
    const data: UserInterface = {
      id: user.uid,
      email: user.email,
      roles: {
        inquilinos: true,
      }
    }
    return userRef.set(data, { merge: true });
  }
  */
  isAuth() {
    return this.afsAuth.authState.pipe(map(auth => auth));
  }

  isUserAdmin(userUid) {
    return this.afs.doc<UserInterface>(`admin/${userUid}`).valueChanges();
  }
  isUserInquilinos(userUid) {
    return this.afs.doc<UserInterface>(`inquilinos/${userUid}`).valueChanges();
  }

  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`inquilino/${user.uid}`);
    const userData: Inquilino = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    roles: {
      inquilinos: true,
    }
    }
    return userRef.set(userData, {
    merge: true
    })
  
  }


/*  doLogin(value){
  return new Promise<any>((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(value.email, value.password)
    .then(
      res => resolve(res),
      err => reject(err))
  })*/


  doLogout(){
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signOut()
      .then(() => {
        this.firebaseService.unsubscribeOnLogOut();
        resolve();
      }).catch((error) => {
        console.log(error);
        reject();
      });
    })
  }
}