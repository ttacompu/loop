import { NgModule } from '@angular/core';
import { RouterModule, CanActivate } from '@angular/router';
import { SharedModule } from '../shared/shared.module'
import { IndexComponent } from './index/index.component';
import { RequestListComponent  } from './request-list/request-list.component';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import { WorkListComponent } from './work-list/work-list.component';
import { MyTimeslotComponent } from './my-timeslot/my-timeslot.component';
import { CreateRequestComponent } from './create-request/create-request.component';
import { FeedbackRequestService } from './services/feedbackRequestService'
import { EditRequestComponent } from './edit-request/edit-request.component';
import { DetailsPopupComponent } from './presentation/Details/detailsPopup.component';
import { ResponsePopupComponent } from './presentation/responsePopup/responsePopup.component';
import { NotePopupComponent } from './edit-request/notePopup/notePopup.component';
import { FeedbackNoteService } from './services/feedbackNoteService';
import { ReminderNotification } from './services/reminderNotification';
import { timeSlotPopupComponent } from './presentation/timeSlotPopup/timeSlotPopup.component';
import { TimeSlotService } from './services/timeSlotService';
import { viewAllTimeSlotComponent } from './presentation/viewAllTimeSlotPopup/viewAllTimeSlot.component';
import { withdrawlCompletePopupComponent } from './presentation/withdrawlCompletePopup/withdrawlCompletePopup.component';
import { PermissionGuard } from '../shared/permissionGuard'
import { AckPopupComponent } from './presentation/AckPopup/ackPopup.component';

/* ngRx*/
import { StoreModule } from '@ngrx/store'
import { reducer } from './state/home.reducer';
import { EffectsModule } from '@ngrx/effects'
import { HomeEffects } from './state/home.effects';


const routes = [
  { path: '', component: IndexComponent },
  {
    path: 'index',
    component: IndexComponent,
    data: { parent: "Home" }
    
  },
  {
    path: 'index/:message',
    component: IndexComponent,
    data: { parent: "Home" },
    canActivate: [PermissionGuard]

  },
  {
    path: 'createRequest',
    component: CreateRequestComponent,
    data: { parent: "Home" },
    canActivate: [PermissionGuard]

  },
  {
    path: 'editRequest/:id',
    component: EditRequestComponent,
    data: { parent: "Home" },
    canActivate: [PermissionGuard]
  }
];
@NgModule({
  imports: [SharedModule.forRoot(), RouterModule.forChild(routes), StoreModule.forFeature('home', reducer), EffectsModule.forFeature([HomeEffects])],
  declarations: [DetailsPopupComponent, IndexComponent, RequestListComponent, FeedbackListComponent, WorkListComponent,
    MyTimeslotComponent, CreateRequestComponent, EditRequestComponent, NotePopupComponent, ResponsePopupComponent, timeSlotPopupComponent, viewAllTimeSlotComponent, withdrawlCompletePopupComponent, AckPopupComponent],
  exports: [DetailsPopupComponent, IndexComponent, RequestListComponent, FeedbackListComponent,
    WorkListComponent, CreateRequestComponent, EditRequestComponent, NotePopupComponent, ResponsePopupComponent, timeSlotPopupComponent, viewAllTimeSlotComponent, withdrawlCompletePopupComponent, AckPopupComponent],
  providers: [FeedbackRequestService, FeedbackNoteService, ReminderNotification, TimeSlotService ]
})
export class HomeModule { }
