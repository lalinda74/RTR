import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  requestCount = 0;
  responseCounts = 0;
  isLoading = new Subject<boolean>();

  constructor() {}

  /**
   * Show loader
   * a value will be sent to subject to show the spinner for the first requests only
   */
  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.isLoading.next(true);
    }
  }

  /**
   * Hide loader
   * value is sent to the subject to hide the spinner if there are no any pending requests
   */
  hide() {
    this.responseCounts++;
    if (this.requestCount === this.responseCounts) {
      this.requestCount = 0;
      this.responseCounts = 0;
      this.isLoading.next(false);
    }
  }
}
