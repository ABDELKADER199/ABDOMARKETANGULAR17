import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../login.service';
import { LockerService } from './../locker.service';
import * as faceapi from 'face-api.js';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginData = {
    email: '',
    password: '',
  };
  lockerId: any;
  lockerData: any;
  isFaceRecognitionSupported = true;
  isFaceRecognitionEnabled = false;
  registerData: any;

  constructor(
    private authService: AuthService,
    private lockerService: LockerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
  }

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
            this.router.navigate(['/close'], {
              queryParams: {
                lockerId: response.locker.id,
                lockerStatus: response.locker.status,
              },
            });

            // بعد إغلاق الخزنة المفتوحة، يتم فتح خزنة جديدة
            this.lockerService
              .closeLocker(response.locker.id, this.lockerData)
              .subscribe(
                // () => {
                //   this.openNewLocker(); // فتح درج جديد بعد غلق الدرج القديم
                // },
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


  async initializeFaceRecogition() {
    try {
      const modelPath = '/assets/models/';
      await faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath);
      await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
      await faceapi.nets.faceRecognitionNet.loadFromUri(modelPath);
      this.isFaceRecognitionEnabled = true;
    } catch (error) {
      console.error('Face recognition initialization failed :', error);
      this.isFaceRecognitionSupported = false;
    }
  }

  async onFaceLogin() {
    if (!this.isFaceRecognitionSupported) {
      alert('Face recognition is not available');
      return;
    }

    const video = document.getElementById('faceVideo') as HTMLVideoElement;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      await video.play();

      // انتظار تحميل النماذج إذا لم تكن محملة مسبقاً
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

      // التقاط الصورة وتحليلها
      const detection = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();

      if (detection) {
        const faceDescriptor = detection.descriptor;
        // إيقاف الكاميرا
        stream.getTracks().forEach(track => track.stop());

        // إرسال وصف الوجه إلى الخادم لتسجيل الدخول
        this.authService.loginWithFace({
          face_descriptor: JSON.stringify(faceDescriptor)
        }).subscribe(
          response => {
            console.log('Face login successful', response);
            // تخزين الرمز (token) إذا لزم الأمر
            this.router.navigate(['/cashier']);
          },
          error => {
            console.error('Face login failed:', error);
            alert('فشل تسجيل الدخول بواسطة الوجه');
          }
        );
      } else {
        alert('لم يتم التعرف على الوجه. حاول مرة أخرى.');
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (error) {
      console.error('Error accessing camera', error);
    }
  }

}
