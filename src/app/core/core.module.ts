import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// external modules
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// interceptor
import { LoaderInterceptor } from './interceptor/loader.interceptor';

// components
import { LoaderComponent } from './components/loader/loader.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    LoaderComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
   },
  ],
  exports: [
    LoaderComponent,
    HeaderComponent
  ]
})
export class CoreModule { }
