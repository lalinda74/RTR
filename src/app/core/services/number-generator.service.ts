import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberGeneratorService {

  constructor() { }

  /**
   * Generate randon alphanumeric number
   * @param length Random number length
   */
  getRandonNumber(length: number): string {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
