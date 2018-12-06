import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UserService } from '../services/userService';
import { Subscription } from 'rxjs';
import { ViewNotesService } from '../../view-notes/services/viewNotesService'

@Component({
  selector: 'cgsh-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  userName = "";
  alias = environment.alias;
  defaultPicUrl = this.alias + '/assets/sharepoint_user_icon.png';
  picUrl = this.defaultPicUrl;
  subscriptions: Subscription = new Subscription();
  isShowViewNotes: boolean = false;
  userClearyKey: string = "";
  userRoleName: string = "";
  impersonateUserClearyKey: string = "";

  //, private settingService_ : SettingService
  constructor(private route: ActivatedRoute, private router_: Router,
    private viewNotesService: ViewNotesService,
    private userService: UserService) {

  }
  handlePicError() {
    this.picUrl = this.defaultPicUrl;
  }

  ngOnInit(): void {
    this.initProfile();
    
    //Get logon user Role
    this.userService.getUserRoles().then(roles => {
      roles.forEach(role => {
        this.userRoleName = role.name;
      });
    })

    this.subscriptions.add( this.route.queryParams.subscribe(params => {
      const userId = params['u'];
      if (userId) {
        this.userService.impersonate(userId);
      }
    }))

    this.subscriptions.add(this.userService.impersonating().subscribe((userInfo) => {
      if (userInfo) {
        this.initProfile();
      }
          
    }));

    this.userService.getClearyKey().then(key => {
      this.userClearyKey = key;      
      this.checkUserHasNotes(this.userClearyKey, this.userRoleName);      
    })

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initProfile() {
    this.userService.getPicUrl().then(picUrl => {
      this.picUrl = picUrl;
    });

    this.userService.getUserFirstName().then(firstName => {
      this.userName = firstName;
    })

    this.userService.getUserRoles().then(roles => {
      roles.forEach(role => {
        this.userRoleName = role.name;
      });
    })

    this.userService.getClearyKey().then(key => {
      this.impersonateUserClearyKey = key;
      if (this.IsEmptyOrNull(this.impersonateUserClearyKey) == false) {
        this.checkUserHasNotes(this.impersonateUserClearyKey, this.userRoleName); 
      }
    })
  }

  checkUserHasNotes(userClearyKey: string, userRoleName: string) {
    this.viewNotesService.getRequestorList(userClearyKey, userRoleName).subscribe((results) => {
      if (results.length > 0) {
        this.isShowViewNotes = true;
      }
      else {
        this.isShowViewNotes = false;
      }
    })
  }

  menuClose($event) {
    $event.preventDefault();
  }

  onSelect({ item }) {
    if (item.text) {
      this.routerRules(item.text);
    }
    // this.router_.navigate(['/feed'])

  }

  public IsEmptyOrNull(value: string): Boolean {
    if (typeof value != 'undefined' && value) {
      return false;
    }
    return true;
  }

  private routerRules(text) {
    switch (text) {
      case "Home":
        this.router_.navigate(['/home'])
        break;
      case "View Notes":
        this.router_.navigate(['/viewnotes'])
        break;
    }
  }
}
