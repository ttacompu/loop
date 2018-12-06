import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FeedbackRequestService } from '../services/feedbackRequestService';
import { ObservableBusinessService } from '../../core/services/observableBusiness.service';
import { Subscription, Subject } from 'rxjs';
import { ValidationRuleService } from '../../shared/validationRuleService';
import { DatePipe } from '@angular/common';
import { UserService } from '../../core/services/userService';
import { TimeSlotService } from '../services/timeSlotService';
import { timer } from 'rxjs/observable/timer';
import { switchMap } from 'rxjs/operator/switchMap';
import { of } from 'rxjs/observable/of';
import { DialogWrapService } from '../../shared/dialogWrapService';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { Store, select } from '@ngrx/store';
import * as fromHome from '../state/home.reducer';
import * as homeActions from '../state/home.action'
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {
  currentStatus = "";
  createRequestForm: FormGroup;
  pageKey = "createRequest";
  orginLawyerList = [];
  renderLawyerList = [];
  libList = [];

  currentTimeSlot;
  currrentRequestFeedback;
  currentFeedrequestId = 0;

  feedbackList;
  isEdit = false;
  isDraft = false;
  isPending = false;
  formLabel = "Request for new feedback";

  withdrawCompletePopupSubject: Subject<boolean> = new Subject();

  timeSlotList = [];
  subscriptions: Subscription = new Subscription();

  @ViewChild('responder')
  responder;

  @ViewChild('pendingButton')
  pendingButton;

  errorMessages = {
    responder: "",
    feedbackDetails: "",
    availableTime: "",
    iManageDocNumber: ""
  };

  isComplete;
  isAvailableMeeting = false;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router,
    private feedbackRequestService: FeedbackRequestService,
    private observableBusinessService: ObservableBusinessService,
    private validationRuleService: ValidationRuleService,
    private datePipe: DatePipe, public userService: UserService,
    private timeSlotService: TimeSlotService,
    private dialogWrapService: DialogWrapService,
    private store: Store<fromHome.HomeState>
  ) {
  }

  private timeslotEnable() {
    if (this.isEdit && !this.isDraft) {
      this.createRequestForm.controls["availableTime"].disable();
    } else {
      this.createRequestForm.controls["availableTime"].enable();
    }
  }

  ngOnInit() {
    //Store dispatch part
    this.store.dispatch(new homeActions.CreateRequestDataLoad());


    this.validationRuleService.SetValidationRules({
      [this.pageKey]: {
        responder: ['', Validators.required],
        availableTime: [{ value: '', disabled: true }, null, this.validationRuleService.timeSlotTaken({ isEdit: this.isEdit, isDraft: this.isDraft }).bind(this)],
        matterNumber: [''],
        feedbackDetails: ['', Validators.required],
        iManageDocNumber: ['', this.validationRuleService.numberMaxLength.bind(this)],
        iManageServer: [1]
      }
    });

    this.createRequestForm = this.validationRuleService.SetValidationRuleOnForm(this.pageKey);
    this.validationRuleService.SetValidationsMessages({
      [this.pageKey]: {
        responder: {
          required: "Please choose lawyer name"
        },
        feedbackDetails: {
          required: "Type details"
        },
        availableTime: {
          timeSlotTaken: "this timeslot is already taken by other"
        },
        iManageDocNumber: {
          numberMaxLength: "cannot accept more than 9 number"
        }
      }
    })

    this.subscriptions.add(this.validationRuleService.Validate(this.createRequestForm, this.pageKey, this.validationRuleService.ExecuteValidationRules.bind(this), ["timeSlotTaken"])
      .subscribe((messages) => {
        this.errorMessages = { ...this.errorMessages, ...messages };
      }));

    this.subscriptions.add(this.store.pipe(select(fromHome.getCreateRequestData)).subscribe(data => {
      if (data) {
        this.libList = data.iManageLibs;
        this.orginLawyerList = data.lawyers;
      }
    }));
  

    this.subscriptions.add(this.createRequestForm.controls.responder.valueChanges.subscribe(
      (val) => {
        this.timeslotEnable();
        if (val) {
          this.timeSlotService.getAvailabeTimeSlotByClearyKey(val).subscribe(items => {
            let availableTimeSlots = this.mapDataToTimeSlotList(items);
            if (this.isEdit && this.currentTimeSlot) {
              const isTimeSlotAvailable = availableTimeSlots.findIndex(x => x.id == this.currentTimeSlot.id) > -1;
              if (!isTimeSlotAvailable) {
                availableTimeSlots.push(this.currentTimeSlot);
              }
              this.timeSlotList = availableTimeSlots;
            } else {
              this.timeSlotList = availableTimeSlots;
            }
            this.isAvailableMeeting = (this.timeSlotList && this.timeSlotList.length > 0);
          });
        } else {
          this.isAvailableMeeting = false;
          this.timeSlotList = [];
        }
      }
    ));

    this.store.pipe(select(fromHome.getCurrentRequestFeedback)).subscribe(result => {
      if (result) {
        const id = result.id;
        if (id) {
          this.formLabel = "Request Details";
          this.currentFeedrequestId = id;
          this.isEdit = true;
          this.currrentRequestFeedback = result;
          const currentClearyKey = result.contributorClearyKey;

          this.isDraft = (this.userService.getStatusColor(result.status.id) === "Draft")
          this.isPending = (this.userService.getStatusColor(result.status.id) === "Requested");
          this.disableControls();
          const currentLawyer = { clearyKey: currentClearyKey, fullName: result.contributorFullName };
          const iManageLib = (result.iManageLibrary.id == 0) ? null : { id: result.iManageLibrary.id, name: result.iManageLibrary.name };
          this.libList = iManageLib ? [iManageLib] : [];
          this.renderLawyerList = [currentLawyer];
          const currentTimeSlot = (result.timeSlot.id == 0) ? null : { id: result.timeSlot.id, name: `${this.datePipe.transform(result.timeSlot.fromDate, 'dd-MMM-yyyy hh:mm a')} - ${this.datePipe.transform(result.timeSlot.toDate, 'dd-MMM-yyyy hh:mm a')}` };

          if (currentTimeSlot && this.isEdit) {
            this.currentTimeSlot = currentTimeSlot;
          }
          this.createRequestForm.setValue({
            responder: result.contributorClearyKey,
            matterNumber: result.clientMatterNumber,
            availableTime: currentTimeSlot ? currentTimeSlot.id : '',
            feedbackDetails: result.requestDetails,
            iManageDocNumber: result.iManageDocNumber,
            iManageServer: result.iManageLibrary.id
          });
        }
      }
    })
  }

  mapDataToTimeSlotList(arr) {
    return arr.map(item => ({
      id: item.id,
      name: `${this.datePipe.transform(item.fromDate, 'dd-MMM-yyyy hh:mm a')} - ${this.datePipe.transform(item.toDate, 'dd-MMM-yyyy hh:mm a')}`
    }));
  }

  disableControls() {
    if (!this.isDraft) {
      this.validationRuleService.disalbeAllControls(this.createRequestForm, "disable")
    }
  }

  ngAfterViewInit() {
    this.observableBusinessService.addBusineeRuleToObservable(this.responder.filterChange.asObservable(), this.mapFactory("orginLawyerList", "fullName"), result => {
      this.renderLawyerList = result;
    })
  }

  private mapFactory = (dataSource, fieldName = 'name') => (input: any) => {
    if (!input.length || (input.length < 1)) {
      return []
    } else {
      return this[dataSource].filter((x) => x[fieldName].toLocaleLowerCase().includes(input.toLowerCase()));
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  cancel(event) {
    this.router.navigate(['/home', 'index']);
  }

  savePending() {
    this.pendingButton.nativeElement.disabled = true;
    this.prepareSave().then(currentRequest => {
      currentRequest.status = { id: 2 };
      this.subscriptions.add(this.feedbackRequestService.saveRequestFeedback(currentRequest).subscribe(result => {
        this.router.navigate(['/home', 'index', "Your request for feedback has been submitted"]);
      }))
    })
  }

  saveDraft() {
    this.prepareSave().then(currentRequest => {
      currentRequest.status = { id: 1 };
      this.subscriptions.add(this.feedbackRequestService.saveRequestFeedback(currentRequest).subscribe(result => {
        this.router.navigate(['/home', 'index', "feedback is created with draft status"]);
      }))

    })
  }

  prepareSave(): any {
    const formValResult = this.createRequestForm.value;
    let currentRequest: any = {
      feedbackTimeSlot: { id: formValResult.availableTime ? formValResult.availableTime : 0 },
      contributorClearykey: formValResult.responder,
      timeslot: formValResult.availableTime ? { id: formValResult.availableTime } : { id: 0 },
      clientMatterNumber: formValResult.matterNumber ? formValResult.matterNumber : "",
      iManageDocNumber: formValResult.iManageDocNumber,
      iManageLibrary: formValResult.iManageServer ? { id: formValResult.iManageServer } : { id: 1 },
      RequestDetails: formValResult.feedbackDetails ? formValResult.feedbackDetails : ""
    };
    if (this.isEdit) {
      currentRequest.id = this.currentFeedrequestId;
    }

    // requesterClearyKey: formValResult.responder.clearyKey,
    return this.userService.getClearyKey().then(key => {
      currentRequest.requesterClearyKey = key;
      return currentRequest;
    })
  }

  deleteFeedback(e) {
    e.preventDefault();
    const dialog: DialogRef = this.dialogWrapService.createDialog({ content: 'Are you sure to delete this request?' })
    //Call back from Dialog Window
    this.subscriptions.add(this.dialogWrapService.dialogResponse(dialog, (() => {
      this.deleteRequest();
    }).bind(this)));
   
  }

  private deleteRequest() {
    this.subscriptions.add(this.feedbackRequestService.deleteFeedback(this.currentFeedrequestId).subscribe(msg => {
      this.router.navigate(['/home', 'index', "feedback request has been deleted!"]);
    }));
  }

  isAccepted() {
    if (this.isEdit && this.currrentRequestFeedback) {
      if (this.userService.getStatusColor(this.currrentRequestFeedback.status.id) === "Accepted") {
        return true;
      }
    }
    return false;
  }

  showWithdraw() {
    if (this.isEdit && this.currrentRequestFeedback) {
      const status = this.userService.getStatusColor(this.currrentRequestFeedback.status.id)
      if (status === "Accepted" || status === "Requested") {
        return true;
      }
    }
    return false;
  }

  withdrawRequest() {
    this.isComplete = false;
    this.withdrawCompletePopupSubject.next(true);
  }

  completeFeedback() {
    this.isComplete = true;
    this.withdrawCompletePopupSubject.next(true);
  }

  statusChange(e) {
    switch (e.command) {
      case "withdraw":
        this.changeToWidthdraw(e.data);
        break;
      case "complete":
        this.changeToComplete(e.data);
        break;
    }
  }

  changeToWidthdraw(data) {
    if (this.currrentRequestFeedback) {
      this.currrentRequestFeedback.status = { id: 5 };
      this.currrentRequestFeedback.withdrawNote = data.withdrawComment;
      this.subscriptions.add(this.feedbackRequestService.saveRequestFeedback(this.currrentRequestFeedback).subscribe(result => {
        this.router.navigate(['/home', 'index', "Request for feedback has been withdrawn"]);
      }));
    }
  }

  changeToComplete(data) {
    if (this.currrentRequestFeedback) {
      this.currrentRequestFeedback.status = { id: 6 };
      this.currrentRequestFeedback.completedDate = data.completedDate.toDateString();
      this.subscriptions.add(this.feedbackRequestService.saveRequestFeedback(this.currrentRequestFeedback).subscribe(result => {
        this.router.navigate(['/home', 'index', "Request for feedback has been completed"]);
      }));
    }
  }

}
