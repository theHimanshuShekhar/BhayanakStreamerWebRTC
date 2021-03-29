import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthGaurd implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    const ans = await this.checkUser();
    return ans
  }

  async checkUser() {
    const user = await this.auth.getAuthState().pipe(first()).toPromise();
    if (user) {
      this.router.navigate(['rooms'])
      return false
    }
    else return true
  }
}
