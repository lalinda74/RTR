import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthConfig } from '../../configs/auth.config';
import { TokenModel } from '../models/API/token.model';
import { TokenRefreshModel } from '../models/UI/token-refresh.model';
import { DataService } from './data.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeService {
  private refreshTokenTimeout: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private dataService: DataService
  ) {}

  /**
   * Redirect application
   * @param state State value
   * @param codeChallenge Code challenge value
   */
  redirect(state: string, codeChallenge: string): void {
    const params = [
      'response_type=' + AuthConfig.responseType,
      'redirect_uri=' + AuthConfig.redirectURI,
      'state=' + state,
      'code_challenge=' + codeChallenge,
    ];
    window.location.href =
      environment.baseURL + '/authorize?' + params.join('&');
  }

  /**
   * Get tokens
   * @param code Code value
   * @param verifier Verifier value
   * @returns Observable of tokens
   */
  tokenExchange(
    code: string | null,
    verifier: string | undefined = ''
  ): Observable<TokenModel> {
    const reqBody = {
      grant_type: AuthConfig.grant_type.initial,
      code: code,
      code_verifier: verifier,
    };
    return this.http
      .post<TokenModel>(environment.baseURL + '/oauth/token', reqBody);
  }

  /**
   * Refresh tokens
   * @param refreshToken Refresh token value
   * @returns Observable of tokens
   */
  tokenRefresh(refreshToken: string | null): Observable<TokenModel> {
    const reqBody: TokenRefreshModel = {
      grant_type: AuthConfig.grant_type.refresh,
      refresh_token: refreshToken,
    };
    return this.http.post<TokenModel>(
      environment.baseURL + '/oauth/token',
      reqBody
    );
  }

  /**
   * Route user to dashboard after successful login
   * @param accessToken Access token value
   * @param refreshToken Refresh token value
   * @param expiredTime Expired time value
   */
  routeToDashboard(
    accessToken: string,
    refreshToken: string,
    expiredTime: number,
    state: string | undefined | null
  ): void {
    this.localStorageService.setItem('access_token', accessToken);
    this.localStorageService.setItem('refresh_token', refreshToken);
    this.localStorageService.setItem(
      'expires_at',
      this.dataService.convertUnixTimestamp(expiredTime)
    );
    this.startRefreshTokenTimer();
    this.router.navigate(['dashboard'], { state: { stateValue: state } });
  }

  /**
   * Checking user logged in or not
   * @returns user is logged in true, otherwise false
   */
  isLoggedIn(): boolean {
    const refreshToken = this.localStorageService.getItem('refresh_token');
    if (refreshToken) {
      return true;
    }
    return false;
  }

  /**
   * Logout user from the application
   */
  logout(): void {
    this.stopRefreshTokenTimer();
    this.localStorageService.clearStorage();
  }

  /**
   * Start refresh token timer
   */
  private startRefreshTokenTimer() {
    const timePeriod = Number(this.localStorageService.getItem('expires_at'))*1000;
    this.refreshTokenTimeout = setInterval(
      () =>
        this.tokenRefresh(
          this.localStorageService.getItem('refresh_token')
        ).subscribe(),
        timePeriod
    );
  }

  /**
   * Stop refresh token timer
   */
  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
