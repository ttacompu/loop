import { Injectable } from '@angular/core'
import { merge } from 'rxjs/observable/merge';
import { map } from 'rxjs/operators';
import { pipe } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { FormBuilder, AbstractControl } from '@angular/forms';
import * as R from 'ramda';
import { FormGroup } from '@angular/forms/src/model';
import { of } from 'rxjs/observable/of';
import { TimeSlotService } from '../home/services/timeSlotService';

@Injectable()
export class ValidationRuleService {

  private validationMessagesPerPage = {};
  private validationRules = {};

  constructor(private fb: FormBuilder, private timeSlotService : TimeSlotService) {

  }

  SetValidationsMessages(messages) {
    this.validationMessagesPerPage = {
      ...this.validationMessagesPerPage,
      ...messages
    }
  }

  SetValidationRules(rules) {
    this.validationRules = {
      ...this.validationRules,
      ...rules
    }
  }

  GetValidationRules(pageKey) {
    if (this.validationRules.hasOwnProperty(pageKey)) {
      return this.validationRules[pageKey];
    }
  }


  GetValidationMessages(pageKey) {
    if (this.validationMessagesPerPage.hasOwnProperty(pageKey)) {
      return this.validationMessagesPerPage[pageKey];
    }
  }

  Validate(form, pageKey, validateFn, dirtyKeys= []) {
    const rules = this.GetValidationMessages(pageKey);
    return validateFn(form, rules, dirtyKeys);
  }

  SetValidationRuleOnForm(pageKey) {
    const model = this.GetValidationRules(pageKey);
    return this.fb.group(model);
  }

  disalbeAllControls(feedForm, command, exceptions = []) {
    for (let key in feedForm.controls) {
      if (!exceptions.includes(key)) {
        feedForm.controls[key][command]();
      }
    }
  }

  ExecuteValidationRules(form, rules, dirtyKeys = []) {
    let mergeSubject = new Subject();

    Object.keys(rules).forEach((fieldName, index) => {
      const ctrl = form.get(fieldName);
      ctrl.statusChanges.subscribe(() => {
        let errorMessage = "";
        if (ctrl.errors) {
          const errorKey = Object.keys(ctrl.errors)[0];
          if (dirtyKeys.findIndex(key => key == "timeSlotTaken") > -1 ) {
            errorMessage = Object.keys(ctrl.errors).map(errorKey => rules[fieldName][errorKey]).join(' ');
            mergeSubject.next({ [fieldName]: errorMessage });

          } else if (ctrl.touched || ctrl.dirty) {
            errorMessage = Object.keys(ctrl.errors).map(errorKey => rules[fieldName][errorKey]).join(' ');
            mergeSubject.next({ [fieldName]: errorMessage });
          }

        } else {
          mergeSubject.next({ [fieldName]: "" });
        }

      })
    })
    return mergeSubject.asObservable();
  }

  RemoveValidators(FeedForm, exceptionFn = (key) => true) {
    for (let key in FeedForm.controls) {
      if (FeedForm.controls.hasOwnProperty(key) && exceptionFn(key)) {
        FeedForm.controls[key].clearAsyncValidators();
        FeedForm.controls[key].clearValidators();
        FeedForm.controls[key].updateValueAndValidity();
      }
    }
  }

  AddValidators(feedForm: FormGroup, rules, customValidatorList: any[]) {
    const customNames = R.keys(customValidatorList);
    for (let key in feedForm.controls) {
      if (!(customNames.indexOf(key) > -1)) {
        const syncValidators = rules[key][1];
        const asyncValidators = rules[key][2];
        if (asyncValidators && asyncValidators.length) {
          feedForm.controls[key].setAsyncValidators(asyncValidators);
          feedForm.controls[key].updateValueAndValidity();
        }
        if (syncValidators && syncValidators.length) {
          feedForm.controls[key].setValidators(syncValidators);
          feedForm.controls[key].updateValueAndValidity();
        }
      }
    }
    // set custom validator
    customValidatorList.forEach((item, i) => {
      feedForm.controls[item.key].setValidators(item.fn);
      feedForm.controls[item.key].updateValueAndValidity();
    })
  }

  numberMaxLength(control: AbstractControl) {
    const val = `${control.value}`;
    if (val && val.length > 9) {
      return { numberMaxLength: true };
    }
    return null;
  }

  timeSlotTaken({ isEdit, isDraft}) {
    return (control: AbstractControl) => {

      if (!control.value) {
        return of(null);
      }
      if (!isEdit) {
        return of(null)
      } else {
        if (isDraft) {
          // todo : need ajax call to confirm timeslot is taken
          return this.timeSlotService.isTimeSlotAvailable(control.value).toPromise().then((isAvailable) => {
            if (isAvailable) {
              return null;
            }
            return { timeSlotTaken: true }
          })
        }
        return of(null)
      }
    }
  }
   
  
}
