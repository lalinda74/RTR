import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar:MatSnackBar) { }

  /**
   * Show snackbar
   * @param message Message string
   * @param action Action
   */
  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
       duration: 2000,
    });
  }
}
