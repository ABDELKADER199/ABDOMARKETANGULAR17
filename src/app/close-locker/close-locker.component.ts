import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LockerService } from '../locker.service';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-close-locker',
  templateUrl: './close-locker.component.html',
  styleUrl: './close-locker.component.css'
})
export class CloseLockerComponent implements OnInit {

lockerId:any;
lockerStatus: any;
successMessage: any;
errorMessage: any;
lockerData ={total: 0 , visa: 0 };

constructor(private route: ActivatedRoute ,private locker:LockerService , private redirect: Router){}
ngOnInit(){
  this.route.queryParams.subscribe(params =>{
    this.lockerId = params['lockerId'];
    this.lockerStatus = params['lockerstatus'];
    console.log('Locker ID:', this.lockerId);
    console.log('Locker Status:', this.lockerStatus);
  });
}
onClose(){
  this.locker.closeLocker(this.lockerId, this.lockerData).subscribe({
    next: (response)=>{
      this.successMessage = 'تم غلق الخزنه بنجاح';
      console.log(response);
      this.redirect.navigate(['/']);
    },
    error: (error)=>{
      this.errorMessage = 'غلق الخزينه لم يتم';
      console.log(error);
    }
  });
}

}
