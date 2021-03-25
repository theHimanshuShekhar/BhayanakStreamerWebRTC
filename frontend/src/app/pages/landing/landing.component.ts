import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router) {
    // this.checkUser()
  }

  ngOnInit(): void {
  }

  login() {
    this.auth.login();
  }

}
