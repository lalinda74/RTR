import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizeService } from '../../services/authorize.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthorizeService
  ) { }

  ngOnInit(): void {
  }

  /**
   * Logout handler
   */
  logoutHandler(): void {
    this.authService.logout();
    this.router.navigate(['login'])
  }

}
