import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { UserService } from "../../../core/services/userService";
import { Router } from "@angular/router";


@Component({
  selector: 'cgsh-details-popup',
  templateUrl: './detailsPopup.component.html',
  styleUrls: ['./detailsPopup.component.css']
})

export class DetailsPopupComponent implements OnInit {
  @Input()
  popup: Subject<any>;

  @Output()
  openResponseWindow = new EventEmitter();

  dialogTitle ="";
  columnName ="contributorFullName";
  isWorkList = false;
  isFeedBackToOthers = false;
  data = null;

  subscriptions: Subscription = new Subscription();

  isOpen = false;

  constructor(public userService: UserService, private router: Router) {

  }
  ngOnInit() {
    this.subscriptions.add(this.popup.subscribe((setting: any) => {
      this.data = setting.data;
      this.isOpen = setting.isOpen;
      
      this.dialogTitle = setting.dialogTitle;
      this.columnName = setting.columnName;
      this.isWorkList = setting.isWorkList;
      this.isFeedBackToOthers = setting.isFeedBackToOthers;

      if (setting.isOpen) {
        setTimeout(() => {
          window.focus();
        }, 10)
      }
    }));
  }

  requestDetailsClose() {
    this.isOpen = false;
  }

  openWindow(e, dataItem, isResponse){
    e.preventDefault();
    this.isOpen = false;
    this.openResponseWindow.emit({ item: dataItem, isResponse  });
  }

  redirectDetails(e, item) {
    e.preventDefault();
    if (item.isShowRespondButton) {
      this.router.navigate(['/home', 'editRequest', item.id]);
    } else {
      this.router.navigate(['/home', 'createRequest', item.id]);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
