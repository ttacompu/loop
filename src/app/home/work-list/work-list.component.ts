import { EventEmitter, Component, OnInit, Output, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import * as fromHome from '../state/home.reducer';
import * as homeActions from '../state/home.action'
import { Store } from '@ngrx/store';


@Component({
  selector: 'cgsh-work-list',
  templateUrl: './work-list.component.html',
  styleUrls: ['./work-list.component.css']
})
export class WorkListComponent implements OnInit {
  subscriptions = new Subscription();

  @Input()
  dataList;

  @Output()
  openWorkList =   new EventEmitter();

  @Output()
  openResponsePop = new EventEmitter();

  @Output()
  ackDataOut = new EventEmitter();

  constructor(private router: Router, private store: Store<fromHome.HomeState>) { }

  ngOnInit() {
  }

  openDetails(e) {
    e.preventDefault();
    this.openWorkList.emit();
  }

  workListResponse(e, isResponse, item) {
    e.preventDefault();
    this.openResponsePop.emit({ isResponse, item });
  }

  ShowAlertPopup(e, item) {
    e.preventDefault();
    this.ackDataOut.emit(item)
  }

  redirectDetails(e, item) {
    e.preventDefault();
    if (item.isShowRespondButton) {
      this.router.navigate(['/home', 'editRequest', item.id]);
    } else {
      this.store.dispatch(new homeActions.Redirect(item.id));
      this.router.navigate(['/home', 'createRequest']);
    }
    
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
