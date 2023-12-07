import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  constructor(private userService: UserService) { }
  profile: boolean = true;
  image: string = "../../assets/blackman.jfif";
  feeds: boolean = false;

  linem: boolean = false;
  linef: boolean = false;
  linep: boolean = true;
  linel: boolean = false;

  ngOnInit() {
    this.fetchAllUsers();
  }

  viewHome() {
    this.profile = false;
    this.feeds = true;
  }

  //profile
  profileView() {
    this.profile = true;
    this.feeds = false;
    this.specificUser = false;
    this.mine = true;
  }
  setLineStatus(m: boolean, f: boolean, p: boolean, l: boolean): void {
    this.linem = m;
    this.linef = f;
    this.linep = p;
    this.linel = l;
  }

  setContentStatus(p: boolean, m: boolean, fl: boolean, fw: boolean): void {
    this.post = p;
    this.medias = m;
    this.folowers = fl;
    this.folowing = fw;
  }


  general: boolean = false;
  //followers
  folowers: boolean = false;
  followers() {
    this.setLineStatus(false, true, false, false);
    this.setContentStatus(false, false, true, false);
    this.general = true;
  }

  //following
  folowing: boolean = false;
  following() {
    this.setLineStatus(false, false, false, true);
    this.setContentStatus(false, false, false, true);
    this.general = true;

  }

  //media
  medias: boolean = false;
  media() {
    this.setLineStatus(true, false, false, false);
    this.setContentStatus(true, true, false, false);
    this.post = false;


  }

  //post
  post: boolean = false;
  posts() {
    this.setLineStatus(false, false, true, false);
    this.setContentStatus(true, false, false, false);
  }

  specificUser: boolean = false;
  mine: boolean = true;
  otherName: string = '';
  otherFollowers: number = 0;
  otherFollowing: number = 0;
  otherID:string = ''

  viewSpecificUser(user: any) {
    this.specificUser = true;
    this.mine = false;
    this.otherName = user.userName;
    this.otherFollowers = user.followers;
    this.otherFollowing = user.following;
    this.otherID = user.userID
  }

  //get all users
  searchTearm: string = '';
  filteredUsers: any[] = [];
  allUsers: any[] = [];
  line: boolean = false;
  fetchAllUsers() {
    this.userService.fetchAllUsers().subscribe((data: any) => {
      this.allUsers = data;
      this.filterUsers();
      console.log(this.allUsers);

      this.filteredUsers = [...this.allUsers]
    });

  }

  //filtering
  filterUsers() {
    setTimeout(() => {
      this.filteredUsers = this.allUsers.filter((user: any) => {
        return user.userName && user.userName.toLowerCase().includes(this.searchTearm.toLowerCase());
      })

    }, 4000);

  }

  //follow user
  ID :string = ''
  userDetails:any[]= []
  followUser(otherID:any){
    // this.userDetails = JSON.parse(localStorage.getItem('details')||'[]')
    // console.log(this.userDetails);
    
    
    const followData = {
      userFollowedID:otherID,
  
    }
    console.log(followData);
    
    // this.userService.followUser(followData)

  }








}
