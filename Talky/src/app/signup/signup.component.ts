import { Component, setTestabilityGetter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  constructor(private http: HttpClient, private router: Router, private authservice: AuthService,) { }

  //get email_userName
  email_userName: any[] = [];

  fetch_email_userName() {
    this.authservice.fetch_email_userName().subscribe((data: any) => {
      console.log(data);

      this.email_userName = data;
      console.log(this.email_userName);
    });
  }

  ngOnInit() {
    this.showImagesWithDelay();
    this.fetch_email_userName
  }
  showImagesWithDelay() {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.imagesWithMessages.length;
    }, 5000); // Change 5000 to the desired delay in milliseconds (e.g., 5000 for 5 seconds)
  }


  currentImageIndex: number = 0;
  imagesWithMessages: { path: string, message: string }[] = [
    { path:'../../assets/talky3.jpeg',  message:'welcome to talky' },
    { path: '../../assets/comment.jpg', message: 'Make comments' },
    { path: '../../assets/comments.jfif', message: 'Meet new friends' },
    { path: '../../assets/memories.jfif', message: 'Share your moments' },

  ];

  //magic
  sign: boolean = true;
  magics:boolean = false;
  talky: boolean = false;
  line: boolean = false;


  //form validation
  userName: string = '';
  email: string = '';
  password: string = '';
  confirm_password: string = '';
  registerError: string = '';
  mail:boolean = false;
  user:boolean = false;
  userNotp:boolean = false;
  userNotn:boolean = false;
  userNote:boolean = false;
  userNotc:boolean = false;
  passwords:boolean = false;
  confirms:boolean = false;

  //realtime validation
  realtimeValidation() {

    this.passwords = this.password.length > 8;
    this.userNotp = this.password.length < 8;

    this.confirms = this.password === this.confirm_password;
    this.userNotc = this.password !== this.confirm_password;
  }


  gotoLogin() {
    this.router.navigate(['/signin']);
    this.realtimeValidation();

  }


  onSubmit() {
    this.line = true;
    setTimeout(() => {
      this.line = false;

      //form validation
      if (
        this.userName === '' ||
        this.email === '' ||
        this.password === '' ||
        this.confirm_password === ''
      ) {

        this.registerError = 'Please fill all fields';
        setTimeout(() => {
          this.registerError = '';
        }, 3000);
        return;
      }

      if (this.password.length < 8) {
        this.registerError = 'Password must be at least 8 characters';
        setTimeout(() => {
          this.registerError = '';
        }, 3000);
        return;
      }

      if (this.password !== this.confirm_password) {
        this.registerError = 'Passwords do not match';
        setTimeout(() => {
          this.registerError = '';
        }, 3000);
        return;
      }

      const requestData = {
        userName: this.userName,
        email: this.email,
        password: this.password
      };

      this.authservice.registerUser(requestData).subscribe(
        (data: any) => {
          setTimeout(() => {

          }, 3000);
          this.line = false;
          this.gotoLogin();
        },
        (error) => {
          console.error('Registration failed. Server returned:', error);
          const errorResponse = error.error
          if (errorResponse && errorResponse.message) {
            this.registerError = errorResponse.message;
          } else if (errorResponse && errorResponse.error) {
            this.registerError = errorResponse.error;
          } else {
            this.registerError = 'Network error. We will back soon';
          }
          this.clearRegisterError(5000);
        }
      );
    }, 3000);
  }


  clearRegisterError(delay: number) {
    setTimeout(() => {
      this.registerError = '';
    }, delay);
  }





}
