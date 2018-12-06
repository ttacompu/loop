import * as fromRoot from '../../state/app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RequestLoadActions, HomeActionTypes } from './home.action';
import { Feedback } from '../../models/Feedback';

export interface HomeState extends fromRoot.State {
  requestList: Array<any>
  currentRequestId: number,
  pendingList: Array<any>,
  timeslotList: Array<any>,
  feedbackToOtherList: Array<any>,
  createRequestData : any,
  error: string;
  message: string;
}

const initHomeState: HomeState = {
  requestList: [],
  currentRequestId : 0,
  pendingList: [],
  timeslotList: [],
  feedbackToOtherList: [],
  createRequestData : null,
  error: '',
  message : ''
}

export const getHomeFeatureState = createFeatureSelector<HomeState>('home');
export const getRequestList = createSelector(getHomeFeatureState, state => state.requestList);
export const getPendingList = createSelector(getHomeFeatureState, state => state.pendingList);
export const getTimeSlotList = createSelector(getHomeFeatureState, state => state.timeslotList);
export const getfeedbackToOtherList = createSelector(getHomeFeatureState, state => state.feedbackToOtherList);
export const getCurrentRequestFeedback = createSelector(getHomeFeatureState, state => state.requestList.find(x => x.id == state.currentRequestId));

export const getCreateRequestData = createSelector(getHomeFeatureState, state => state.createRequestData);
export const getError = createSelector(getHomeFeatureState, state => state.error)
export const getMessage = createSelector(getHomeFeatureState, state => state.message)


export function reducer(state: HomeState = initHomeState, action: RequestLoadActions ): HomeState {
   
  switch (action.type) {
    case HomeActionTypes.LoadCreateRequestDataSuccess:
      return {
        ...state,
        createRequestData: action.payload,
        error: '',
        message: ''
      }
    case HomeActionTypes.LoadReqeustSuccess:
      return {
        ...state,
        requestList: action.payload,
        error: '',
        message : ''
      }
    case HomeActionTypes.LoadPendingSuccess:
      return {
        ...state,
        pendingList: action.payload,
        error: '',
        message: ''
      }
    case HomeActionTypes.LoadTimeSlotsSuccess:
      return {
        ...state,
        timeslotList: action.payload,
        error: '',
        message: ''
      }
    case HomeActionTypes.SaveTimeSlotSucess:
      let resultTimeSlots;
      if (action.payload.value.isNewSave) {
        resultTimeSlots = [...state.timeslotList, action.payload.value ]
      } else {
        resultTimeSlots = [...state.timeslotList.filter(x => x.id !== action.payload.value.id), action.payload.value]
      }
      return {
        ...state,
        timeslotList: resultTimeSlots,
        error: '',
        message: action.payload.message
      }

    case HomeActionTypes.LoadFeedbackOthersSuccess:
      return {
        ...state,
        feedbackToOtherList: action.payload,
        error: '',
        message: ''
      }
    case HomeActionTypes.DeleteTimeSlotSuccess:
      return {
        ...state,
        timeslotList: state.timeslotList.filter(x => x.id !== action.payload),
        error: '',
        message: 'Time slot has been deleted'
      }

    case HomeActionTypes.LoadReqeustFail, HomeActionTypes.LoadPendingFail,
      HomeActionTypes.LoadFeedbackOthersFail, HomeActionTypes.LoadTimeSlotsFail,
      HomeActionTypes.LoadCreateRequestDataFail,
      HomeActionTypes.DeleteTimeSlotFail:
      return {
        ...state,
        requestList: [],
        pendingList: [],
        timeslotList: [],
        error: action.payload,
        message : ''
      }

    case HomeActionTypes.Redirect:
      return {
        ...state,
        currentRequestId: action.payload,
        error: '',
        message: ''
      };

    default:
      return state;
  }
}
