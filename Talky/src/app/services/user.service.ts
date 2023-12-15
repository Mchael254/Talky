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
  private postsUrl = 'http://localhost:5800/post';
  private followUrl = 'http://localhost:5800/follow';
  private createPostUrl = 'http://localhost:5800/post/createPost';

  constructor(private http: HttpClient, private router: Router) { }

  //fetch all users
  fetchAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
  }

  //follow user
  followUser(followData: any): Observable<any> {
    return this.http.post(`${this.postsUrl}/addFollow`, followData);
  }

  //update profile
  updateProfile(profileDataUpdate: any): Observable<any> {
    const updateProfileUrl = `${this.apiUrl}/updateProfile`;

    return this.http.put(updateProfileUrl, profileDataUpdate);
  }
  uploadProfilePic(formData: FormData, options?: any): Observable<any> {
    return this.http.post(this.photoUrl, formData, options);
  }

  getFollowers(userID: string): Observable<any> {
    const url = `${this.followUrl}/getFollowers/${userID}`;
    return this.http.get(url);
  }

  getFollowing(userID: string): Observable<any> {
    const url = `${this.followUrl}/getFollowing/${userID}`;
    return this.http.get(url);
  }

  getUserPosts(userID: string): Observable<any> {
    const url = `${this.postsUrl }/getUserPosts/${userID}`;
    return this.http.get(url);
  }

  getAllPosts(): Observable<any> {
    return this.http.get(this.postsUrl);
  }

  createPost(postData: FormData, options?: any): Observable<any> {
    return this.http.post(this.createPostUrl, postData, options);
  }







}
