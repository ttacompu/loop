import { Component, OnInit, ViewChild } from '@angular/core';
import { FeedbackRequestService } from '../services/feedbackRequestService';
import { Subscription } from 'rxjs/Subscription';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/userService';
import { Subject } from 'rxjs/Subject';
import { ReminderNotification } from '../services/reminderNotification';
import { TimeSlotService } from '../services/timeSlotService';
import * as R from 'ramda';
import { DialogWrapService } from '../../shared/dialogWrapService';
import { Store, select } from '@ngrx/store';
import * as fromHome from '../state/home.reducer';
import * as homeActions from '../state/home.action'

@Component({
  selector: 'app-home',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  subscriptions: Subscription = new Subscription();

  requestDataList = [];
  requestDataListPopUp = [];
  pendingDataList = [];
  pendingDataListPopUp = [];
  feedbackDataList = [];
  feedbackDataListPopUp = [];
  timeslotDataList = [];
  timeslotDataListPopUp = []

  openPopupSubject: Subject<any> = new Subject();
  openAckSubject: Subject<any> = new Subject();
  openResSubject: Subject<any> = new Subject();
  openAllTimeSlotSubject: Subject<any> = new Subject();
  timeSlotCommandSubject: Subject<any> = new Subject();


  constructor(private toastr: ToastrService, private route: ActivatedRoute,
    private userService: UserService, private feedbackRequestService: FeedbackRequestService,
    private reminderNotification: ReminderNotification, private timeSlotService: TimeSlotService, private dialogWrapService: DialogWrapService,
    private store: Store<fromHome.HomeState>

  ) {
  }

  ngOnInit() {
    this.toastr.overlayContainer = this.toastContainer;

    this.route.params.subscribe((params) => {
      const message = params.message;
      if (message) {
        setTimeout(() => {
          this.toastr.success(message)
        }, 0);
      }
    })

    this.subscriptions.add(this.userService.refreshIndex().subscribe((message: string) => {
      this.toastr.success(message);
    }));

    // getting request list
    this.subscriptions.add(
      this.store.pipe(select(fromHome.getRequestList)).subscribe((data) => {
        this.requestDataList = data.filter(x => !(x.status.id == 5 || x.status.id == 6)).slice(0, 4);
        this.requestDataListPopUp = data;
      })
    );

    //getting pending work list
    this.subscriptions.add(
      this.store.pipe(select(fromHome.getPendingList)).subscribe((pendingList) => {
        this.pendingDataList = pendingList.slice(0, 4);
        this.pendingDataListPopUp = pendingList;
      })
    );

    //getting other details
    this.subscriptions.add(
      this.store.pipe(select(fromHome.getfeedbackToOtherList)).subscribe((feedbackToOtherList) => {
        this.feedbackDataList = feedbackToOtherList.filter(x => !(x.status.id == 5 || x.status.id == 6)).slice(0, 4);
        this.feedbackDataListPopUp = feedbackToOtherList;
      })
    );

    //getting timeslots
    this.subscriptions.add(
      this.store.pipe(select(fromHome.getTimeSlotList)).subscribe((timeslotList) => {
        const gtComparator = R.comparator((a, b) => R.gt(R.prop("id", a), R.prop("id", b)));
        const sortedData = R.sort(gtComparator, timeslotList);
        this.timeslotDataList = sortedData.slice(0, 4);
        this.timeslotDataListPopUp = sortedData;
      })
    );

    this.init();
    this.subScribeError();
    this.subscribeMessage();
  }

  private showMessage(msg, isError = false) {
    if (isError) {
      this.toastr.error(msg);
    } else {
      this.toastr.success(msg);
    }
  }

  init() {
    this.getAllRequestDetails();
    this.getWorkListDetails();
    this.getFeedbackToOthersDetails();
    this.getAllTimeSlots();
  }

  private subScribeError() {
    this.subscriptions.add(this.store.pipe(select(fromHome.getError)).subscribe((err) => {
      if (err) {
        this.showMessage(err, true);
      }
    }))
  }

  private subscribeMessage() {
    this.subscriptions.add(this.store.pipe(select(fromHome.getMessage)).subscribe((message) => {
      if (message) {
        this.showMessage(message);
      }
    }))
  }

  getAllRequestDetails() {
    this.store.dispatch(new homeActions.RequestLoad());
  }

  getWorkListDetails() {
    this.store.dispatch(new homeActions.PendingLoad());
   

  }

  getFeedbackToOthersDetails() {
    this.store.dispatch(new homeActions.FeedbackOthersLoad());
  }

  getAllTimeSlots() {
    this.store.dispatch(new homeActions.TimeSlotsLoad());
  }

  openResponsePopup(e) {
    if (e.isResponse) {
      this.openAckPopup(e.item);
    } else {
      this.reminderNotification.getReminderSent(e.item.id).subscribe(reminderData => {
        const result = reminderData as any;
        if (result) {
          this.openResSubject.next({ isOpen: true, data: e.item, reminderData: { count: result.count, submitedDate: e.item.statusChangeDate } });
        }
      })
    }
  }

  openRequestDetails() {
    this.openPopupSubject.next({
      isOpen: true,
      dialogTitle: "Feedback Request Details",
      columnName: "contributorFullName",
      isWorkList: false,
      isFeedBackToOthers: false,
      data: this.requestDataListPopUp
    });
  }

  openWorkList() {
    this.openPopupSubject.next({
      isOpen: true,
      dialogTitle: "Pending Feedbacks",
      columnName: "contributorFullName",
      isWorkList: true,
      isFeedBackToOthers: false,
      data: this.pendingDataListPopUp
    });
  }

  openFeedbackToOthers() {
    this.openPopupSubject.next({
      isOpen: true,
      dialogTitle: "Feedback To Others Details",
      columnName: "requesterFullName",
      isWorkList: false,
      isFeedBackToOthers: true,
      data: this.feedbackDataListPopUp
    });
  }

  openAckPopup(item) {
    this.openAckSubject.next({ item, isOpen: true });
  }

  acceptRequestSending({ data }) {
    this.feedbackRequestService.saveRequestFeedback(data).subscribe(() => {
      this.init();
      this.userService.setValForRefresh(`Request for feedback has been accepted`);
    })
  }

  reminderSending({ data }) {
    this.subscriptions.add(this.reminderNotification.sentReminder(data.id).subscribe(() => {
      this.init();
      this.userService.setValForRefresh(`Email reminder has been sent`);
    }))
  }

  excuteTimeSlotCommand(e) {
    if (e.isClose) {
      this.timeSlotCommandSubject.next({ isOpen: false });
    }
    switch (e.command) {
      case "delete":
        this.deleteTimeSlot(e.data.id);
        break;
      case "new":
        this.createNewTimeSlot(e.data);
        break;
      case "edit":
        this.createNewTimeSlot(e.data, true);
        break;
    }
  }

  private createNewTimeSlot(data, isEdit = false) {
    this.store.dispatch(new homeActions.TimeSlotSave(data));
    this.refreshRequestList();
  }

  private refreshRequestList() {
    //refresh two list
    this.getAllRequestDetails();
    this.getFeedbackToOthersDetails();

  }

  private deleteTimeSlot(id) {
    const dialog = this.dialogWrapService.createDialog({ content: 'Are you sure to delete this timeslot?' });
    this.subscriptions.add(this.dialogWrapService.dialogResponse(dialog, (() => {
      this.store.dispatch(new homeActions.TimeSlotEntryDelete(id));
      this.refreshRequestList();
    }).bind(this)))
  }

  openTimeSlot() {
    this.timeSlotCommandSubject.next({ isOpen: true });
  }

  commandTimeSlot(e) {
    switch (e.command) {
      case "delete":
        this.deleteTimeSlot(e.data.id);
        break;
      case "edit":
        this.timeSlotCommandSubject.next({ isOpen: true, data: e.data, command: "edit" })
        break;
    }
  }
  openAllTimeSlots() {
    this.openAllTimeSlotSubject.next({ isOpen: true, data: this.timeslotDataListPopUp });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


}

