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
  private likePostUrl = 'http://localhost:5800/likes';
  private commentUrl = 'http://localhost:5800/comment';

  constructor(private http: HttpClient, private router: Router) { }

  //fetch all users
  fetchAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
  }

  //follow user
  followUser(followData: any): Observable<any> {
    return this.http.post(`${this.followUrl}/addFollow`, followData);
  }

  //unfollow user
  unfollowUser(followData: any): Observable<any> {
    return this.http.post(`${this.followUrl}/unfollow`, followData);
  }

  //like post
  likePost(likeData: any): Observable<any> {
    return this.http.post(`${this.likePostUrl}/likePost`, likeData);
  }

  //unlike post
  unlikePost(likeData: any): Observable<any> {
    return this.http.post(`${this.likePostUrl}/unlikePost`, likeData);
  }

  //update profile
  updateProfile(profileDataUpdate: any): Observable<any> {
    const updateProfileUrl = `${this.apiUrl}/updateProfile`;

    return this.http.put(updateProfileUrl, profileDataUpdate);
  }

  // upload profile pic
  uploadProfilePic(formData: FormData, options?: any): Observable<any> {
    return this.http.post(this.photoUrl, formData, options);
  }

  // get user followers
  getFollowers(userID: string): Observable<any> {
    const url = `${this.followUrl}/getFollowers/${userID}`;
    return this.http.get(url);
  }
  //get user following
  getFollowing(userID: string): Observable<any> {
    const url = `${this.followUrl}/getFollowing/${userID}`;
    return this.http.get(url);
  }
  //get user posts
  getUserPosts(userID: string): Observable<any> {
    const url = `${this.postsUrl}/getUserPosts/${userID}`;
    return this.http.get(url);
  }
  //create post
  createPost(postData: FormData, options?: any): Observable<any> {
    return this.http.post(this.createPostUrl, postData, options);
  }
  //get all posts
  getAllPosts(): Observable<any> {
    return this.http.get(this.postsUrl);
  }

  //delete post
  deletePost(postID: string): Observable<any> {
    const url = `${this.postsUrl}/deletePost`;
    return this.http.post(url, { postID });
  }

  //comment on post
  commentOnPost(commentData: any): Observable<any> {
    const url = `${this.commentUrl}/commentOnPost`;
    return this.http.post(url, commentData);
  }

  //comment on comment
  commentOnComment(commentData: any): Observable<any> {
    const url = `${this.commentUrl}/commentOnComment`;
    return this.http.post(url, commentData);
  }

  //get comments on post
  getCommentsOnPost(postID: string): Observable<any> {
    const url = `http://localhost:5800/comment/getPostComments/${postID}`
    return this.http.get(url);
  }

  //get comments on comment
  getCommentsOnComment(commentID: string): Observable<any> {
    const url = `http://localhost:5800/comment/getCommentsOnComment/${commentID}`
    return this.http.get(url);
  }

  //like comment
  likeComment(likeData: any): Observable<any> {
    return this.http.post(`${this.likePostUrl}/likeComment`, likeData);
  }

  //unlike comment
  unlikeComment(likeData: any): Observable<any> {
    return this.http.post(`${this.likePostUrl}/unlikeComment`, likeData);
  }







}
