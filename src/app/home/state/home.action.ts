
import { Action } from '@ngrx/store';

export enum HomeActionTypes {
  LoadReqeust = '[Request] Load',
  LoadReqeustSuccess = '[Request] Load Success',
  LoadReqeustFail = '[Request] Load Fail',
  LoadPending = '[Pending List] Load',
  LoadPendingSuccess = '[Pending List] Load Success',
  LoadPendingFail = '[Pending List] Load Fail',
  LoadTimeSlots = '[TimeSlots List] Load',
  LoadTimeSlotsSuccess = '[TimeSlots List] Load Success',
  LoadTimeSlotsFail = '[TimeSlots List] Load Fail',
  LoadFeedbackOthers = '[Feedback Others List] Load',
  LoadFeedbackOthersSuccess = '[Feedback Others List] Load Success',
  LoadFeedbackOthersFail = '[Feedback Others List] Load Fail',
  DeleteTimeSlot = '[A TimeSlot entry] Delete',
  DeleteTimeSlotSuccess = '[A TimeSlot entry] Delete Success',
  DeleteTimeSlotFail = '[A TimeSlot entry] Delete Fail',
  SaveTimeSlot = '[A TimeSlot entry] Save',
  SaveTimeSlotSucess = '[A TimeSlot entry] Save Success',
  SaveTimeSlotFail = '[A TimeSlot entry] Save Fail',
  Redirect = '[Home] is redirect',
  LoadCreateRequestData = '[Create Request Data] Load',
  LoadCreateRequestDataSuccess = '[Create Request Data] Load Success',
  LoadCreateRequestDataFail = '[Create Request Data] Load Fail'
}

export class Redirect implements Action {
  readonly type = HomeActionTypes.Redirect
  constructor(public payload: any) {
  }
}

export class TimeSlotSave implements Action {
  readonly type = HomeActionTypes.SaveTimeSlot;
  constructor(public payload: any) {
  }
}
export class TimeSlotSaveSuccess implements Action {
  readonly type = HomeActionTypes.SaveTimeSlotSucess;
  payload: any = { value: null, message: '' };
  constructor(private data: any) {
    this.payload.value = data.value;
    this.payload.message = data.message;
  }
}
export class TimeSlotSaveFail implements Action {
  readonly type = HomeActionTypes.SaveTimeSlotFail;
  constructor(public payload: any) {
  }
}

export class RequestLoad implements Action {
  readonly type = HomeActionTypes.LoadReqeust;
}
export class RequestLoadSuccess implements Action {
  readonly type = HomeActionTypes.LoadReqeustSuccess;
  constructor(public payload : Array<any>) {
  }
}

export class LoadReqeustFail implements Action {
  readonly type = HomeActionTypes.LoadReqeustFail;
  constructor(public payload: any) {
  }
}

export class PendingLoad implements Action {
  readonly type = HomeActionTypes.LoadPending;
}

export class PendingLoadSuccess implements Action {
  readonly type = HomeActionTypes.LoadPendingSuccess;
  constructor(public payload: Array<any>) {
  }
}

export class PendingLoadFail implements Action {
  readonly type = HomeActionTypes.LoadPendingFail;
  constructor(public payload: any) {
  }
}

export class TimeSlotsLoad implements Action {
  readonly type = HomeActionTypes.LoadTimeSlots;
}

export class TimeSlotsLoadSuccess implements Action {
  readonly type = HomeActionTypes.LoadTimeSlotsSuccess
  constructor(public payload: Array<any>) {
  }
}

export class TimeSlotsLoadFail implements Action {
  readonly type = HomeActionTypes.LoadTimeSlotsFail;
  constructor(public payload: any) {
  }
}

export class FeedbackOthersLoad implements Action {
  readonly type = HomeActionTypes.LoadFeedbackOthers;
}

export class FeedbackOthersLoadSuccess implements Action {
  readonly type = HomeActionTypes.LoadFeedbackOthersSuccess
  constructor(public payload: Array<any>) {
  }
}

export class FeedbackOthersLoadFail implements Action {
  readonly type = HomeActionTypes.LoadFeedbackOthersFail;
  constructor(public payload: any) {
  }
}

export class TimeSlotEntryDelete implements Action {
  readonly type = HomeActionTypes.DeleteTimeSlot;
  constructor(public payload: any) {
  }
}
export class TimeSlotEntryDeleteSuccess implements Action {
  readonly type = HomeActionTypes.DeleteTimeSlotSuccess;
  constructor(public payload: any) {
  }
}
export class TimeSlotEntryDeleteFail implements Action {
  readonly type = HomeActionTypes.DeleteTimeSlotFail;
  constructor(public payload: any) {
  }
}

export class CreateRequestDataLoad implements Action {
  readonly type = HomeActionTypes.LoadCreateRequestData
}
export class CreateRequestDataLoadSuccess implements Action {
  readonly type = HomeActionTypes.LoadCreateRequestDataSuccess;
  constructor(public payload: any) {
  }
}

export class CreateRequestDataLoadFail implements Action {
  readonly type = HomeActionTypes.LoadCreateRequestDataFail;
  constructor(public payload: any) {
  }
}


export type RequestLoadActions = Redirect
  | TimeSlotSave
  | TimeSlotSaveSuccess
  | TimeSlotSaveFail
  | RequestLoad
  | RequestLoadSuccess
  | LoadReqeustFail
  | PendingLoad
  | PendingLoadSuccess
  | PendingLoadFail
  | TimeSlotsLoad
  | TimeSlotsLoadSuccess
  | TimeSlotsLoadFail
  | FeedbackOthersLoad
  | FeedbackOthersLoadSuccess
  | FeedbackOthersLoadFail
  | TimeSlotEntryDelete
  | TimeSlotEntryDeleteSuccess
  | TimeSlotEntryDeleteFail
  | CreateRequestDataLoad
  | CreateRequestDataLoadSuccess
  | CreateRequestDataLoadFail
