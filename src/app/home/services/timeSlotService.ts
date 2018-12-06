import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { environment } from "../../../environments/environment";
import { DatePipe } from "@angular/common";
import { UserService } from "../../core/services/userService";
import { switchMap, map } from "rxjs/operators";
import { of } from "rxjs";


@Injectable()
export class TimeSlotService  {

  constructor(private http_: HttpClient, private datePipe: DatePipe,  private userService: UserService) {
  }
  saveTimeSlotWithoutClearyKey(timeSlot: any) {
    return this.userService.getClearyKeyObs().pipe(switchMap(key => { timeSlot.ownerClearyKey = key; return this.saveTimeSlot(timeSlot)}));
  }

  saveTimeSlot(timeSlot: any) {
    const baseUrl = `${environment.host}/api/TimeSlot`;
    timeSlot.fromDate = `${this.datePipe.transform(timeSlot.fromDate, 'yyyy-MM-dd HH:mm:ss')}`; 
    timeSlot.toDate = `${this.datePipe.transform(timeSlot.toDate, 'yyyy-MM-dd HH:mm:ss')}`;
    return this.http_.post(baseUrl, JSON.stringify(timeSlot));
  }

  getAllAvailabeTimeSlotAndDesignatedClearyKey() {
    return this.userService.getClearyKeyObs().pipe(switchMap(this.getAllAvailabeTimeSlotAndDesignated.bind(this)));
  }

  getAvailabeTimeSlotByClearyKey(clearyKey) {
    const baseUrl = `${environment.host}/api/TimeSlot/GetAllAvailableTimeSlotsByClearyKey`;
    return this.http_.get<any>(baseUrl, { params: { ownerClearyKey: clearyKey } });
  }

  getAllAvailabeTimeSlotAndDesignated(clearyKey) {
    const baseUrl = `${environment.host}/api/TimeSlot/GetAllAvailableTimeSlotsIncludeDesignatedByClearyKey`;
    return this.http_.get<any>(baseUrl, { params: { ownerClearyKey: clearyKey } });
  }

  isTimeSlotAvailable(timeSlotId) {
    const baseUrl = `${environment.host}/api/TimeSlot/IsTimeSlotAvailable`;
    return this.http_.get<boolean>(baseUrl, { params: { timeSlotId: timeSlotId } });
  }

  deleteTimeSlot(timeSlotId) {
    const baseUrl = `${environment.host}/api/TimeSlot/${timeSlotId}`;
    return this.http_.delete(baseUrl).map(x => timeSlotId);
  }
}
