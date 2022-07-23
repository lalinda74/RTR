import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthorizeService } from '../services/authorize.service';

import { AuthGuardService } from './auth-guard.service';

describe('AuthGuardService', () => {
  let service: AuthGuardService;
  let authorizeServiceStub: jasmine.SpyObj<AuthorizeService>;

  beforeEach(() => {
    authorizeServiceStub = jasmine.createSpyObj('AuthorizeService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthorizeService, useValue: authorizeServiceStub },
      ]
    });
    service = TestBed.inject(AuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if user is logged in', () => {
    authorizeServiceStub.isLoggedIn.and.returnValue(true);

    const returnValue = service.canActivate();

    expect(returnValue).toBeTruthy();
  });

  it('should return false if user is not logged in', () => {
    authorizeServiceStub.isLoggedIn.and.returnValue(false);

    const returnValue = service.canActivate();

    expect(returnValue).toBeFalsy();
  });
});
