import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { CashierComponent } from './Employees/cashier/cashier.component';
import { CloseLockerComponent } from './Employees/cashier/close-locker/CloseLockerComponent';
import { InquiryComponent } from './Employees/cashier/inquiry/inquiry.component';
import { HistoryReceiptsComponent } from './Employees/cashier/history-receipts/history-receipts.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    CashierComponent,
    LoginComponent,
    CloseLockerComponent,
    InquiryComponent,
    HistoryReceiptsComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
