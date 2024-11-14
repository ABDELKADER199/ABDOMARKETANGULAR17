import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CashierComponent } from './cashier/cashier.component'; // تأكد من استيراد المكون
import { CloseLockerComponent } from './close-locker/close-locker.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cashier', component: CashierComponent }, // تعريف المسار هنا
  { path: 'close', component: CloseLockerComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }, // مسار افتراضي للروابط غير المعروفة

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
