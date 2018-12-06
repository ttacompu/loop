import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { FeedbackRequestService } from '../services/feedbackRequestService';
import { UserService } from '../../core/services/userService';
import { Router } from '@angular/router';
import * as fromHome from '../state/home.reducer';
import * as homeActions from '../state/home.action'
import { Store } from '@ngrx/store';


@Component({
  selector: 'cgsh-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements OnInit {

  subscriptions: Subscription = new Subscription();

  @Input()
  dataList;

  @Output()
  openFeedbackToOthers = new EventEmitter();

  constructor(public userService: UserService, private router: Router, private store: Store<fromHome.HomeState>) { }

  ngOnInit() {
   
  }

  routeByStatus(e, item) {
    e.preventDefault();
    //this.store.dispatch(new homeActions.Redirect(item.id));
    this.router.navigate(['/home', 'editRequest', item.id]);
  }

  openDetails(e) {
    e.preventDefault();
    this.openFeedbackToOthers.emit();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
