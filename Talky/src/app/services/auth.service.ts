import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { userlogin } from 'src/interfaces/login';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5800/user';
  private get_email_userName = 'http://localhost:5800/user/get_email_userName';
  private loginError: string = '';
  private loginSuccess:string = '';

  constructor(private http: HttpClient, private router: Router) { }

  //signup
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  //fetch email_userName
  fetch_email_userName():Observable<any[]>{
    return this.http.get<any[]>(this.get_email_userName)
  }


  //login
  async login(userLogin: userlogin, redirectCallback: () => void) {
    try {
      // console.log(userLogin);
      let response = await fetch('http://localhost:5800/user/login', {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(userLogin)
      });

      // console.log(response);
      const data = await response.json()
      // console.log(data);

      if(data.error){
        this.loginError = data.error
        console.log(this.loginError);
      }else if(data.message){
        this.loginError = '';
        this.loginSuccess = data.message;
        setTimeout(() => {
          this.loginSuccess = '';
          localStorage.setItem('token', data.token);

          localStorage.setItem('isLoggedIn', 'true');
          // console.log(data.token);

          redirectCallback();

        }, 2000);

      }

    } catch (error) {
      console.error('Login failed:', error);
      if (error instanceof TypeError) {
        this.loginError = 'Network error.';
      }
    //  console.log(this.loginError);
    }
  }


  isAuthenticated(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
  getLoginError(): string {
    return this.loginError;
  }
  getLoginSuccess():string{
    return this.loginSuccess;
  }

  async redirect() {
    try {
      const token = localStorage.getItem('token') as string;

      const data: any = await this.http.get('http://localhost:5800/user/check_user_details', {
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
          'token': token
        }
      }).toPromise();

      console.log(data.info);
      let details = JSON.stringify(data.info)
      localStorage.setItem('details',details)

      if (data.info.role === 'customer') {
        localStorage.setItem('user_email', data.info.email);
        this.router.navigate(['/user']);


      } else if (data.info.role === 'admin') {
        localStorage.setItem('user_email', data.info.email);
        this.router.navigate(['/admin']);
      }
    } catch (error) {
      console.error('Redirect failed:', error);

    }
  }

//request reset password
  private requestResetPasswordUrl = 'http://localhost:5800/user/requestPassword';

  initiatePasswordReset(email: string): Observable<any> {
    const requestBody = { email };

    return this.http.post<any>(this.requestResetPasswordUrl, requestBody);
  }


  //reset password
  private resetPasswordUrl = 'http://localhost:5800/user';

  resetPassword(email: string, newPassword: string, token: string): Observable<any> {
    const resetData = { email, newPassword, token };
    return this.http.post(`${this.resetPasswordUrl}/resetPassword`, resetData);
  }


}
