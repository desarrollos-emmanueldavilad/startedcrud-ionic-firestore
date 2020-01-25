import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private snapshotChangesSubscription: any;

  constructor() { }

unsubscribeOnLogOut(){
  //remember to unsubscribe from the snapshotChanges
  this.snapshotChangesSubscription.unsubscribe();
}

}