import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subscription, throwError } from 'rxjs';
import { MockCodes } from 'src/app/core/mocks/codes.mock';
import { MockCookie } from 'src/app/core/mocks/cookie.mock';
import { MockToken } from 'src/app/core/mocks/token.mock';
import { AuthorizeService } from 'src/app/core/services/authorize.service';
import { CookieService } from 'src/app/core/services/cookie.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { NotificationService } from 'src/app/core/services/notification.service';

import { LoginComponent } from './login.component';

export class LocalStorageStub {
  getItem(key: string): string | null {
    return MockToken.access_token;
  }
}

export class AuthorizeServiceStub {
  tokenRefresh(key: string) {
    return of({});
  }
  setItem(): void {
  }
  tokenExchange(code: string, verifier: string) {
    return of({})
  }

  routeToDashboard(aToken: string, rToken: string, expire: string) {}
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let el: HTMLElement;
  let route: ActivatedRoute;

  let cookieServiceStub: jasmine.SpyObj<CookieService>;
  let paramsSubject: Subscription[];

  let authorizeServiceStub: jasmine.SpyObj<AuthorizeService>;
  let localStorageStub: jasmine.SpyObj<LocalStorageService>;
  let notificationServiceStub: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    cookieServiceStub = jasmine.createSpyObj('CookieService', ['getCookieValue', 'removeCookie']);
    authorizeServiceStub = jasmine.createSpyObj('AuthorizeService', ['tokenRefresh', 'setItem', 'tokenExchange', 'routeToDashboard']);
    localStorageStub = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem', 'clearStorage']);
    notificationServiceStub = jasmine.createSpyObj('NotificationService', ['openSnackBar']);

    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      providers:[
        {
          provide: ActivatedRoute,
          useValue: {
            params: paramsSubject,
            snapshot: {
              queryParamMap: {
                 get: () => {}
              }
            }
          },
        },
        { provide: LocalStorageService, useValue: localStorageStub },
        { provide: AuthorizeService, useValue: authorizeServiceStub },
        { provide: CookieService, useValue: cookieServiceStub },
        { provide: NotificationService, useValue: notificationServiceStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    route = TestBed.get(ActivatedRoute)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the loginHandler method', () => {
    spyOn(component, 'loginHandler');
    el = fixture.debugElement.query(By.css('button')).nativeElement;

    fixture.detectChanges();
    el.click();

    expect(component.loginHandler).toHaveBeenCalledTimes(1);
  });

  it('should retrieve cookie if current route has state and code params', () => {
    spyOn(route.snapshot.queryParamMap, 'get').and.callFake(param => {
      if (param === 'code') {
         return MockCodes.code;
      } else if (param === 'state') {
         return MockCodes.state;
      } else {
        return '';
      }
    });

    fixture.detectChanges(); 
    component.listenToRouteParameters();

    expect(cookieServiceStub.getCookieValue).toHaveBeenCalled();
  });

  it('should call refresh token if state and token is not in route params', () => {
    spyOn(route.snapshot.queryParamMap, 'get').and.callFake(param => {
      return null;
    });
    const refreshFuncSpy = spyOn(component, 'refreshTokens');

    fixture.detectChanges(); 
    component.listenToRouteParameters();

    expect(refreshFuncSpy).toHaveBeenCalled();
  });

  it('should remove cookie and start token exchange if all state, code and codeVerifier are present', () => {
    spyOn(route.snapshot.queryParamMap, 'get').and.callFake(param => {
      return MockCodes.code;
    });
    const initiateTokenSpy = spyOn(component, 'initiateTokenExchange');
    cookieServiceStub.getCookieValue.and.returnValue(MockCookie);

    fixture.detectChanges(); 
    component.listenToRouteParameters();

    expect(cookieServiceStub.removeCookie).toHaveBeenCalled();
    expect(initiateTokenSpy).toHaveBeenCalled();
  });

  it('should redirect flow through refresh token if all state and code are present, but codeVerifier is not available', () => {
    spyOn(route.snapshot.queryParamMap, 'get').and.callFake(param => {
      return MockCodes.code;
    });
    const refreshFuncSpy = spyOn(component, 'refreshTokens');
    cookieServiceStub.getCookieValue.and.returnValue(undefined);

    fixture.detectChanges(); 
    component.listenToRouteParameters();

    expect(refreshFuncSpy).toHaveBeenCalled();
  });

  it('should redirect flow through refresh token if either state and code is not present', () => {
    spyOn(route.snapshot.queryParamMap, 'get').and.callFake(param => {
      return null;
    });
    const refreshFuncSpy = spyOn(component, 'refreshTokens');
    cookieServiceStub.getCookieValue.and.returnValue(MockCookie);

    fixture.detectChanges(); 
    component.listenToRouteParameters();

    expect(refreshFuncSpy).toHaveBeenCalled();
  });

  it('should route to dashboard when valid token exchange happens', () => {
    authorizeServiceStub.tokenExchange.and.returnValue(of({
        access_token: MockToken.access_token,
        refresh_token: MockToken.refresh_token,
        expires_at: MockToken.expires_at
    }));

    fixture.detectChanges(); 
    component.initiateTokenExchange(MockCodes.code, MockCodes.codeVerifier, MockCodes.state);

    expect(authorizeServiceStub.routeToDashboard).toHaveBeenCalled();
  });

  it('should refresh tokens when an error occurred in token exchange', () => {
    authorizeServiceStub.tokenExchange.and.returnValue(throwError(() => {status:500}));
    const tokenRFuncSpy = spyOn(component, 'refreshTokens');
    const state = MockCodes.state;

    fixture.detectChanges(); 
    component.initiateTokenExchange(MockCodes.code, MockCodes.codeVerifier, state);

    expect(tokenRFuncSpy).toHaveBeenCalled();
  });

  it('should initiate token refresh request if localstorage has a refresh token', () => {
    const rToken = localStorageStub.getItem.and.returnValue(MockToken.refresh_token);
    const tokenRefreshFuncSpy = authorizeServiceStub.tokenRefresh.and.returnValue(of({
      access_token: MockToken.access_token,
      refresh_token: MockToken.refresh_token,
      expires_at: MockToken.expires_at
    }));
    const state = MockCodes.state;

    fixture.detectChanges(); 
    component.refreshTokens(state);

    expect(rToken).toBeTruthy();
    expect(tokenRefreshFuncSpy).toHaveBeenCalled();
  });

  it('should show notification if localstorage does not have a refresh token', () => {
    const rToken = localStorageStub.getItem.and.returnValue(null);
    const notificationSpy = notificationServiceStub.openSnackBar;
    const state = MockCodes.state;

    fixture.detectChanges(); 
    component.refreshTokens(state);

    expect(notificationSpy).toHaveBeenCalled();
  });

});
