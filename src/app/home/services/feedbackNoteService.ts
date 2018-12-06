import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { environment } from "../../../environments/environment";
import { UserInfo } from "../../models/UserInfo";
import { map } from 'rxjs/operators';
import { FeedbackRequest } from "../../models/FeedbackRequest";

@Injectable()
export class FeedbackNoteService {

  

  constructor(private http_: HttpClient) {
    //this.getUserInfo();
  }

  getUserInfo() {
    const baseUrl = `${environment.host}/api/SiteSecurity/GetUserInfo`;
  }
  
  saveFeedbackNote(note)  {
    const baseUrl = `${environment.host}/api/FeedbackNote`;
    return this.http_.post<FeedbackRequest>(baseUrl, JSON.stringify(note));
  }

  deleteFeedbackNote(Id: number): Observable<any> {
    const baseUrl = `${environment.host}/api/FeedbackNote?id=${Id}`;
    return this.http_.delete(baseUrl);
  }
}
