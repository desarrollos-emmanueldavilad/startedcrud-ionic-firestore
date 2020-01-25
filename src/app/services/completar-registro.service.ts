import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class CompletarRegistroService {

  private snapshotChangesSubscription: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
  }


  getInquilinoAdmin() {
    return new Promise<any>((resolve, reject) => {
      this.snapshotChangesSubscription = this.afs.
        collection('inquilino-registrado').snapshotChanges();
      resolve(this.snapshotChangesSubscription);
    });
  }

  getInquilino() {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if (currentUser) {
            this.snapshotChangesSubscription = this.afs.
            collection('inquilino-registrado', ref => ref.where('userId', '==', currentUser.uid)).snapshotChanges();
            resolve(this.snapshotChangesSubscription);
        }
      });
    });
  }


  getInquilinoId(inquilinoId) {
    return new Promise<any>((resolve, reject) => {
      this.snapshotChangesSubscription = this.afs.doc<any>('/inquilino-registrado/' + inquilinoId).valueChanges()
        .subscribe(snapshots => {
          resolve(snapshots);
        }, err => {
          reject(err);
        });
    });
  }

  unsubscribeOnLogOut() {
    //remember to unsubscribe from the snapshotChanges
    this.snapshotChangesSubscription.unsubscribe();
  }

  updateRegistroInquilino(registroInquilinoKey, value) {
    return new Promise<any>((resolve, reject) => {
      console.log('update-registroInquilinoKey', registroInquilinoKey);
      console.log('update-registroInquilinoKey', value);
      this.afs.collection('inquilino-registrado').doc(registroInquilinoKey).set(value) 
        .then(
          res => resolve(res),
          err => reject(err)
        );
    });
  }

  deleteRegistroInquilino(registroInquilinoKey) {
    return new Promise<any>((resolve, reject) => {
      console.log('delete-registroInquilinoKey', registroInquilinoKey);
      this.afs.collection('inquilino-registrado').doc(registroInquilinoKey).delete()
        .then(
          res => resolve(res),
          err => reject(err)
        );
    });
  }

  createInquilinoPerfil(value) {
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('inquilino-registrado').add({
        nombre: value.nombre,
        apellido: value.apellido,
        email: value.email,
        fechaNacimiento: value.fechaNacimiento,
        image: value.image,
        userId: currentUser.uid,
      })
        .then(
          res => resolve(res),
          err => reject(err)
        );
    });
  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext('2d');
    var img = new Image();
    img.onload = function () {
      var aux: any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL('image/jpeg');
      callback(dataURL);
    };
    img.src = imageUri;
  };

  uploadImage(imageURI, randomId) {
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child('image').child(randomId);
      this.encodeImageUri(imageURI, function (image64) {
        imageRef.putString(image64, 'data_url')
          .then(snapshot => {
            snapshot.ref.getDownloadURL()
              .then(res => resolve(res));
          }, err => {
            reject(err);
          });
      });
    });
  }
}
