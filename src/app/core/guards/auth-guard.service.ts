import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizeService } from '../services/authorize.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthorizeService
  ) { }

  canActivate(): boolean | Observable<boolean> {
    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      // user is logged in, hence return true
      return true;
    }
    // user is not logged in, so need to redirect user back to login
    this.router.navigate(['login']);
    return false;
  }
}
