import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  photo: string = '../../assets/muhindi.jfif';
  message: string = 'Welcome to Talky';

}
