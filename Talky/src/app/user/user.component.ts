/// <reference types="node" />

import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { filter } from 'rxjs';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { AdminService } from '../services/admin.service';
import { is } from 'cypress/types/bluebird';

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
    this.updateDp();

  }

  reloadPage() {
    window.location.reload()
  }

  //profile management
  edits: boolean = true;
  others: boolean = true;
  registerError: boolean = false;
  email: string = '';
  userName: string = '';
  password: string = '';
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
    if (this.userName === '' || this.email === '' || this.password === '') {
      this.err = true;
      this.updateError = 'All fields are required';
      setTimeout(() => {
        this.updateError = '';
        this.err = false;

      }, 3000);
      return;
    }
    const isPasswordValid = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(this.password);
    if (this.password.length < 8 || !isPasswordValid) {
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
          this.modal = false;
          this.postss = false;
          this.getAllPosts();
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
        this.getAllPosts();
        this.modal = false;
        this.postss = false;
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
    this.feeds1 = false;
    this.commentFeeds = false;
    this.commentOnCommentFeeds = false;
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
    this.getUserPosts();
    this.more = false;
    this.profile = true;
    this.feeds = false;
    this.feeds1 = false;
    this.commentFeeds = false;
    this.commentOnCommentFeeds = false;
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
  //get user post
  confirmDelete() {
    this.deleteID
    console.log(this.deleteID);
    this.userService.deletePost(this.deleteID).subscribe(
      (response) => {
        console.log(response);
        this.changeModalUserPosts = false
        this.getUserPosts();
      },
      (error) => {
        console.error('Error deleting post:', error);
      }
    );


  }
  changeModalUserPosts: boolean = false;
  deleteID: string = '';
  deletePost(postID: any) {
    console.log(postID);
    this.deleteID = postID;
    this.changeModalUserPosts = true

  }
  CancelDelete() {
    this.changeModalUserPosts = false

  }
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
  meso: string = '';
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
    formData.append('imagePath', this.selectedImage);
    formData.append('email', this.email);
    console.log(formData);
    this.userService.uploadProfilePic(formData).subscribe(
      (response) => {
        this.profileView();
        this.modalProfileUpdate = false;
        console.log(response);
        this.changeModal = false;
        this.meso = response.message;

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

  //follow and unFollow user
  viewSpecificUser(user: any) {
    this.specificUser = true;
    this.mine = false;
    this.feeds = false;
    this.feeds1 = false;
    this.commentFeeds = false;
    this.commentOnCommentFeeds = false;
    this.profile = true;
    this.otherName = user.userName;
    this.otherFollowCount = user.followCount;
    this.otherFollowingCount = user.followingCount;
    this.otherID = user.userID
    this.otherUser = user;
    this.personalContent = false;
    this.otherContent = true;

    const storedUserIDsString = localStorage.getItem('followedUserIDs');
    if (storedUserIDsString) {
      const storedUserIDs: string[] = JSON.parse(storedUserIDsString);

      if (storedUserIDs.includes(this.otherID)) {
        console.log('Yes, this.otherID exists in localStorage.');
        this.unfolUser = true; this.folUser = false; this.isUnfollow = true; this.isFollow = true;
      } else {
        console.log('No, this.otherID does not exist in localStorage.');
        this.folUser = true; this.unfolUser = false; this.isFollow = true; this.isUnfollow = false;
      }
    } else {
      console.log('No user IDs are stored in localStorage.');
      this.folUser = true; this.unfolUser = false; this.isFollow = true; this.isUnfollow = false;
    }

  }
  folUser: boolean = false;
  unfolUser: boolean = false;
  ID: string = ''
  userDetails: any[] = []
  isFollow: boolean = false;
  isUnfollow: boolean = false;
  followerID: string = '';
  followedUserIDs: string[] = [];


  followUser(otherID: any) {
    this.isUnfollow = true; this.isFollow = false;
    this.followerID = this.matchingUser.userID;
    if (!this.followedUserIDs.includes(otherID)) {
      this.followedUserIDs.push(otherID);
      localStorage.setItem('followedUserIDs', JSON.stringify(this.followedUserIDs));
      this.folUser = false;
      this.unfolUser = true;
    }
    const followData = {
      followeeID: otherID,
      followerID: this.followerID
    };
    console.log(followData);
    this.userService.followUser(followData).subscribe(
      (response) => {
        this.fetchAllUsers();
        this.fetchProfile();
        this.unfolUser = true;
        this.folUser = false;
        this.isFollow = true;
        this.isUnfollow = true;
        console.log('Followed successfully:', response);

      },
      (error) => {
        console.error('Error following user:', error);
      }
    );

  }

  unfollowUser(otherID: any) {
    this.isUnfollow = false; this.isFollow = true;
    this.followerID = this.matchingUser.userID;

    const storedUserIDsString = localStorage.getItem('followedUserIDs');
    if (storedUserIDsString) {
      const storedUserIDs: string[] = JSON.parse(storedUserIDsString);
      const index = storedUserIDs.indexOf(otherID);

      if (index !== -1) {
        storedUserIDs.splice(index, 1);

        localStorage.setItem('followedUserIDs', JSON.stringify(storedUserIDs));
      }
    }
    this.folUser = true;
    this.unfolUser = false;
    const followData = {
      followeeID: otherID,
      followerID: this.followerID
    };
    console.log(followData);
    this.userService.unfollowUser(followData).subscribe(
      (response) => {
        this.unfolUser = false;
        this.folUser = true;
        this.isFollow = true;
        this.isUnfollow = false;
        console.log('Unfollowed successfully:', response);
        this.fetchAllUsers();
        this.fetchProfile();
      },
      (error) => {
        console.error('Error unfollowing user:', error);
      }
    );

  }


  personalContent: boolean = true;
  otherContent: boolean = false;

  //feeds functions
  //like
  postq: string = 'I remember sometimes back when road bikes were hard to purchase, I mean they used to cost a fortune. All I can you guys today are enjoying it. Anyway, enjoy your rides';
  isFavorite: boolean = false;
  postLikeStates: { [key: string]: boolean } = {};
  likePost(postID: any, userName: any, userID: any) {
    this.postLikeStates[postID] = !this.postLikeStates[postID];
    const likeData: any = {
      postID: postID,
      userName: userName,
      userID: userID
    }
    if (this.postLikeStates[postID]) {
      console.log(likeData);
      this.userService.likePost(likeData).subscribe(
        (response) => {
          console.log('Liked successfully:', response);
          this.getAllPosts();
        },
        (error) => {
          console.error('Error liking post:', error);
        }
      );

    } else {
      console.log(likeData);
      this.userService.unlikePost(likeData).subscribe(
        (response) => {
          console.log('Unliked successfully:', response);
          this.getAllPosts();
        },
        (error) => {
          console.error('Error unliking post:', error);
        }
      );
    }

  }


  //comment
  textPost2: string = '';
  postss1: boolean = false;
  commentData: any = {};
  postContent: string = '';
  postPic: string = '';
  postUserName: string = '';
  singlePostID: string = '';
  postUserID: string = '';


  commentPost(post: any) {
    this.postContent = post.content;
    this.postPic = post.postPic;
    this.modal = true;
    this.postss1 = true;
    this.singlePostID = post.postID;
    this.postUserName = post.userName;
    this.postUserID = post.userID;
    console.log(this.singlePostID);


  }

  commentOnPost(userName: any, userID: any) {
    this.modal = false;
    this.postss1 = false;
    this.commentData = {
      postID: this.singlePostID,
      userName: this.matchingUser.userName,
      userID: this.matchingUser.userID,
      content: this.textPost2
    }

    console.log(this.commentData);

    this.userService.commentOnPost(this.commentData).subscribe(
      (response) => {
        console.log('Commented successfully:', response);
        this.textPost2 = '';
        this.getAllPosts();
      },
      (error) => {
        console.error('Error commenting post:', error);
      }
    );


  }

  //update comment
  updateCommentPop: boolean = false;
  updateCommentData: any = {};
  updateCommentID: string = '';
  updateCommentContent: string = '';
  updateCommentUserID: string = '';
  popUpdateComment(comment: any) {
    this.updateCommentPop = true;
    this.updateCommentID = comment.commentID;
    this.updateCommentContent = comment.content;
    this.updateCommentUserID = comment.userID;
    this.updateCommentData = {
      commentID: this.updateCommentID,
      updateContent: this.updateCommentContent,
      userID: this.updateCommentUserID
    }
    console.log(this.updateCommentData);
    // this.userService.updateComment(this.updateCommentData).subscribe(
    //   (response) => {
    //     console.log('Comment updated successfully:', response);
    //     this.getPostComments();
    //   },
    //   (error) => {
    //     console.error('Error updating comment:', error);
    //   }
    // );
  }
  updateComment() {

  }


  //view comment
  commentFeeds: boolean = false;
  viewPost(post: any) {
    this.postContent = post.content;
    this.postPic = post.postPic;
    this.postUserName = post.userName;
    this.singlePostID = post.postID;
    this.feeds = false;
    this.feeds1 = false;
    this.commentOnCommentFeeds = false;
    this.commentFeeds = true;
    this.getPostComments();

  }


  //get post comments
  postComments: any[] = [];
  getPostComments() {
    const postID = this.singlePostID;
    console.log(postID);
    this.userService.getCommentsOnPost(postID).subscribe(
      (response) => {
        console.log('Comments:', response);
        this.postComments = response;
      },
      (error) => {
        console.error('Error getting comments:', error);
      }
    );
  }


  //fetch comments of a post
  comments: any[] = [];
  commentPostID: string = '';
  getCommentsOnPost(postID: any) {
    this.commentPostID = postID;
    console.log(postID);

    // this.userService.getCommentsOnPost(postID).subscribe(
    //   (response) => {
    //     console.log('Comments:', response);
    //     this.comments = response;
    //   },
    //   (error) => {
    //     console.error('Error getting comments:', error);
    //   }
    // );
  }

  //comment on comment
  cancel2() {
    this.modal = false
    this.commentOnComment = false

  }
  commentC: boolean = false;
  commentOnComment: boolean = false;
  CoCuserName: string = ''
  CoCuserID: string = ''
  isClickedId: string = ''
  commentOnCommentData: any = {}
  textPost3: string = ''
  commentComment(commentID: any, postID: any) {
    this.modal = true
    this.isClickedId = commentID
    this.commentOnComment = true
    this.CoCuserName = this.matchingUser.userName;
    this.CoCuserID = this.matchingUser.userID
    this.commentOnCommentData = {
      userName: this.CoCuserName,
      userID: this.CoCuserID,
      commentID: commentID,
      postID: postID,

    }
    console.log(this.commentOnCommentData);
  }

  postCommentOnComment(textPost3: any) {
    this.commentOnCommentData
    console.log(textPost3);
    const commentOnCommentData = {
      userName: this.CoCuserName,
      userID: this.CoCuserID,
      parentCommentID: this.isClickedId,
      postID: this.singlePostID,
      content: textPost3
    }
    console.log(commentOnCommentData);
    this.userService.commentOnComment(commentOnCommentData).subscribe(
      (response) => {
        console.log('Commented successfully:', response);
        this.textPost3 = '';
        this.getPostComments();
        this.modal = false;
        this.commentOnComment = false;
      },
      (error) => {
        console.error('Error commenting post:', error);
      }
    );

  }

  //edit comment

  iisClickedId: string | null = null;
  updateContent: string = '';
  updateCommentData2: any = {};

  popEditComment(commentID: string,userID:string) {
    this.iisClickedId = commentID;
    this.updateCommentData2 = {
      commentID: commentID,
      updateContent: this.updateContent,
      userID: userID

    }
    console.log(this.updateCommentData2);


  }
  closeUpdate(){
    this.iisClickedId = null;
  }

  editCooment(){

    this.updateCommentData2
    console.log(this.updateCommentData2);
    this.userService.updateComment(this.updateCommentData2).subscribe(
      (response) => {
        console.log('Comment updated successfully:', response);
        this.getPostComments();
        // this.iisClickedId = null;
      },
      (error) => {
        console.error('Error updating comment:', error);
      }
    );

  }


  //comment on comment
  commentOnCommentFeeds: boolean = false;
  commentContent: string = '';
  singleCommentID: string = '';
  commentUserName: string = '';

  viewCommentsOnComment(comment: any) {
    this.feeds = false;
    this.feeds1 = false;
    this.commentFeeds = false;
    this.commentOnCommentFeeds = true;
    this.commentContent = comment.content;
    this.commentUserName = comment.userName;
    this.singleCommentID = comment.commentID;
    this.getCommentsOnComment();

  }
  commentComments: any[] = []
  getCommentsOnComment() {
    const commentID = this.singleCommentID;
    console.log(commentID);
    this.userService.getCommentsOnComment(commentID).subscribe(
      (response) => {
        console.log('Comments:', response);
        this.commentComments = response;
      },
      (error) => {
        console.error('Error getting comments:', error);
      }
    );

  }


  likeCommentComment(commentID: any) {
    this.postLikeStates[commentID] = !this.postLikeStates[commentID];
    console.log(commentID);
    const likeData: any = {
      commentID: commentID,
      userID: this.matchingUser.userID
    }
    if (this.postLikeStates[commentID]) {
      console.log(likeData);
      this.userService.likeComment(likeData).subscribe(
        (response) => {
          console.log('Liked successfully:', response);
          this.getPostComments();
        },
        (error) => {
          console.error('Error liking post:', error);
        }
      );

    } else {
      console.log(likeData);
      this.userService.unlikeComment(likeData).subscribe(
        (response) => {
          console.log('Unliked successfully:', response);
          this.getPostComments();
        },
        (error) => {
          console.error('Error unliking post:', error);
        }
      );
    }
  }

  likeCommentComment2(commentID: any) {
    this.postLikeStates[commentID] = !this.postLikeStates[commentID];
    console.log(commentID);
    const likeData: any = {
      commentID: commentID,
      userID: this.matchingUser.userID
    }
    if (this.postLikeStates[commentID]) {
      console.log(likeData);
      this.userService.likeComment(likeData).subscribe(
        (response) => {
          console.log('Liked successfully:', response);
          this.getCommentsOnComment()
        },
        (error) => {
          console.error('Error liking post:', error);
        }
      );

    } else {
      console.log(likeData);
      this.userService.unlikeComment(likeData).subscribe(
        (response) => {
          console.log('Unliked successfully:', response);
          this.getCommentsOnComment();
        },
        (error) => {
          console.error('Error unliking post:', error);
        }
      );
    }
  }


  //feeds
  yourFollowers: boolean = false;
  feeds1: boolean = false;
  image1: string = "../../assets/foot.jpeg";


  yourFollower() {
    this.feeds1 = false;
    this.feeds = true;
    this.commentFeeds = false;
    this.commentOnCommentFeeds = false;

  }
  yourFollowin() {
    this.feeds1 = true;
    this.feeds = false;
    this.commentFeeds = false;
    this.commentOnCommentFeeds = false;

  }






}
