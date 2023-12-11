/// <reference types="node" />

import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { filter } from 'rxjs';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],


})
export class UserComponent {



  constructor(private userService: UserService, private router: Router) { }
  ngOnInit() {
    this.fetchAllUsers();
    this.fetchProfile();
  }

  //profile management
  edits: boolean = true;
  others: boolean = true;
  registerError: boolean = false;
  email: string = '';
  userName: string = '';
  password: string = '';
  confirm_password: string = '';
  profil: boolean = false;
  updateError: string = '';
  updateSuccess: string = '';

  cancell() {
    this.others = true;
    this.profil = false;
    this.edits = true;
  }
  edit() {
    this.others = false;
    this.profil = true;
    this.edits = false;
  }
  logout() {
    // this.moreModal = false;
    localStorage.clear();
    this.router.navigate(['/signin'])
  }


  //update profile details
  userDetail: any = {};
  updateID: string = '';
  profileName: string = '';

  fetchProfile() {
    this.userDetail = JSON.parse(localStorage.getItem('details') || '{}');
    console.log(this.userDetail);
    const email = this.userDetail.email;
    const userName = this.userDetail.userName;
    this.profileName = this.userDetail.userName;
    this.userName = userName;
    this.email = email;
    this.updateID = this.userDetail.userID;

  }

  //update profile
  formData: any = {};
  success: boolean = false;
  err: boolean = false;

  onSubmit() {
    if (this.userName === '' || this.email === '' || this.password === '' || this.confirm_password === '') {
      this.err = true;
      this.updateError = 'All fields are required';
      setTimeout(() => {
        this.updateError = '';
        this.err = false;

      }, 3000);
      return;
    }
    const isPasswordValid = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(this.password);
    if (this.password !== this.confirm_password || this.password.length < 8 || !isPasswordValid) {
      this.err = true;
      this.updateError = 'Weak password use at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character';
      setTimeout(() => {
        this.updateError = '';
        this.err = false;

      }, 3000);
      return;
    }

    const profileDataUpdate = {
      userName: this.userName,
      email: this.email,
      password: this.password,
    };
    console.log(profileDataUpdate);
    this.userService.updateProfile(profileDataUpdate).subscribe(
      (response) => {
        let userDetail = JSON.parse(localStorage.getItem('details') || '{}');
        if (profileDataUpdate.userName) {
          userDetail.userName = profileDataUpdate.userName;

        }
        localStorage.setItem('details', JSON.stringify(userDetail));
        console.log(userDetail);

        console.log('Profile updated successfully:', response);
        this.updateSuccess = 'profile changed successfully';
        this.success = true;
        this.fetchProfile();
        setTimeout(() => {
          this.updateSuccess = ''
          this.success = false;
          this.password = '';
          this.confirm_password = '';
        }, 2500);
      },
      (error) => {
        console.error('Error updating profile:', error);
        this.updateError = 'Failed to update profile. ';
        this.err = true;
        setTimeout(() => {
          this.updateError = '';
          this.err = false;
        }, 2500);
      }
    );
  }

