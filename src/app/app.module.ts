import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// external modules
import { CoreModule } from './core/core.module';

// components
import { AppComponent } from './app.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardLayoutComponent,
    DefaultLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
