import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  photos: string[] = ['../../assets/talk.png', '../../assets/muhindi.jfif','../../assets/muhindi.jfif','../../assets/muhindi.jfif'];
  messages: string[] = [' Welcome to Talky',  'I love using Talky','I love using Talky','I love using Talky'];

  photo: string = '';
  message: string = '';
  items: { photo: string, message: string }[] = [];
  currentIndex = 0;
  display() {
    this.items = this.photos.map((photo, index) => ({
      photo: photo,
      message: this.messages[index]
    }));

  }
  imageSlider() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    }, 3000);
  }
  ngOnInit() {
    this.display();
    this.imageSlider();
  }
}






