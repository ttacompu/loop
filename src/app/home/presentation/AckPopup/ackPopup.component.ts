import { OnInit, Component, Input, Output, EventEmitter } from "@angular/core";
import { Subscription, Subject } from "rxjs";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ValidationRuleService } from "../../../shared/validationRuleService";

@Component({
  selector: 'cgsh-ack-popup',
  templateUrl: './ackPopup.component.html',
  styleUrls: ['./ackPopup.component.css']
})
export class AckPopupComponent implements OnInit {

  isOpen = false;
  ackForm: FormGroup;
  pageKey = "ackPopup";

  subscriptions: Subscription = new Subscription();

  @Input()
  popup: Subject<any>;

  @Output()
  acceptRequestSent = new EventEmitter();

  data;

  constructor(private fb: FormBuilder, private validationRuleService: ValidationRuleService) {
  }

  ackClose() {
    this.isOpen = false;
  }

  ngOnInit() {
    this.validationRuleService.SetValidationRules({
      [this.pageKey]: {
        acceptComment: [''],
      }
    });
    this.ackForm = this.validationRuleService.SetValidationRuleOnForm(this.pageKey);

    this.subscriptions.add(this.popup.subscribe((e: any) => {
      this.data = e.item;
      this.isOpen = e.isOpen;
     
      this.reset();
      this.windowFocus();
    }))

  }

  private windowFocus() {
    setTimeout(() => {
      window.focus();
    }, 10)
  }

  cancelRequest(e) {
    e.preventDefault();
    this.isOpen = false;
    this.reset();
  }

  acceptRequest(e) {
   e.preventDefault();
   this.isOpen = false;
    const data = this.statusChange();
    this.acceptRequestSent.next({ data})
  }

  private statusChange() {
    const formResult = this.ackForm.value;
    let data = this.data;
    data.status = { id: 3 };
    data.responseNote = formResult.acceptComment || "";
    return data;
  }

  private reset() {
    this.ackForm.patchValue({
      acceptComment: "",
    })
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