  //upload profile pic
  imagePreview: string | ArrayBuffer | null = null;
  previewImage(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = (inputElement.files || [])[0];

    if (file) {
      this.modalProfileUpdate = true;
      const reader = new FileReader();

      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  closePreview(): void {
    this.imagePreview = null;
  }

  sendImage(): void {
    const userID = this.updateID;
    const profilePic = this.imagePreview;

    if (profilePic) {
      // Convert base64 to Blob
      const base64Image = profilePic as string;
      const byteCharacters = atob(base64Image.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      const formData = new FormData();
      formData.append('userID', userID.toString());
      formData.append('profilePic', blob);

      this.userService.uploadProfilePic(formData).subscribe(
        (response) => {
          console.log('Profile pic uploaded successfully:', response);
        },
        (error) => {
          console.error('Error uploading profile pic:', error);
        }
      );
    } else {
      console.error('Profile pic is null or invalid.');
    }
  }



  //post form
  modal: boolean = false;
  postss: boolean = false;
  sentSuccess: boolean = false;
  cancel() {
    this.modal = false;
    this.postss = false;
    this.postss1 = false;
  }

  textPost: string = '';
  POST() {
    this.postss = true;
    this.modal = true;
  }

  profile: boolean = false;
  image: string = "../../assets/vingego.jpeg";
  feeds: boolean = true;

  linem: boolean = false;
  linef: boolean = false;
  linep: boolean = true;
  linel: boolean = false;

  viewHome() {
    this.profile = false;
    this.feeds = true;
  }
  exit() {
    this.router.navigate(['/landing'])
  }

  // moreModal: boolean = false;
  more: boolean = false;
  moret = false;
  onClickedOutside(e: Event) {
    this.moret = false;
  }
  mores() {
    // this.moreModal = true;
    this.moret = true;
  }
  seeMores: boolean = false;
  seeMore() {
    
  }

  //profile
  profileView() {
    // this.moreModal = false;
    this.more = false;
    this.profile = true;
    this.feeds = false;
    this.feeds1 = false;
    this.specificUser = false;
    this.mine = true;
  }

  setLineStatus(m: boolean, f: boolean, p: boolean, l: boolean): void {
    this.linem = m;
    this.linef = f;
    this.linep = p;
    this.linel = l;
  }

  setContentStatus(p: boolean, m: boolean, fl: boolean, fw: boolean): void {
    this.post = p;
    this.medias = m;
    this.folowers = fl;
    this.folowing = fw;
  }

  general: boolean = false;
  //followers
  folowers: boolean = false;
  followers() {
    this.setLineStatus(false, true, false, false);
    this.setContentStatus(false, false, true, false);
    this.general = true;
  }

  //following
  folowing: boolean = false;
  following() {
    this.setLineStatus(false, false, false, true);
    this.setContentStatus(false, false, false, true);
    this.general = true;
  }

  //media
  medias: boolean = false;
  media() {
    this.setLineStatus(true, false, false, false);
    this.setContentStatus(true, true, false, false);
    this.post = false;
    this.general = false;

  }

  //post
  post: boolean = true;
  posts() {
    this.setLineStatus(false, false, true, false);
    this.setContentStatus(true, false, false, false);
  }

  otherUser: any;
  specificUser: boolean = false;
  mine: boolean = true;
  otherName: string = '';
  otherFollowers: number = 0;
  otherFollowing: number = 0;
  otherID: string = '';

  viewSpecificUser(user: any) {
    this.specificUser = true;
    this.mine = false;
    this.feeds = false;
    this.profile = true;
    this.otherName = user.userName;
    this.otherFollowers = user.followers;
    this.otherFollowing = user.following;
    this.otherID = user.userID
    this.otherUser = user;
  }

  //get all users
  searchTearm: string = '';
  filteredUsers: any[] = [];
  allUsers: any[] = [];
  line: boolean = false;
  pic: string | null = '';
  fetchAllUsers() {
    this.userService.fetchAllUsers().subscribe((data: any) => {
      this.allUsers = data;
      this.compareAndRetrieveDetails();
      this.filterUsers();
      console.log(this.allUsers);
      this.filteredUsers = [...this.allUsers]
    });
  }
  showFileInput = false;
  matchingUser: any;
  compareAndRetrieveDetails() {
    const localStorageEmail = this.userDetail.email;
    this.matchingUser = this.allUsers.find((user: any) => user.email === localStorageEmail);
    if (this.matchingUser) {
      const matchingUserName = this.matchingUser.userName;
      const matchingUserID = this.matchingUser.userID;;
    } else {
      console.log("No matching user found.");
    }
  }

  //update profile pic
  changeModal: boolean = false;
  modalProfileUpdate: boolean = false;
  openProfile() {
    this.changeModal = true;
  }
  closePic() {
    this.changeModal = false;
  }
  openFileInput() {
    this.changeModal = false;
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }
  closePic2() {
    this.modalProfileUpdate = false;
  }

  //filtering
  filterUsers() {
    setTimeout(() => {
      this.filteredUsers = this.allUsers.filter((user: any) => {
        return user.userName && user.userName.toLowerCase().includes(this.searchTearm.toLowerCase());
      })
    }, 4000);

  }

  //image
  bufferToBase64(buffer: Buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  getImageDataUrl(user: any): string | null {
    if (user && user.profilePic) {
      const contentType = 'image/jpeg';
      const base64Image = this.bufferToBase64(user.profilePic.data);
      // console.log('Base64Image:', base64Image.slice(0, 100));
      // console.log('ContentType:', contentType);
      if (base64Image) {
        return `data:${contentType};base64,${base64Image}`;
      }
    }
    return null;
  }

  //follow user
  folUser:boolean = true;
  unfolUser:boolean = false;
  ID: string = ''
  userDetails: any[] = []
  isFollow: boolean = false;
  isUnfollow: boolean = false;
  followUser(otherID: any) {
    this.unfolUser = true;
    this.folUser = false;
    this.isFollow = true;
    this.isUnfollow = true;
    // this.userDetails = JSON.parse(localStorage.getItem('details')||'[]')
    // console.log(this.userDetails);

    const followData = {
      userFollowedID: otherID,

    }
    console.log(followData);

    // this.userService.followUser(followData)

  }
  unfollowUser() {
    this.unfolUser = false;
    this.folUser = true;
    this.isFollow = false;
  }


  //feeds functions
  //like
  postq:string = 'I remember sometimes back when road bikes were hard to purchase, I mean they used to cost a fortune. All I can you guys today are enjoying it. Anyway, enjoy your rides';
  isFavorite = false;
  favoriteCount = 0;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    this.favoriteCount += this.isFavorite ? 1 : -1;
  }
  //comment
  textPost2: string = '';
  postss1: boolean = false;
  comment(){
    this.modal = true;
    this.postss1 = true;
  }

  //feeds
  yourFollowers:boolean = false;
  feeds1:boolean = false;
  image1:string = "../../assets/foot.jpeg";


  yourFollower(){

  }
  yourFollowin(){
    this.feeds1 = true;
    this.feeds = false;

  }






}
