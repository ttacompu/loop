import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/userService';
import { environment } from "../../../environments/environment";
import { Router } from '@angular/router';


@Component({
  selector: 'cgsh-impersonate',
  templateUrl: './impersonate.component.html',
  styleUrls: ['./impersonate.component.css']
})
export class ImpersonateComponent implements OnInit {

  isImpersonated = false;
  isSecretary = false;
  lawyersBysecretary = [];
  impersonatedUser = "";
  selectedValue;

  constructor(private userService: UserService, private router: Router) {

  }

  ngOnInit() {
    this.userService.impersonating().subscribe((data : any) => {
      if (data) {
        this.impersonatedUser = data.UserInfo.impersonatedUserInfo.person.fullName;
        this.isImpersonated = true;
        if (this.router.url.includes("secretaryHome")) {
          this.router.navigate(["/home", "index"]);
        }
      }
    })

    //This one is relate with secretary only code
   /* this.userService.isSecretary().then(data => {
      this.isSecretary = data;
      if (data) {
        this.userService.getAllLawyers().then(lawyers => {
          this.lawyersBysecretary = lawyers;
        })
      }
    })*/

  }

  /*selected(e) {
    if (e) {
      this.userService.impersonate(e.userID);
    }
  }*/

  closeImpersonating(e) {
    if (this.userService.userId) {
      window.location.assign(`${environment.alias}/home/index?uid=${this.userService.userId}`);
    }
    else {
      window.location.assign(`${environment.alias}/home/index`);
    }
  }

}
