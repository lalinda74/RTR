import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  /**
   * Convert unix timestamp to seconds
   * @param unixTime Unix timestamp
   */
  convertUnixTimestamp(unixTime: number): string {
    const timestampTime = new Date(unixTime*1000).getTime();
    const currentTime = new Date().getTime();
    return String((timestampTime - currentTime)/1000);
  }
}
