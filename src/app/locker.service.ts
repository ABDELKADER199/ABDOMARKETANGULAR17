import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LockerService {

  private apiUrl = `http://127.0.0.1:8000/api/locker`

  constructor(private http: HttpClient) {}
  addLocker(lockerData: any): Observable<any>{
    return this.http.post(this.apiUrl, lockerData);
  };

  checkLockerStatus(): Observable<any>{
    return this.http.get(`${this.apiUrl}/check-status`);
  };

  openNewLocker(lockerData:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/open` , lockerData);
  };

  closeLocker(lockerId: number, lockerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${lockerId}/close`, lockerData);
  };
  addInvoice(invoiceData: any): Observable<any> {
    return this.http.post(`http://127.0.0.1:8000/api/locker/invoice`, invoiceData);
}

getLockersDataById( id:number): Observable<any>{
return this.http.get(`${this.apiUrl}/${id}`);
}
}
