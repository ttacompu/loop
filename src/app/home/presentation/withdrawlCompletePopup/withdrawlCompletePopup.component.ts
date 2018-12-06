import { OnInit, Component, Input, Output, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { Subscription } from "rxjs/Subscription";


@Component({
  selector: 'cgsh-withdrawl-Complete-Popup',
  templateUrl: './withdrawlCompletePopup.component.html',
  styleUrls: ['./withdrawlCompletePopup.component.css']
})
export class withdrawlCompletePopupComponent implements OnInit {
  @Input()
  popup: Subject<boolean>;

  @Input()
  isComplete;

  @Input()
  dialogTitle;

  @Output()
  sendCommand = new EventEmitter();

  isOpen = false;
  withdrawComment = "";
  completedDate = new Date();
  
  subscriptions: Subscription = new Subscription();

  constructor() {

  }

  ngOnInit() {
    this.subscriptions.add(this.popup.subscribe(data => {
      this.isOpen = data;
      if (this.isOpen) {
        setTimeout(() => {
          window.focus();
        }, 10)
      }
    }))
  }
  reset() {
    this.withdrawComment = "";
    this.completedDate = new Date();
  }
  completeWindowClose() {
    this.isOpen = false;
    this.reset();
  }

  changeWithdraw(e) {
    e.preventDefault();
    this.isOpen = false;
    this.sendCommand.emit({ command: "withdraw", data: { withdrawComment: this.withdrawComment }})
  }

  changeComplete(e) {
    e.preventDefault();
    this.isOpen = false;
    this.sendCommand.emit({ command: "complete", data: { completedDate: this.completedDate } })
  }

  cancel(e) {
    e.preventDefault();
    this.isOpen = false;
    this.reset();
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
