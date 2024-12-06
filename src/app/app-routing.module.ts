import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CashierComponent } from './cashier/cashier.component'; // تأكد من استيراد المكون
import { CloseLockerComponent } from './close-locker/close-locker.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent , },
  { path: 'cashier', component: CashierComponent , canMatch: [AuthGuard] },
  { path: 'close', component: CloseLockerComponent , canMatch: [AuthGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full'  },
  { path: '**', redirectTo: '/login' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
