import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FeedbackRequestService } from '../services/feedbackRequestService';
import { Subject } from 'rxjs/Subject';
import { IManageLibrary } from '../../models/IManageLibrary';
import { FeedbackNote } from '../../models/FeedbackNote';
import { UserService } from '../../core/services/userService';
import { ValidationRuleService } from '../../shared/validationRuleService';
import { Location, DatePipe } from '@angular/common';
import { FeedbackNoteService } from '../services/feedbackNoteService';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import {  DialogRef, DialogCloseResult } from '@progress/kendo-angular-dialog';
import { DialogWrapService } from '../../shared/dialogWrapService'
import { DomSanitizer } from '@angular/platform-browser';

import { Store, select } from '@ngrx/store';
import * as fromHome from '../state/home.reducer';
import * as homeActions from '../state/home.action'

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.css']
})
export class EditRequestComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  @ViewChild('myBackBttn') myBackBttn: ElementRef; 
  editRequestFormGroup: FormGroup;
  pageKey = "editRequestForm";
  subscriptions: Subscription = new Subscription();
  currentRequest: any = Object;
  tempCurrentRequest: any = null;
  columnName = "Note";
  openPopupSubject: Subject<boolean> = new Subject();
  openAckSubject: Subject<any> = new Subject();
  popupTitle = "Add";
  currentNote: FeedbackNote = new FeedbackNote();
  notesCount: number = 0;
  userClearyKey: string = "";
  userRoleName: string = "";
  requestContributorClearyKey: string = "";
  currentStatusName: string = "";
  currentStatusId: number = 3;
  iManageDocUrl: string = "";
  errorMessages = {
    isAllowPDViewNotes: ""
  };

  dilogResult: any;

  openResSubject: Subject<any> = new Subject();
  isResonposeButtonShow = false;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    public userService: UserService,
    private toastr: ToastrService,
    private feedbackNoteService: FeedbackNoteService,
    private validationRuleService: ValidationRuleService,
    private feedbackRequestService: FeedbackRequestService,
    private dialogWrapService: DialogWrapService,
    private store: Store<fromHome.HomeState>) {

  }

  ngOnInit() {
    this.toastr.overlayContainer = this.toastContainer;
    //Get logon user cleary key
    this.userService.getClearyKey().then(key => {
      this.userClearyKey = key;
    })

    //Get logon user Role
    this.userService.getUserRoles().then(roles => {
      roles.forEach(role => {
        this.userRoleName = role.name;
      });
    })

    //this.editRequestFormGroup = new FormGroup({});
    this.validationRuleService.SetValidationRules({
      [this.pageKey]: {
        status: [''],
        requesterFullName: [''],
        isAllowPDViewNotes: [''],
        statusChangeDate: [''],
        relatedMatterNumber: [''],
        detailsRequest : ['']
      }
    });
    this.editRequestFormGroup = this.validationRuleService.SetValidationRuleOnForm(this.pageKey);
    
    this.userService.getClearyKey().then(key => {
      this.userClearyKey = key;
      this.subscriptions.add(this.route.params.subscribe((params) => {
        const id = +params.id;
        if (id) {
          this.feedbackRequestService.getRequestFeedbackByIdForContributor(id, this.userClearyKey, this.userRoleName).subscribe(data => {
            this.currentRequest = data;
            this.currentStatusId = this.currentRequest.status.id;
            if (this.currentStatusId == 2) {
              this.isResonposeButtonShow = true;
            }
            this.requestContributorClearyKey = this.currentRequest.contributorClearyKey;
            this.iManageDocUrl = this.currentRequest.iManageDocUrl;
            this.currentStatusName = this.currentRequest.status.name;

            if (this.currentRequest.notes.length > 0) {
              this.notesCount = this.currentRequest.notes.length;
            }
            this.editRequestFormGroup.setValue({
              isAllowPDViewNotes: this.currentRequest.isSharedWithProfDevelopment,
              status: this.currentRequest.status.name,
              requesterFullName: this.currentRequest.requesterFullName,
              statusChangeDate: this.datePipe.transform(this.currentRequest.statusChangeDate, 'dd-MMM-yyyy hh:mm a'),
              relatedMatterNumber: this.currentRequest.clientMatterNumber,
              detailsRequest: this.currentRequest.requestDetails
            });
          })

          this.validationRuleService.disalbeAllControls(this.editRequestFormGroup, "disable", ["isAllowPDViewNotes"]);
        }
      }))

    })
  }

  openNoteAddPopupWindow(e) {
    e.preventDefault();    
    this.popupTitle = "Add";
    this.currentNote.popupViewType = "Add";
    this.currentNote.feedbackRequestId = this.currentRequest.id;
    this.currentNote.isSharedWithProfDevelopment = this.currentRequest.isSharedWithProfDevelopment;
    this.currentNote.id = 0;
    this.currentNote.title = "";
    this.currentNote.details = "";
    this.currentNote.iManageDocNumber = "";
    this.currentNote.iManageLibrary = { id: 1, name: "AMERICAWORK"};
    this.currentNote.CreatedBy = this.userClearyKey;
    this.currentNote.CreatedOn = this.currentRequest.createdOn;
    this.openPopupSubject.next(true);
    //Work around for showing parent backgroud when dialog win opens
    setTimeout(() => {
      this.myBackBttn.nativeElement.focus();
    }, 1);
  }

  openNoteEditPopupWindow(e, note) {
    e.preventDefault();   
    this.popupTitle = "Edit";
    this.currentNote.popupViewType = "Edit";
    this.currentNote.feedbackRequestId = this.currentRequest.id;
    this.currentNote.isSharedWithProfDevelopment = this.currentRequest.isSharedWithProfDevelopment;
    this.currentNote.id = note.id;
    this.currentNote.title = note.title;
    this.currentNote.details = note.details;
    this.currentNote.iManageDocNumber = note.iManageDocNumber;
    this.currentNote.iManageLibrary = note.iManageLibrary;
    this.currentNote.CreatedBy = note.createdBy;
    this.currentNote.CreatedOn = note.createdOn;    
    this.openPopupSubject.next(true);
    //Work around for showing parent backgroud when dialog win opens
    setTimeout(() => {
      this.myBackBttn.nativeElement.focus();
    }, 1);
  }

  openNoteViewPopupWindow(e, note) {
    e.preventDefault();
    this.popupTitle = "View";
    this.currentNote.popupViewType = "View";
    this.currentNote.feedbackRequestId = this.currentRequest.id;
    this.currentNote.isSharedWithProfDevelopment = this.currentRequest.isSharedWithProfDevelopment;
    this.currentNote.id = note.id;
    this.currentNote.title = note.title;
    this.currentNote.details = note.details;
    this.currentNote.iManageDocNumber = note.iManageDocNumber;
    this.currentNote.iManageLibrary = note.iManageLibrary;
    this.currentNote.iManageDocUrl = note.iManageDocUrl;
    this.currentNote.CreatedBy = note.createdBy;
    this.currentNote.CreatedOn = note.createdOn;
    this.openPopupSubject.next(true);
    //Work around for showing parent backgroud when dialog win opens
    setTimeout(() => {
      this.myBackBttn.nativeElement.focus();
    }, 1);
  }

  deleteNote(e, id: number, feedbackId: number) {
    e.preventDefault();
    //Open Dialog Window
    const dialog: DialogRef = this.dialogWrapService.createDialog({ content: 'Are you sure to delete Note?' })
    //Call back from Dialog Window
    this.subscriptions.add(this.dialogWrapService.dialogResponse(dialog, (() => {
      this.subscriptions.add(this.feedbackNoteService.deleteFeedbackNote(id).subscribe(() => {
        this.toastr.success('Note Deleted Successfully!');
        //alert("Note Deleted Successfully!");
        this.reloadCurrentRequest(feedbackId);
      }, (err) => {
        this.toastr.error('Unable to Deleted Note.');
        //alert("Unable to Deleted Note.");
      }))

    }).bind(this)));
  }

  //Called from popup windows
  ReloadFeedbackRequest(param) {
    //alert(id);
    if (param.isSuccess == true) {
      this.reloadCurrentRequest(param.feedbackRequestId);
      this.toastr.success(param.message);
    }
    else {
      this.toastr.success(param.message);
    }    
  }

  reloadCurrentRequest(id) {
    if (id) {
      this.feedbackRequestService.getRequestFeedbackByIdForContributor(id, this.userClearyKey, this.userRoleName).subscribe(data => {
        this.currentRequest = data;
        if (this.currentRequest.notes.length > 0) {
          this.notesCount = this.currentRequest.notes.length;
        }
      })
    }
  }

  allowPDcheckboxChanged(id) {
    const formValResult = this.editRequestFormGroup.value;
    
    const dialog: DialogRef = this.dialogWrapService.createDialog({
      content: (formValResult.isAllowPDViewNotes) ? "Are you sure want to allow Professional Development team to view my notes?" :
        "Are you sure want to disallow Professional Development team to view my notes?"
    });

    //if not bind this, we can't use this pointer
    this.subscriptions.add(this.dialogWrapService.dialogResponse(dialog, (() => {
      (formValResult.isAllowPDViewNotes) ? this.updateIsSharedWithFlag(id, true) : this.updateIsSharedWithFlag(id, false)
    }).bind(this), (() => {
        (formValResult.isAllowPDViewNotes) ? this.editRequestFormGroup.patchValue({ isAllowPDViewNotes: false }) : this.editRequestFormGroup.patchValue({ isAllowPDViewNotes: true })
      }).bind(this), (() => {
        (formValResult.isAllowPDViewNotes) ? this.editRequestFormGroup.patchValue({ isAllowPDViewNotes: false }) : this.editRequestFormGroup.patchValue({ isAllowPDViewNotes: true })
      }).bind(this)))
    
  }

  updateIsSharedWithFlag(id, isPdAllow) {
    if (id) {
      let paramsObj = {
        feedbackRequestId: id,
        isSharedWithProfDevelopment: isPdAllow,
        user: this.userClearyKey
      }
      this.feedbackRequestService.updateIsSharedWith(paramsObj).subscribe(data => {
        this.currentRequest = data;
        if (isPdAllow == true) {
          this.toastr.success('Notes for this feedback session will be shared with Professional Development team.');
        }
        if (isPdAllow == false) {
          this.toastr.success('Notes for this feedback session will not be shared with Professional Development team.');
        }
        //alert("Is Shared With Prof Development updated Successfully!");
      }, (err) => {
        this.toastr.error('Unable to Update Is Shared With Prof Development Flag.');
        //alert("Unable to Update Is Shared With Prof Development Flag.");
      })      
    }
  }

  public SafeHtmlContent(content: string) {
    let hcontent: string = content;
    if (this.IsEmptyOrNull(content) == false) {
      hcontent = content.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
    return this.sanitizer.bypassSecurityTrustHtml(hcontent);
  }

  public IsEmptyOrNull(value: string): Boolean {
    if (typeof value != 'undefined' && value) {
      return false;
    }
    return true;
  }

  GoBack(event) {
    this.router.navigate(['/home', 'index']);
    //this.location.back();
  }

  response(e) {
    e.preventDefault();
    this.openAckSubject.next({ isOpen: true, item: this.currentRequest, isRedirect: true })
    
  }

  // navigate to index after changing accept status
  acceptRequestSending({ data }) {
    this.feedbackRequestService.saveRequestFeedback(data).subscribe(() => {
      this.router.navigate(['/home', 'index', `Request for feedback has been accepted`]);
    })
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
