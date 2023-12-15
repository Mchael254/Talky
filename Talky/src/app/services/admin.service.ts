import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }
  // private picUrl = 'http://localhost:5800/user/uploadProfilePic';
  private picUrl1 = 'http://localhost:5800/user/picUpload';

  uploadImage(formData:FormData): Observable<any>{
    return this.http.post(this.picUrl1,formData)

  }

  // uploadImage1(formData:FormData): Observable<any>{
  //   return this.http.post(this.picUrl,formData)

  // }







}
