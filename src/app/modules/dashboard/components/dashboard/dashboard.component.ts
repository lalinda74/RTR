import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardModel } from 'src/app/core/models/UI/card.model';
import { CookieService } from 'src/app/core/services/cookie.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  dataArray: CardModel[] = [];
  state!: any;

  constructor(
    private localStorageService: LocalStorageService,
    private cookieService: CookieService,
    private router: Router
  ) {
    const stateObject: any = this.router.getCurrentNavigation()?.extras.state;
    this.state = stateObject?.stateValue;
  }

  ngOnInit(): void {
    this.dataArray = [
      ...this.dataArray,
      {
        icon: 'login',
        key: 'Access token',
        value: this.localStorageService.getItem('access_token'),
      },
      {
        icon: 'refresh',
        key: 'Refresh token',
        value: this.localStorageService.getItem('refresh_token'),
      },
      {
        icon: 'cookie',
        key: 'Cookie',
        value: this.cookieService.getCookieValue(this.state),
      }
    ];
  }
}
