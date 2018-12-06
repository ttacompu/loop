import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/userService';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-secretary-home',
  templateUrl: './secretary-home.component.html',
  styleUrls: ['./secretary-home.component.css']
})
export class SecretaryHomeComponent implements OnInit {
  subscriptions = new Subscription();
  lawyersBysecretary = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.isSecretary().then(isSecretary => {
      if (isSecretary) {
        this.userService.getAllLawyers().then(lawyers => {
          this.lawyersBysecretary = lawyers;
          // If user is a secretary, start by impersonating the first lawyer in their list
          if (this.lawyersBysecretary && this.lawyersBysecretary.length === 1) {
            this.userService.impersonate(this.lawyersBysecretary[0].userID);
          }
        })
      }
    })
  }

  impersonate(e, item) {
    e.preventDefault();
    this.userService.impersonate(item.userID);

  }

  ngOnDestroy() {

  }

}
