/// <reference types="node" />

import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { filter } from 'rxjs';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  constructor(private userService: UserService, private router: Router, private adminService: AdminService) { }
  ngOnInit() {
    this.fetchAllUsers();
    this.fetchProfile();
    this.getAllPosts();

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

//use multer
  // sendImage(): void {
  //   const userID = this.updateID;
  //   const profilePic = this.imagePreview;

  //   if (profilePic) {
  //     // Convert base64 to Blob
  //     const base64Image = profilePic as string;
  //     const byteCharacters = atob(base64Image.split(',')[1]);
  //     const byteNumbers = new Array(byteCharacters.length);
  //     for (let i = 0; i < byteCharacters.length; i++) {
  //       byteNumbers[i] = byteCharacters.charCodeAt(i);
  //     }
  //     const byteArray = new Uint8Array(byteNumbers);
  //     const blob = new Blob([byteArray], { type: 'image/png' });

  //     const formData = new FormData();
  //     formData.append('userID', userID.toString());
  //     formData.append('profilePic', blob);

  //     this.userService.uploadProfilePic(formData).subscribe(
  //       (response) => {
  //         console.log('Profile pic uploaded successfully:', response);
  //       },
  //       (error) => {
  //         console.error('Error uploading profile pic:', error);
  //       }
  //     );
  //   } else {
  //     console.error('Profile pic is null or invalid.');
  //   }
  // }

  //post form
  modal: boolean = false;
  postss: boolean = false;
  sentSuccess: boolean = false;
  cancel() {
    this.modal = false;
    this.postss = false;
    this.postss1 = false;
  }

  content: string = '';
  POST() {
    this.postss = true;
    this.modal = true;
  }
  //create post
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

  FileInput() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }

  selectedImg: File | null = null;
  onSelected(event: any): void {
    this.previewImage(event);
    const fileList: FileList | null = event.target.files;
    if (fileList && fileList.length > 0) {
      this.selectedImage = fileList[0];
    }
  }
  sharePost() {
    const userID = this.matchingUser.userID;
    const userName = this.matchingUser.userName;
    const content = this.content;

    const postData = new FormData();
    postData.append('content', this.content);
    postData.append('userID', userID);
    postData.append('userName', userName);

    if (this.selectedImage) {
      postData.append('postPic', this.selectedImage);
    } else {
      console.log('Please select an image to upload');
      this.userService.createPost(postData).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
      return;
    }
    console.log(postData);
    this.userService.createPost(postData).subscribe(
      (response) => {
        this.compareAndRetrieveDetails();
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }


  profile: boolean = false;
  image: string = "../../assets/vingego.jpeg";
  feeds: boolean = true;

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
    this.personalContent = true;
    this.otherContent = false;
  }

  //top lines
  linep: boolean = true;
  linem: boolean = false;
  linefl: boolean = false;
  linel: boolean = false;

  gFollowing: boolean = false;


  generalFollower: boolean = false;
  magic: boolean = false;
  //followers
  folowers: boolean = false;
  lineFollowing: boolean = false;

  //get user following
  folowing: boolean = false;
  followings: any[] = [];
  getFollowing() {
    this.lineFollowing = true; this.linem = false; this.linep = false; this.linefl = false;
    this.magic = true; this.generalFollower = false; this.medias = false; this.userPosts = false;
    const userID = this.matchingUser.userID;
    console.log(userID);
    this.userService.getFollowing(userID).subscribe(
      (response) => {
        console.log('Following:', response);
        this.followings = response;
      },
      (error) => {
        console.error('Error getting following:', error);
      }
    );
  }
  //get user followers
  followerss: any[] = [];
  getFollowers() {
    this.lineFollowing = false; this.linem = false; this.linep = false; this.linefl = true;
    this.generalFollower = true; this.magic = false; this.medias = false; this.userPosts = false;
    const userID = this.matchingUser.userID;
    console.log(userID);
    this.userService.getFollowers(userID).subscribe(
      (response) => {
        console.log('Followers:', response);
        this.followerss = response;
      },
      (error) => {
        console.error('Error getting followers:', error);
      }
    );
  }
  //get user posts
  userPostss: any[] = [];
  userPosts: boolean = true;
  time: string = '';
  getUserPosts() {
    this.linep = true; this.linem = false; this.linefl = false; this.lineFollowing = false;
    this.userPosts = true; this.medias = false; this.generalFollower = false; this.magic = false;
    const userID = this.matchingUser.userID;
    console.log(userID);
    this.userService.getUserPosts(userID).subscribe(
      (response) => {
        console.log('Posts:', response);
        this.userPostss = response;
        this.userPostss.forEach((post) => {
          const postTimestamp = new Date(post.Timestamp);
          const eastTimestamp = this.convertToEastAfricanTime(postTimestamp);
          const currentTime = new Date();
          const timeDifference = this.getTimeDifference(eastTimestamp, currentTime);
          post.timeDifference = timeDifference;
          this.time = timeDifference;
          console.log(this.time);

        });
      },
      (error) => {
        console.error('Error getting posts:', error);
      }
    );
  }
  convertToEastAfricanTime(timestamp: Date): Date {
    const eatOffset = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    return new Date(timestamp.getTime() - eatOffset);
  }

  getTimeDifference(start: Date, end: Date): string {
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const days = Math.floor(timeDiff / (1000 * 3600 * 24));
    const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    let result = '';
    if (days > 0) result += days + 'd ';
    if (hours > 0) result += hours + 'h ';
    if (minutes > 0 && hours === 0) result += minutes + 'm ';
    if (seconds > 0 && hours === 0 && minutes === 0) result += seconds + 's';

    return result.trim();
  }

  //get all posts
  allPostss: any[] = [];
  getAllPosts() {
    this.userService.getAllPosts().subscribe(
      (response) => {
        console.log('Posts:', response);
        this.allPostss = response;
      },
      (error) => {
        console.error('Error getting posts:', error);
      }
    );
  }

  //media
  medias: boolean = false;
  media() {
    this.linem = true; this.linep = false; this.linel = false; this.linefl = false;
    this.medias = true; this.userPosts = false; this.folowing = false;
    this.userPosts = false; this.generalFollower = false; this.magic = false;


  }

  //post

  posts() {
    this.linep = true; this.linem = false; this.lineFollowing = false; this.linefl = false;
    this.userPosts = true; this.medias = false; this.generalFollower = false; this.magic = false;

  }

  otherUser: any;
  specificUser: boolean = false;
  mine: boolean = true;
  otherName: string = '';
  otherFollowers: number = 0;
  otherFollowing: number = 0;
  otherID: string = '';
  otherFollowCount: number = 0;
  otherFollowingCount: number = 0;

  viewSpecificUser(user: any) {
    this.specificUser = true;
    this.mine = false;
    this.feeds = false;
    this.profile = true;
    this.otherName = user.userName;
    this.otherFollowCount = user.followCount;
    this.otherFollowingCount = user.followingCount;
    this.otherID = user.userID
    this.otherUser = user;
    this.personalContent = false;
    this.otherContent = true;
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
  matchingUserDp: any;
  matchingUserFollowCount: number = 0;
  matchingUserFollowingCount: number = 0;
  compareAndRetrieveDetails() {
    const localStorageEmail = this.userDetail.email;
    this.matchingUser = this.allUsers.find((user: any) => user.email === localStorageEmail);
    if (this.matchingUser) {
      const matchingUserName = this.matchingUser.userName;
      const matchingUserID = this.matchingUser.userID;
      this.matchingUserDp = this.matchingUser.imagePath
      this.matchingUserFollowCount = this.matchingUser.followCount;
      this.matchingUserFollowingCount = this.matchingUser.followingCount;
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

  selectedImage: File | null = null;
  onImageSelected(event: any): void {
    this.previewImage(event);
    const fileList: FileList | null = event.target.files;
    if (fileList && fileList.length > 0) {
      this.selectedImage = fileList[0];
    }
  }

  userEmails: any;
  updateDp() {
    this.userEmails = localStorage.getItem('user_email');
    const email = this.userEmails
    console.log(this.email);

    if (!this.selectedImage) {
      console.log('Please select an image to upload');
      return;
    }
    console.log(this.selectedImage);
    const formData = new FormData();
    formData.append('profilePic', this.selectedImage);
    formData.append('email', this.email);
    console.log(formData);
    this.adminService.uploadImage(formData).subscribe(
      (response) => {
        this.modalProfileUpdate = false;
        this.compareAndRetrieveDetails();
        console.log(response);
        this.changeModal = false;
        // this.meso = response.message;
      },
      (error) => {
        console.log(error);
        // this.meso = error.error.message;
      }
    )

  }

  closePic2() {
    this.modalProfileUpdate = false;
  }

  //filtering
  // filterUsers() {
  //   setTimeout(() => {
  //     this.filteredUsers = this.allUsers.filter((user: any) => {
  //       return user.userName && user.userName.toLowerCase().includes(this.searchTearm.toLowerCase());
  //     })
  //   }, 4000);

  // }

  // Filtering
  filterUsers() {
    setTimeout(() => {
      const userEmailToExclude = localStorage.getItem('user_email');

      if (userEmailToExclude) {
        this.filteredUsers = this.allUsers.filter((user: any) => {
          return user.userName &&
            user.userName.toLowerCase().includes(this.searchTearm.toLowerCase()) &&
            user.email !== userEmailToExclude;
        });
      } else {
        this.filteredUsers = this.allUsers.filter((user: any) => {
          return user.userName && user.userName.toLowerCase().includes(this.searchTearm.toLowerCase());
        });
      }
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
  folUser: boolean = true;
  unfolUser: boolean = false;
  ID: string = ''
  userDetails: any[] = []
  isFollow: boolean = false;
  isUnfollow: boolean = false;
  followerID: string = '';
  followUser(otherID: any) {
    this.unfolUser = true;
    this.folUser = false;
    this.isFollow = true;
    this.isUnfollow = true;
    this.followerID = this.matchingUser.userID;

    const followData = {
      followeeID: otherID,
      followerID: this.followerID
    }
    console.log(followData);
    // this.userService.followUser(followData)
    this.userService.followUser(followData).subscribe(
      (response) => {
        console.log('Followed successfully:', response);
        this.fetchAllUsers();
        this.fetchProfile();
      },
      (error) => {
        console.error('Error following user:', error);
      }
    );
  }


  unfollowUser() {
    this.unfolUser = false;
    this.folUser = true;
    this.isFollow = false;
  }

  personalContent: boolean = true;
  otherContent: boolean = false;



  //feeds functions
  //like
  postq: string = 'I remember sometimes back when road bikes were hard to purchase, I mean they used to cost a fortune. All I can you guys today are enjoying it. Anyway, enjoy your rides';
  isFavorite = false;
  favoriteCount = 0;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    this.favoriteCount += this.isFavorite ? 1 : -1;
  }
  //comment
  textPost2: string = '';
  postss1: boolean = false;
  comment() {
    this.modal = true;
    this.postss1 = true;
  }

  //feeds
  yourFollowers: boolean = false;
  feeds1: boolean = false;
  image1: string = "../../assets/foot.jpeg";


  yourFollower() {
    this.feeds1 = false;
    this.feeds = true;

  }
  yourFollowin() {
    this.feeds1 = true;
    this.feeds = false;

  }






}
