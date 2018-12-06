import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from '@ngrx/effects'
import { FeedbackRequestService } from "../services/feedbackRequestService";
import * as homeActions from './home.action';
import { mergeMap, map, catchError, tap } from "rxjs/operators";
import { LoadReqeustFail, PendingLoadFail, TimeSlotsLoadFail, FeedbackOthersLoadFail, TimeSlotEntryDeleteFail, HomeActionTypes, CreateRequestDataLoadFail } from "./home.action";
import { of, forkJoin } from "rxjs";
import { TimeSlotService } from "../services/timeSlotService";


@Injectable()
export class HomeEffects {
  constructor(private actions$: Actions, private feedbackRequestService: FeedbackRequestService, private timeslotService: TimeSlotService) {
  }

  @Effect()
  loadRequest$ = this.actions$.pipe(ofType(homeActions.HomeActionTypes.LoadReqeust), mergeMap((action: homeActions.RequestLoad) => this.feedbackRequestService.getRequestFeedbackWithoutClearyKey().pipe(
    map((requestList: Array<any>) => (new homeActions.RequestLoadSuccess(requestList))),
    catchError(err => of(new LoadReqeustFail('network error for loading request list!')))
  )))

  @Effect()
  loadPending$ = this.actions$.pipe(ofType(homeActions.HomeActionTypes.LoadPending), mergeMap((action: homeActions.PendingLoad) => this.feedbackRequestService.getPendingListWithoutClearyKey().pipe(
    map((pendingList: Array<any>) => (new homeActions.PendingLoadSuccess(pendingList))),
    catchError(err => of(new PendingLoadFail('network error for loading pending list!')))
  )))

  @Effect()
  loadTimeSlots$ = this.actions$.pipe(ofType(homeActions.HomeActionTypes.LoadTimeSlots), mergeMap((action: homeActions.TimeSlotsLoad) => this.timeslotService.getAllAvailabeTimeSlotAndDesignatedClearyKey().pipe(
    map((timeSlotsList: Array<any>) => (new homeActions.TimeSlotsLoadSuccess(timeSlotsList))),
    catchError(err => of(new TimeSlotsLoadFail('network error for loading timeslots list!')))
  )))

  @Effect()
  saveTimeSlot$ = this.actions$.pipe(ofType(homeActions.HomeActionTypes.SaveTimeSlot), mergeMap((action: homeActions.TimeSlotSave) => this.timeslotService.saveTimeSlotWithoutClearyKey(action.payload).pipe(
      map((timeSlot: any) => {
        if (timeSlot.isNewSave) {
          return new homeActions.TimeSlotSaveSuccess({ value: timeSlot, message: "Time slot has been created" })
        } else {
          return new homeActions.TimeSlotSaveSuccess({ value: timeSlot, message: "Time slot has been updated" })
        }
    }),
    catchError(err => of(new TimeSlotsLoadFail('network error for saving a timeslot!')))
  )))

  @Effect()
  feedbackToOthers$ = this.actions$.pipe(ofType(homeActions.HomeActionTypes.LoadFeedbackOthers), mergeMap((action: homeActions.FeedbackOthersLoad) => this.feedbackRequestService.getAllFeedbacksToOtherWithoutClearyKey().pipe(
    map((timeSlotsList: Array<any>) => (new homeActions.FeedbackOthersLoadSuccess(timeSlotsList))),
    catchError(err => of(new FeedbackOthersLoadFail('network error for loading feedback to other list!')))
  )))

  @Effect()
  deleteTimeslot$ = this.actions$.pipe(ofType(homeActions.HomeActionTypes.DeleteTimeSlot), mergeMap((action: homeActions.TimeSlotEntryDelete) => {
    return this.timeslotService.deleteTimeSlot(action.payload).pipe(
      map((deletedEntry: any) => (new homeActions.TimeSlotEntryDeleteSuccess(deletedEntry))),
      catchError(err => of(new TimeSlotEntryDeleteFail('network error for deleting timeslot!')))
    )
  }))

  @Effect()
  createRequestData$ = this.actions$.pipe(ofType(homeActions.HomeActionTypes.LoadCreateRequestData), mergeMap((action: homeActions.CreateRequestDataLoad) => {
      return forkJoin(this.feedbackRequestService.getAllLayers(), this.feedbackRequestService.getAllLibs()).pipe(map(results => {
        return new homeActions.CreateRequestDataLoadSuccess({ lawyers: results[0], iManageLibs: results[1] })
      }),
        catchError(err => of(new CreateRequestDataLoadFail('network error for loading create request data')))
      )
  }))
}
