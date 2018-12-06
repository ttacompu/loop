import { Output, EventEmitter, Component, OnInit, Input } from '@angular/core';
import { process, State } from '@progress/kendo-data-query';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/userService';
import { Store, select } from '@ngrx/store';
import * as fromHome from '../state/home.reducer';
import * as homeActions from '../state/home.action'

@Component({
  selector: 'cgsh-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {

  subscriptions: Subscription = new Subscription();

  @Input()
  dataList;

  @Output()
  openRequestDetails = new EventEmitter();

  constructor(private router: Router, public userService: UserService, private store: Store<fromHome.HomeState>) {
  }

  ngOnInit() {
  }

  openDetails(e) {
    e.preventDefault();
    this.openRequestDetails.emit();

  }

  newRequest(e) {
    e.preventDefault();
    this.store.dispatch(new homeActions.Redirect(0));
    this.router.navigate(['/home', 'createRequest']);
  }

  routeByStatus(e, item) {
    e.preventDefault();
    this.store.dispatch(new homeActions.Redirect(item.id));
    this.router.navigate(['/home', 'createRequest']);
  }

  
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

 
}
