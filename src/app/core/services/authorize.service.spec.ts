import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { MockCodes } from '../mocks/codes.mock';
import { MockToken } from '../mocks/token.mock';

import { AuthorizeService } from './authorize.service';
import { LocalStorageService } from './local-storage.service';

const url = environment.baseURL + '/oauth/token';

describe('AuthorizeService', () => {
  let service: AuthorizeService;
  let httpController: HttpTestingController;

  let localstorageServiceStub: jasmine.SpyObj<LocalStorageService>;
  
  beforeEach(() => {
    localstorageServiceStub = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem', 'clearStorage']);
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        AuthorizeService,
        { provide: LocalStorageService, useValue: localstorageServiceStub },
      ]
    });
    service = TestBed.inject(AuthorizeService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call token exchange API and return tokens', () => {
    const code = MockCodes.code;
    const verifier = MockCodes.codeVerifier;
    service.tokenExchange(code, verifier).subscribe(
      (response: any) => {
        expect(response).toEqual(MockToken);
      }
    );

    const req = httpController.expectOne({
      method: 'POST',
      url: `${environment.baseURL}/oauth/token`,
    });
    req.flush(MockToken);
  });

  it('should call token exchange API and return an error', () => {
    const code = MockCodes.code;
    const verifier = MockCodes.codeVerifier;
    const status = 500;
    const statusText = 'Server error';
    const errorEvent = new ErrorEvent('API error');

    let actualError: HttpErrorResponse | undefined;

    service.tokenExchange(code, verifier).subscribe(
      (response: any) => {
        fail('next handler must not be called');
      },
      (error) => {
        actualError = error;
      },
      () => {
        fail('complete handler must not be called');
      }
    )

    httpController.expectOne(url).error(
      errorEvent,
      { status, statusText }
    );
  
    if (!actualError) {
      throw new Error('Error needs to be defined');
    }
    expect(actualError.error).toBe(errorEvent);
    expect(actualError.status).toBe(status);
    expect(actualError.statusText).toBe(statusText);
  });

  it('should refresh tokens if grant type is refresh', () => {
    const refreshToken = MockToken.refresh_token;
    service.tokenRefresh(refreshToken).subscribe(
      (response: any) => {
        expect(response).toEqual(MockToken);
      }
    )

    const req = httpController.expectOne({
      method: 'POST',
      url: `${environment.baseURL}/oauth/token`,
    });
    req.flush(MockToken);
  });

  it('should return an error if grant type is refresh', () => {
    const refreshToken = MockToken.refresh_token;
    const status = 500;
    const statusText = 'Server error';
    const errorEvent = new ErrorEvent('API error');

    let actualError: HttpErrorResponse | undefined;

    service.tokenExchange(refreshToken).subscribe(
      (response: any) => {
        fail('next handler must not be called');
      },
      (error) => {
        actualError = error;
      },
      () => {
        fail('complete handler must not be called');
      }
    )

    httpController.expectOne(url).error(
      errorEvent,
      { status, statusText }
    );
  
    if (!actualError) {
      throw new Error('Error needs to be defined');
    }
    expect(actualError.error).toBe(errorEvent);
    expect(actualError.status).toBe(status);
    expect(actualError.statusText).toBe(statusText);
  });

  it('should user log in if refresh token is available', () => {
    localstorageServiceStub.getItem.and.returnValue(MockToken.refresh_token);

    const result = service.isLoggedIn();

    expect(result).toBeTruthy();
  });

  it('should user cannot log in if refresh token is not available', () => {
    localstorageServiceStub.getItem.and.returnValue(null);

    const result = service.isLoggedIn();

    expect(result).toBeFalsy();
  });
});
