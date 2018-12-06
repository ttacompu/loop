import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { environment } from "../../../environments/environment";
import { UserInfo } from "../../models/UserInfo";
import { map, tap, switchMap } from 'rxjs/operators';
import { FeedbackRequest } from "../../models/FeedbackRequest";
import { UserService } from "../../core/services/userService";
import { fromPromise } from "rxjs/internal-compatibility";


@Injectable()
export class FeedbackRequestService {

  constructor(private http_: HttpClient, private userService: UserService) {
    //this.getUserInfo();
  }

  getUserInfo() {
    const baseUrl = `${environment.host}/api/SiteSecurity/GetUserInfo`;
  }

  getRequestFeedbackWithoutClearyKey() {
    return this.userService.getClearyKeyObs().pipe(switchMap(this.getAllRequestFeedback.bind(this)));
  }

  getAllRequestFeedback(requesterCleayKey) {
    
    const baseUrl = `${environment.host}/api/FeedbackRequest/GetFeedbackRequestByRequester`;
    return this.http_.get<FeedbackRequest[]>(baseUrl, { params: { requesterCleayKey: requesterCleayKey } });
  }

  getRequestFeedbackById(id) {
    const baseUrl = `${environment.host}/api/FeedbackRequest/GetFeedbackRequestById`;
    return this.http_.get(baseUrl, { params: { id: id } });
  }

  getRequestFeedbackByIdForContributor(id, userKey, userRole) {
    const baseUrl = `${environment.host}/api/FeedbackRequest/GetContributorFeedbackRequestById`;
    return this.http_.get(baseUrl, { params: { id: id, userKey: userKey, userRole: userRole } });
  }

  saveRequestFeedback(req)  {
    const baseUrl = `${environment.host}/api/FeedbackRequest`;
    return this.http_.post<FeedbackRequest>(baseUrl, JSON.stringify(req));
  }

  updateIsSharedWith(parms) {
    const baseUrl = `${environment.host}/api/FeedbackRequest`;
    return this.http_.put<FeedbackRequest>(baseUrl, JSON.stringify(parms));
  }

  getAllLayers() {
    const baseUrl = `${environment.host}/api/Person/GetAllAllowedLawyers`;
    return this.http_.get<any>(baseUrl);
  }

 

  getAllLibs() {
    const baseUrl = `${environment.host}/api/Library`;
    return this.http_.get<any>(baseUrl);
  }

  deleteFeedback(id) {
    const baseUrl = `${environment.host}/api/FeedbackRequest/${id}`;
    return this.http_.delete(baseUrl);
  }

  getAllFeedbacksToOtherWithoutClearyKey() {
    return this.userService.getClearyKeyObs().pipe(switchMap(this.getAllFeedbacksToOther.bind(this)));
  }

  getAllFeedbacksToOther(contributorClearyKey) {
    const baseUrl = `${environment.host}/api/FeedbackRequest/GetFeedbackRequestByContributor`;
    return this.http_.get<FeedbackRequest[]>(baseUrl, { params: { contributorClearyKey : contributorClearyKey } });
  }

  getPendingListWithoutClearyKey() {
    return this.userService.getClearyKeyObs().pipe(switchMap(this.getWorkList.bind(this)));
  }
  getWorkList(clearyKey) {
    const baseUrl = `${environment.host}/api/FeedbackRequest/GetFeedbackRequestWorkList`;
    return this.http_.get<FeedbackRequest[]>(baseUrl, { params: { userCleayKey: clearyKey } });
  }
  
}
