import { OnInit, Component, Input, Output, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { Subscription } from "rxjs/Subscription";


@Component({
  selector: 'cgsh-viewall-timeslot',
  templateUrl: './viewAllTimeSlot.component.html',
  styleUrls: ['./viewAllTimeSlot.component.css']
})
export class viewAllTimeSlotComponent implements OnInit {
  @Input()
  popup: Subject<any>
  data = [];

  isOpen = false;

  @Input()
  dialogTitle;

  @Output()
  commandTimeSlot = new EventEmitter();

  subscriptions: Subscription = new Subscription();

  constructor() {

  }

  ngOnInit() {
    this.subscriptions.add( this.popup.subscribe(e => {
      this.isOpen = e.isOpen;
      this.data = e.data;

      if (this.isOpen) {
        setTimeout(() => {
          window.focus();
        }, 10)
      }
    }))
  }

  viewAllTimeSlotClose() {
    this.isOpen = false;
  }

  edit(e, dataItem) {
    e.preventDefault();
    this.isOpen = false;
    this.commandTimeSlot.emit({ command : "edit", data: dataItem, isOpen : true });
  }

  delete(e, dataItem) {
    e.preventDefault();
    this.isOpen = false;
    this.commandTimeSlot.emit({ command: "delete", data: dataItem, isOpen: false });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
