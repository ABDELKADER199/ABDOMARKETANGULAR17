import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../login.service';
import { LockerService } from './../locker.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData = {
    email: '',
    password: ''
  };
lockerId: any;
lockerData:any;

  constructor(
    private authService: AuthService,
    private lockerService: LockerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.authService.login(this.loginData).subscribe(
      (response) => {
        console.log('Login Successful', response);
        this.checkLockerStatus();
      },
      (error) => {
        console.log('Login failed', error);
      }
    );
  }

  // في الكود المسؤول عن التحقق من حالة الخزنة
checkLockerStatus() {
  this.lockerService.checkLockerStatus().subscribe(
    (response) => {
      if (response.status === 'open') {
        const confirmClose = confirm('هناك خزنة مفتوحة. هل تريد غلقها؟');
        if (confirmClose) {
          // إذا وافق المستخدم على إغلاق الخزنة المفتوحة
          this.router.navigate(['/close'], { queryParams: { lockerId: response.locker.id, lockerStatus: response.locker.status } });

          // بعد إغلاق الخزنة المفتوحة، يتم فتح خزنة جديدة
          this.lockerService.closeLocker(response.locker.id, this.lockerData).subscribe(
            () => {
              this.openNewLocker(); // فتح درج جديد بعد غلق الدرج القديم
            },
            (error) => {
              console.log('Error closing locker:', error);
            }
          );
        } else {
          // في حالة رفض إغلاق الخزنة
          this.router.navigate(['/cashier']);
        }
      } else {
        // إذا كانت الخزنة مغلقة أو غير موجودة، يتم فتح خزنة جديدة
        this.openNewLocker();
        this.router.navigate(['/cashier']);
      }
    },
    (error) => {
      console.log('Error checking locker status:', error);
      this.router.navigate(['/cashier']);
    }
  );
}

// فتح خزنة جديدة
openNewLocker(): void {
  const newLockerData = {
    employees_id: 1, // قم بتعيين ID الموظف بشكل ديناميكي إذا لزم الأمر
    status: 'open',
  };
  this.lockerService.openNewLocker(newLockerData).subscribe(
    (response) => {
      console.log('Locker opened successfully:', response);
    },
    (error) => {
      console.log('Error opening locker:', error);
    }
  );
}

}
