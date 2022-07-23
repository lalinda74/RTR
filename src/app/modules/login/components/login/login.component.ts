import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// services
import { AuthorizeService } from 'src/app/core/services/authorize.service';
import { CookieService } from 'src/app/core/services/cookie.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NumberGeneratorService } from 'src/app/core/services/number-generator.service';

// configs
import { CodeLength } from 'src/app/configs/code-length.config';

// models
import { TokenModel } from 'src/app/core/models/API/token.model';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthorizeService,
    private cookieService: CookieService,
    private codeGenService: NumberGeneratorService,
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.listenToRouteParameters();
  }

  /**
   * login handler
   * generate codeVerifier, codeChallenge, state value and set codeVerifier in cookie
   */
  loginHandler(): void {
    this.loaderService.show();
    const codeVerifier = this.codeGenService.getRandonNumber(CodeLength.codeVerifier);
    const codeChallenge = this.codeGenService.getRandonNumber(CodeLength.codeChallenge);
    const state = this.codeGenService.getRandonNumber(CodeLength.state);
    
    this.cookieService.setCookie(state, codeVerifier);
    this.authService.redirect(state, codeChallenge);
  }

  /**
   * get route parameters after redirection and initiate token exchange
   * token exchange initiation only happens if state, code and codeVerfier exists, else refreshing tokens
   */
  listenToRouteParameters(): void {
    const state = this.route.snapshot?.queryParamMap.get('state');
    const code = this.route.snapshot?.queryParamMap.get('code');
    if (state && code) {
      const codeVerifier = this.cookieService.getCookieValue(state);
      if (codeVerifier) {
        this.cookieService.removeCookie();
        this.initiateTokenExchange(code, codeVerifier, state);
        return;
      }
    }
    this.refreshTokens(state);
  }

  /**
   * Initiate token exchange
   * @param code Code from route parameters
   * @param codeVerifier Code verifier from cookie
   * @param state State value
   */
  initiateTokenExchange(
    code: string | null,
    codeVerifier: string | undefined,
    state: string | undefined
  ): void {
    this.authService.tokenExchange(code, codeVerifier).subscribe({
      next: (data: TokenModel) =>
        this.authService.routeToDashboard(
          data.access_token,
          data.refresh_token,
          data.expires_at,
          state
        ),
      error: (error) => this.refreshTokens(state),
    });
  }

  /**
   * Initiate token refresh request
   * @param state State value
   */
  refreshTokens(state: string | null | undefined): void {
    const refreshToken = this.localStorageService.getItem('refresh_token');
    if (refreshToken) {
      this.authService.tokenRefresh(refreshToken).subscribe({
        next: (data: TokenModel) =>
          this.authService.routeToDashboard(
            data.access_token,
            data.refresh_token,
            data.expires_at,
            state
          ),
      });
    } else {
      this.notificationService.openSnackBar('Please sign in to the application.');
    }
  }
}
