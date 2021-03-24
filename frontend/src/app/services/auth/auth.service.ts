import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth, private router : Router) { }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(() => this.router.navigate(['rooms']));
  }
  logout() {
    this.auth.signOut()
    .then(() => this.router.navigate(['login']));;
  }
}
