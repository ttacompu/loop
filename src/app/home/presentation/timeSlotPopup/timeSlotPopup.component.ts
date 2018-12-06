import { OnInit, Component, Input, Output,  EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators, } from "@angular/forms";
import { ValidationRuleService } from "../../../shared/validationRuleService";
import { Subject, Subscription } from "rxjs";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";


@Component({
  selector: 'cgsh-timeslot-popup',
  templateUrl: './timeSlotPopup.component.html',
  styleUrls: ['./timeSlotPopup.component.css']
})
export class timeSlotPopupComponent implements OnInit {
  
  isOpen = false;
  timeSlotForm: FormGroup;
  pageKey = "timeSlotForm";
  subscriptions = new Subscription();

  @Input()
  command: Subject<any>;

  @Output()
  sendCommandParent = new EventEmitter();

  errorMessages = {
    availableDate: "",
    fromTime: "",
    toTime : ""
  };

  isNew = false;
  currentTimeSlot;

  constructor(private fb: FormBuilder, private router: Router,
    private validationRuleService: ValidationRuleService,   private datePipe: DatePipe) {

  }

  private loadForm(data) {
    this.timeSlotForm.markAsDirty();
    this.timeSlotForm.patchValue({
      availableDate: new Date(data.fromDate),
      fromTime: new Date(data.fromDate),
      toTime: new Date(data.toDate)
    });
  }

  ngOnInit() {

    this.subscriptions.add(this.command.subscribe(e => {
      this.isOpen = e.isOpen;
      this.isNew = (e.data) ? false : true;
      if (e.command === "edit") {
        this.currentTimeSlot = e.data;
        this.loadForm(e.data);
      } else if (e.command === "delete") {
        // send signal to parent
        this.sendCommandParent.emit({command : "delete", data : e.data });
      }
      if (e.isOpen) {
        setTimeout(() => {
          window.focus();
        }, 10)
      }
      if (this.isNew) {
        this.setDefaultTime();
      }

    }))
    
    this.validationRuleService.SetValidationRules({
      [this.pageKey]: {
        availableDate: ['', Validators.required],
        fromTime: [this.getDefaultTime().defaultFromTime , Validators.required],
        toTime: [this.getDefaultTime().defaultToTime, Validators.required]
      }
    });

    this.timeSlotForm = this.validationRuleService.SetValidationRuleOnForm(this.pageKey);

    this.validationRuleService.SetValidationsMessages({
      [this.pageKey]: {
        availableDate: {
          required: "Date required!"
        },
        fromTime: {
          required: "From time required!"
        },

        toTime: {
          required: "To time required!"
        }

      }
    })

    this.subscriptions.add(this.validationRuleService.Validate(this.timeSlotForm, this.pageKey, this.validationRuleService.ExecuteValidationRules.bind(this))
      .subscribe((messages) => {
        this.errorMessages = { ...this.errorMessages, ...messages };
      }));
  }

  private setDefaultTime() {
    const defaultTime = this.getDefaultTime();
    this.timeSlotForm.patchValue({
      fromTime: defaultTime.defaultFromTime,
      toTime: defaultTime.defaultToTime
    });
  }

  private getDefaultTime() {
    const current = new Date();
    const defaultFromTime = new Date(current.getFullYear(), current.getMonth(), current.getDate(), 9, 0);
    const defaultToTime = new Date(current.getFullYear(), current.getMonth(), current.getDate(), 9, 15);
    return { defaultFromTime, defaultToTime };

  }

  saveClose(e) {
    e.preventDefault();
    this.save(true);
  }

  saveOpen(e) {
    e.preventDefault();
    this.save(false);
    this.timeSlotForm.reset();
    this.setDefaultTime();
  }

  private save(isClose) {
    //prepare data and send it to parent
    const timeSlotVal = this.timeSlotForm.value;
    let fromDateTime = new Date(this.datePipe.transform(timeSlotVal.availableDate, 'dd MMM yyyy'));
    let toDateTime = new Date(this.datePipe.transform(timeSlotVal.availableDate, 'dd MMM yyyy'));

    fromDateTime.setHours(new Date(timeSlotVal.fromTime).getHours());
    fromDateTime.setMinutes(new Date(timeSlotVal.fromTime).getMinutes());

    toDateTime.setHours(new Date(timeSlotVal.toTime).getHours());
    toDateTime.setMinutes(new Date(timeSlotVal.toTime).getMinutes());

    if (this.isNew) {
      this.sendCommandParent.emit({ command: "new", data: { fromDate: fromDateTime, toDate: toDateTime, id: 0 }, isClose: isClose });
      this.timeSlotForm.reset();
    } else {
      this.sendCommandParent.emit({ command: "edit", data: { fromDate: fromDateTime, toDate: toDateTime, id: this.currentTimeSlot.id }, isClose: isClose });
      this.timeSlotForm.reset();
    }

  }

  cancel(e) {
    e.preventDefault();
    this.close();
  }

  private close() {
    this.timeSlotForm.reset();
    this.isOpen = false;
  }

  timeSlotFormClose() {
    this.close()
  }

  fromChange() {
    const addMinutes = this.timeSlotForm.value.fromTime.getTime() + (15 * 60 * 1000);
    this.timeSlotForm.patchValue({ toTime: new Date(addMinutes)})
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
