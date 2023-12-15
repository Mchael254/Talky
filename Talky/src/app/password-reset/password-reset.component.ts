import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AdminService } from '../services/admin.service';

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

  constructor(private http: HttpClient, private router: Router, private userAuth: AuthService, private adminService: AdminService) { }
  // async onSubmit() {
  //   this.line = true;
  //   setTimeout(async () => {
  //     this.line = false;
  //   //credentials validation
  //   if (!this.userName || !this.password) {
  //     this.message = true;
  //     this.loginError = 'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.';
  //     this.clearRegisterError(4000);
  //     return;

  //   }
  //   const requestData = {
  //     userName: this.userName,
  //     password: this.password
  //   };
  //   this.loginError = '';

  //  await this.userAuth.login(requestData, () => {
  //     this.userAuth.redirect();

  //   });
  //   this.loginError = this.userAuth.getLoginError();
  //   this.loginSuccess = this.userAuth.getLoginSuccess();

  //   this.clearRegisterError(4000);
  // }, 3000);

  // }

  // clearRegisterError(delay: number) {
  //   setTimeout(() => {
  //     this.loginError = '';
  //   }, delay);
  // }
  meso: string = '';
  onImageSelected(event: any): void {
    const fileList: FileList | null = event.target.files;
    if (fileList && fileList.length > 0) {
      this.selectedImage = fileList[0];
    }
  }

  selectedImage: File | null = null;
  userID: string = '';
  onSubmit(): void {
    if (!this.selectedImage) {
      this.meso = 'Please select an image to upload';
      return;
    }
    if (!this.userID) {
      this.meso = 'Please enter student name';
      return;
    }
    console.log(this.selectedImage);

    const formData = new FormData();
    formData.append('profilePic', this.selectedImage);
    formData.append('userID', this.userID);
    console.log(formData);


    this.adminService.uploadImage(formData).subscribe(
      (response) => {
        console.log(response);
        this.meso = response.message;
      },
      (error) => {
        console.log(error);
        this.meso = error.error.message;
      }
    )


  }

}
