import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { environment } from "../../../environments/environment";


@Injectable()
export class ReminderNotification {

  constructor(private http_: HttpClient) {
  }

  getReminderSent(id) {
    const baseUrl = `${environment.host}/api/ReminderNotification/GetReminderNotificationCount`;
    return this.http_.get(baseUrl, { params: { id } });
  }

  sentReminder(id) {
    const feedbackRequestId = id;
    const baseUrl = `${environment.host}/api/ReminderNotification`;
    return this.http_.post(baseUrl, JSON.stringify(feedbackRequestId));
    
  }
}
