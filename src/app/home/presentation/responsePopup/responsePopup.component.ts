import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ValidationRuleService } from "../../../shared/validationRuleService";
import { DatePipe } from "@angular/common";
import { FeedbackRequestService } from "../../services/feedbackRequestService";
import { Router } from "@angular/router";
import { ReminderNotification } from "../../services/reminderNotification";
import { UserService } from "../../../core/services/userService";


@Component({
  selector: 'cgsh-response-popup',
  templateUrl: './responsePopup.component.html',
  styleUrls: ['./responsePopup.component.css']
})

export class ResponsePopupComponent implements OnInit {
  @Input()
  popup: Subject<any>;

  @Output()
  sentReminder = new EventEmitter();

  statusChangedForm: FormGroup;
  subscriptions: Subscription = new Subscription();
  pageKey = "responsePopup";

  data;
  reminderData;

  isOpen = false;

  constructor(private fb: FormBuilder,
    private validationRuleService: ValidationRuleService,
    private datePipe: DatePipe, private feedbackRequestService: FeedbackRequestService, private reminderNotification: ReminderNotification, private router: Router, private userService: UserService) {

  }
  ngOnInit() {
    this.validationRuleService.SetValidationRules({
      [this.pageKey]: {
        requestDetails: [''],
        requestDate: [''],
        acceptComment: [''],
        rejectComment : ['']
      }
    });
    this.statusChangedForm = this.validationRuleService.SetValidationRuleOnForm(this.pageKey);

    this.subscriptions.add(this.popup.subscribe((e:any) => {
      this.isOpen = e.isOpen
      if (e.data && e.reminderData) {
        this.data = e.data;
        this.reminderData = e.reminderData;
      }
      if (this.isOpen) {
        this.windowFocus();
      }
    }));
  }


  private windowFocus() {
    setTimeout(() => {
      window.focus();
    }, 10)
  }

  requestDetailsClose() {
    this.isOpen = false;
  }

  // sent reminder from index
  reminding() {
    if (this.data) {
      this.isOpen = false;
      this.sentReminder.emit({ data: this.data });
    }
  }

 
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
