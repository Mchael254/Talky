import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  userName: string = '';
  password: string = '';
  loginError: string = '';
  loginSuccess:string = '';
  line:boolean = false;


  constructor( private http: HttpClient,private router: Router, private userAuth: AuthService) { }

  async onSubmit() {
    this.line = true;
    setTimeout(async () => {
      this.line = false;
    //credentials validation
    if (!this.userName || !this.password) {
      this.loginError = 'Fill in all fields';
      this.clearRegisterError(4000);
      return;

    }
    const requestData = {
      userName: this.userName,
      password: this.password
    };
    this.loginError = '';

   await this.userAuth.login(requestData, () => {
      this.userAuth.redirect();

    });
    this.loginError = this.userAuth.getLoginError();
    this.loginSuccess = this.userAuth.getLoginSuccess();

    this.clearRegisterError(4000);
  }, 3000);

  }

  clearRegisterError(delay: number) {
    setTimeout(() => {
      this.loginError = '';
    }, delay);
  }

}
