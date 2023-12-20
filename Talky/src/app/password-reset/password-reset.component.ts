import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AdminService } from '../services/admin.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {

  userName: string = '';
  password: string = '';
  loginError: string = '';
  loginSuccess: string = '';
  line: boolean = false;
  message: boolean = false;

  constructor(private http: HttpClient, private router: Router, private userAuth: AuthService, private adminService: AdminService, private userService: UserService) { }

  // reset password
  email: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  newPassword: string = '';

  container1: boolean = true;
  container2: boolean = false;

  resetError: boolean = false;
  resetSuccess: boolean = false;
  requestButton: boolean = true;
  resetButton: boolean = false;
  reset: boolean = false;
  request: boolean = true;
  token: string = '';
  back: boolean = false;

  requestResetPassword() {
    if (this.email === '') {
      this.resetError = true;
      this.errorMessage = 'Please enter your email address';
      setTimeout(() => {
        this.resetError = false;
        this.errorMessage = '';
      }, 2500);
      return;
    }

    const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormatRegex.test(this.email)) {
      this.resetError = true;
      this.errorMessage = 'Invalid email format';
      setTimeout(() => {
        this.resetError = false;
        this.errorMessage = '';
      }, 2500);
      return;
    }

    this.userService.initiatePasswordReset(this.email).subscribe(
      (response) => {
        console.log(response);
        this.resetSuccess = true;
        this.successMessage = response.message;
        setTimeout(() => {
          this.resetSuccess = false;
          this.successMessage = '';
          this.request = false;
          this.reset = true;
        }, 3000);
        this.requestButton = false;
        this.resetButton = true;
        this.container1 = false;
        this.container2 = true;
      },
      (error) => {
        console.error(error);
        this.resetError = true;
        this.errorMessage = error.error.message;
        setTimeout(() => {
          this.resetError = false;
          this.errorMessage = '';
        }, 2500);
      }
    );
  }

 
  resetPassword() {

    if (this.email === ''|| this.token === '' ) {
      this.resetError = true;
      this.errorMessage = 'Please fill all the fields';
      setTimeout(() => {
        this.resetError = false;
        this.errorMessage = '';
      }, 2500);
      return;
    }else if(this.newPassword.length < 8){
      this.resetError = true;
      this.errorMessage = 'Password must be at least 8 characters';
      setTimeout(() => {
        this.resetError = false;
        this.errorMessage = '';
      }, 2500);
      return;
    }

    const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormatRegex.test(this.email)) {
      this.resetError = true;
      this.errorMessage = 'Invalid email format';
      setTimeout(() => {
        this.resetError = false;
        this.errorMessage = '';
      }, 2500);
      return;
    }

    this.userService.resetPassword(this.email, this.newPassword, this.token).subscribe(
      (response) => {
        console.log(response);
        this.resetSuccess = true;
        this.successMessage = response.message;
        setTimeout(() => {
          this.resetSuccess = false;
          this.successMessage = '';
          this.requestButton = false;
          this.resetButton = false;
          this.back = true;
        }, 3000);
        this.back = true;
        this.reset = false;
        this.requestButton = false;
        console.log('Password reset successful:', response.message);
        this.router.navigate(['/signin']);
      },
      (error) => {
        console.error(error);
        this.resetError = true;
        this.errorMessage = error.error.message;
        setTimeout(() => {
          this.resetError = false;
          this.errorMessage = '';
        }, 2500);
        console.error('Error during password reset:', error.error.message);
      }
    );

  }



}
