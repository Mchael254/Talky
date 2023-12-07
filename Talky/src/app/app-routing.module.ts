import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { SignupComponent } from './signup/signup.component';
import { AdminComponent } from './admin/admin.component';
import { SigninComponent } from './signin/signin.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {path:'',redirectTo:'/landing',pathMatch:'full'},
  { path:'landing',component: LandingComponent},
  {path:'signin',component:SigninComponent},
  {path:'signup',component:SignupComponent},
  {path:'user',component:UserComponent},
  {path:'passwordReset',component:PasswordResetComponent},
  {path:'admin',component:AdminComponent},
  {path:'welcome',component:WelcomeComponent},
  {path:'**',component:PagenotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
