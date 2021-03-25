import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private router : Router) { }

  getUser() {
    return this.auth.currentUser;
  }

  getUserWithUID(uid: string) {
    return this.afs.collection('users').doc(uid).valueChanges()
  }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(() => this.updateUser())
    .then(() => this.router.navigate(['rooms']));
  }
  logout() {
    this.auth.signOut()
    .then(() => this.router.navigate(['login']));;
  }

  updateUser() {
    this.getUser().then(user => {
      if(user) this.afs.collection("users").doc(user.uid).set({
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
        email: user.email
      })
    })
  }
}
