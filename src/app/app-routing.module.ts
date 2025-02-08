import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CashierComponent } from './Employees/cashier/cashier.component'; // تأكد من استيراد المكون
import { CloseLockerComponent } from './Employees/cashier/close-locker/CloseLockerComponent';
import { AuthGuard } from './guard/auth.guard';
import { InquiryComponent } from './Employees/cashier/inquiry/inquiry.component';
import { HistoryReceiptsComponent } from './Employees/cashier/history-receipts/history-receipts.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent , },
  { path: 'cashier', component: CashierComponent , canMatch: [AuthGuard] },
  { path: 'close', component: CloseLockerComponent , canMatch: [AuthGuard]},
  {path: 'inquiry' , component: InquiryComponent , canMatch: [AuthGuard]},
  {path: 'historyReseipt' , component: HistoryReceiptsComponent , canMatch: [AuthGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full'  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
