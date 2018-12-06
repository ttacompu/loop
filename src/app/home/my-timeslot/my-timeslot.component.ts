import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TimeSlotService } from '../services/timeSlotService';
import { UserService } from '../../core/services/userService';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import * as R from 'ramda';
import { DialogWrapService } from '../../shared/dialogWrapService';

@Component({
  selector: 'cgsh-my-timeslot',
  templateUrl: './my-timeslot.component.html',
  styleUrls: ['./my-timeslot.component.css']
})
export class MyTimeslotComponent implements OnInit {
  @Output()
  openTimeSlotPopUp = new EventEmitter();

  @Output()
  viewAllTimeSlotOpen = new EventEmitter();

  @Output()
  commandForTimeSlot = new EventEmitter();

  @Input()
  executeCommand:Subject<any>;

  subscriptions = new Subscription();

  @Input()
  dataList = [];

  dilogResult

  constructor(public timeSlotService: TimeSlotService, public userService: UserService, private router: Router, private dialogWrapService: DialogWrapService,) {

  }

  ngOnInit() {
  }


  openTimeSlotPop(e) {
    e.preventDefault();
    this.openTimeSlotPopUp.emit();
  }

  viewAllTimeSlot(e) {
    e.preventDefault();
    this.viewAllTimeSlotOpen.emit();

  }

  edit(e, data) {
    e.preventDefault();
    this.commandForTimeSlot.emit({command : "edit", data, isOpen : true  })
  }

  delete(e, data) {
    e.preventDefault();
    this.commandForTimeSlot.emit({ command: "delete", data,  isOpen : false })
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
