import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }

  /**
   * Set cookie
   * @param state State value
   * @param codeVerifier Code verifier value
   */
  setCookie(state: string, codeVerifier: string): void {
    document.cookie = `app.txs.${state}=${codeVerifier};secure;sameSite=strict;`;
  }

  /**
   * Get cookie value
   * @param state 
   * @returns 
   */
  getCookieValue(state: string | null): string | undefined {
    return document.cookie.split('; ').find(row => row.startsWith(`app.txs.${state}=`))?.split('=')[1];
  }

  /**
   * Remove cookie
   */
  removeCookie(): void {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++){   
      let spcook =  cookies[i].split("=");
      document.cookie = spcook[0] + "=;expires=Thu, 21 Sep 1979 00:00:01 UTC;";                                
    }
  }
}
