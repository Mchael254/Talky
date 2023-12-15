import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:5800/user';
  private photoUrl = 'http://localhost:5800/user/uploadProfilePic';
  private postUrl = 'http://localhost:5800/post';

  constructor(private http: HttpClient, private router: Router) { }

  //fetch all users
  fetchAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
  }

  //follow user
  followUser(followData: any): Observable<any> {
    return this.http.post(`${this.postUrl}/addFollow`, followData);
  }

  //update profile
  updateProfile(profileDataUpdate: any): Observable<any> {
    const updateProfileUrl = `${this.apiUrl}/updateProfile`;

    return this.http.put(updateProfileUrl, profileDataUpdate);
  }
  uploadProfilePic(formData: FormData, options?: any): Observable<any> {
    return this.http.post(this.photoUrl, formData, options);
  }

  //get followers
  getFollowers(userID: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.postUrl}/getFollowers/${userID}`);
  }






}
