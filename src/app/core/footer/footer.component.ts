import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/userService';

@Component({
  selector: 'cgsh-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit{
  currentYear:string = "2018";
  version:string = "1.3.0";
  userName: string = ""

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getUserId().then(userId => {
      this.userName = userId
    });
  }
}
