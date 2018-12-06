import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { ValidationRuleService } from '../../../shared/validationRuleService';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FeedbackRequestService } from '../../services/feedbackRequestService';
import { ObservableBusinessService } from '../../../core/services/observableBusiness.service';
import { FeedbackNoteService } from '../../services/feedbackNoteService';
import { DomSanitizer } from '@angular/platform-browser';

//import { IManageLibrary } from '../../../models/IManageLibrary';
//import { FeedbackNote } from '../../../models/FeedbackNote';

@Component({
  selector: 'cgsh-notepopup',
  templateUrl: './notePopup.component.html',
  styleUrls: ['./notePopup.component.css']
})

export class NotePopupComponent implements OnInit {
  createNoteForm: FormGroup;
  viewNoteForm: FormGroup;
  pageKey = "createNote";
  viewPageKey = "viewNote";
  libList = [];
  viewType: string = "View";
  

  @Input()
  popup: Subject<boolean>;

  @Input()
  data;

  @Input()
  dialogType;

  @Input()
  columnName;

  @Output()
  ReloadNotesList = new EventEmitter<{ feedbackRequestId: number, isSuccess: boolean, message:string }>();

  subscriptions: Subscription = new Subscription();
  errorMessages = {
    title: "",
    details: ""
  };

  isOpen = false;
  dialogTitle: string = "Add New Note";  

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder, private router: Router,
    private feedbackRequestService: FeedbackRequestService,
    private sanitizer: DomSanitizer,
    private feedbackNoteService: FeedbackNoteService,
    private observableBusinessService: ObservableBusinessService,
    private validationRuleService: ValidationRuleService) {
  }

  ngOnInit() {    
    this.subscriptions.add(this.popup.subscribe(
      (isOpen) => {
        this.isOpen = isOpen;
        this.LoadForm();
      })
    );

    this.validationRuleService.SetValidationRules({
      [this.pageKey]: {
        title: ['', Validators.required],
        details: ['', Validators.required],
        iManageDocNumber: ['', this.validationRuleService.numberMaxLength.bind(this)],
        iManageServer: [1]
      }
    });

    this.validationRuleService.SetValidationRules({
      [this.viewPageKey]: {
        title: [''],
        details: [''],
        iManageDocNumber: [''],
        iManageServer: [1],
        iManageServerName: ['AMERICAWORK'],
        iManageDocUrl:[""]
      }
    });

    this.viewNoteForm = this.validationRuleService.SetValidationRuleOnForm(this.viewPageKey);
    

    this.createNoteForm = this.validationRuleService.SetValidationRuleOnForm(this.pageKey);

    this.validationRuleService.SetValidationsMessages({
      [this.pageKey]: {
        title: {
          required: "Please type note subject"
        },
        details: {
          required: "Please type note details"
        },
        iManageDocNumber: {
          numberMaxLength: "cannot accept more than 9 number"
        }
      }
    })

    this.subscriptions.add(this.validationRuleService.Validate(this.createNoteForm, this.pageKey, this.validationRuleService.ExecuteValidationRules.bind(this))
      .subscribe((messages) => {
        this.errorMessages = { ...this.errorMessages, ...messages };
      }));

    this.validationRuleService.disalbeAllControls(this.viewNoteForm, "disable", []);

    this.bindiManageLibraries();
    //this.LoadForm();
  }

  ReloadParentNotesList(id, isSuccess, msg) {
    //this.ReloadNotesList.emit(id);
    let paramObj = {
      feedbackRequestId: id,
      isSuccess: isSuccess,
      message: msg
    }

    this.ReloadNotesList.emit(paramObj);
  }

  LoadForm() {
    if (JSON.stringify(this.data) != '{}') {
      if (this.data.id == 0) {
        this.dialogTitle = "Add Note";
        this.viewType = "Add";
        this.createNoteForm.setValue({
          title: "",
          details: "",
          iManageDocNumber: "",
          iManageServer: this.data.iManageLibrary.id
        });
      }
      if (this.data.id > 0) {
        if (this.data.popupViewType == "Edit") {
          this.dialogTitle = "Edit Note";
          this.viewType = "Edit";
          this.createNoteForm.setValue({
            title: this.data.title,
            details: this.data.details,
            iManageDocNumber: this.data.iManageDocNumber,
            iManageServer: this.data.iManageLibrary.id
          });
        }
        if (this.data.popupViewType == "View") {
          this.dialogTitle = "View Note";
          this.viewType = "View";
          this.viewNoteForm.setValue({
            title: this.data.title,
            details: this.data.details,
            iManageDocNumber: this.data.iManageDocNumber,
            iManageServer: this.data.iManageLibrary.id,
            iManageServerName: this.data.iManageLibrary.name,
            iManageDocUrl: this.data.iManageDocUrl
          });
        }
      }

    }
    else {
      this.createNoteForm.setValue({
        title: "",
        details: "",
        iManageDocNumber: "",
        iManageServer: 1
      });
    }
  }

  bindiManageLibraries() {
    this.subscriptions.add(this.feedbackRequestService.getAllLibs().subscribe(data => {
      this.libList = data;
    }))
  }

  NoteFormSave() {
    const formValResult = this.createNoteForm.value;    
    let noteResultObj = {
      id: this.data.id,
      feedbackRequestId: this.data.feedbackRequestId,
      title: formValResult.title,
      details: formValResult.details,
      iManageDocNumber: formValResult.iManageDocNumber,
      iManageLibrary: { id: formValResult.iManageServer, name: "" },
      CreatedOn: this.data.CreatedOn,
      CreatedBy: this.data.CreatedBy
    };

    this.subscriptions.add(this.feedbackNoteService.saveFeedbackNote(noteResultObj).subscribe(() => {
      if (this.data.id == 0) {
        //this.toastr.success('Note Created Successfully!');
        //alert("Note Created Successfully!");
        this.ReloadParentNotesList(this.data.feedbackRequestId, true, "New note has been added.");
      } else {
        //this.toastr.success('Category Updated Successfully!');
        //alert("Note Updated Successfully!");
        this.ReloadParentNotesList(this.data.feedbackRequestId, true, "Note has been updated.");
      }
    }, (err) => {
      //this.toastr.error('Unable to Update Note.');
      //alert("Unable to Update Note.");
      this.ReloadParentNotesList(this.data.feedbackRequestId, false, "Unable to update Note.");
    }))

    this.notePopupWindowClose();
  }

  cancel(event) {
    //Rest form
    this.notePopupWindowClose();
  }

  notePopupWindowClose() {
    this.isOpen = false;
    this.createNoteForm.setValue({
      title: "",
      details: "",
      iManageDocNumber: "",
      iManageServer: 1
    });   
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
