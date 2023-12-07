import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:5800/user';

  constructor(private http: HttpClient, private router: Router) { }

  //fetch all users
  fetchAllUsers():Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl)
  }

  //follow user
  followUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/followUser`, data);
  }

}
