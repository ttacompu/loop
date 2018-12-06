import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { environment } from "../../../environments/environment";
import { UserInfo } from "../../models/UserInfo";
import { map } from 'rxjs/operators';
import { Subject } from "rxjs";
import * as R from 'ramda';
import { ActivatedRoute } from "@angular/router";
import { fromPromise } from "rxjs/internal-compatibility";

@Injectable()
export class UserService {
  userId: string;
  originPromise;
  userInfoPromise;
  userInfoObs;
  userInfoSubject = new Subject();
  refreshSubject = new Subject();
  responseSubject = new Subject();
  impersonated = false;
  reponseData;
  

  constructor(private http_: HttpClient, private route: ActivatedRoute) {
    this.userId = this.getParameterByName('uid');
    if (this.userId) {
      this.setUserInfo(this.userId);
    }
    else {
      this.getUserInfo();
    }
  //  this.fakeUserInfo();
  }

  private getParameterByName(name: any): string {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  private getUserInfo() {
    const baseUrl = `${environment.host}/api/Security/GetUserInfo`;
    this.originPromise = this.userInfoPromise = this.http_.get<UserInfo>(baseUrl).toPromise();
  }

  private setUserInfo(userId: string): void {
    if (userId) {
      const baseUrl = `${environment.host}/api/Security/${userId}`;
      this.originPromise = this.userInfoPromise = this.http_.get<UserInfo>(baseUrl).toPromise();
    }
  }

  refreshIndex() {
    return this.refreshSubject.asObservable();
  }

  setValForRefresh(val) {
    this.refreshSubject.next(val);
  }

  

 getPicUrl() {
    return this.userInfoPromise.then((data: UserInfo) => data.userSharePointPhotoURL);
  }

  getOriginPromise() {
    return this.originPromise;
  }

  getUserFirstName() {
    return this.userInfoPromise.then((data: UserInfo) => data.person.firstName);
  }

  getUserFullName() {
    return this.userInfoPromise.then((data: UserInfo) => data.person.fullName);
  }

  getUserRoles() {
    return this.userInfoPromise.then((data: UserInfo) => data.roles);
  }

  isRoleExist(roleName) {
    return this.getUserRoles().then(roles => {
      return roles.findIndex(role => role.name == roleName) > -1;
    });
  }

  getClearyKeyObs() {
    return fromPromise(this.userInfoPromise).pipe(map((data: UserInfo) => data.person.clearyKey))
  }

  getClearyKey() {
    return this.userInfoPromise.then((data: UserInfo) => data.person.clearyKey);
  }

  getUserId() {
    return this.userInfoPromise.then((data: UserInfo) => data.person.userID);
  }
  isAdmin() {
    return this.originPromise.then(data => data.permissions.isAdmin);
  }

  getAllLawyers() {
    return this.originPromise.then(data => {
      const allLawyers = R.sortBy(R.prop('userFullName'), data.lawyers);
      return allLawyers;
    })
  }

  isSecretary() {
    return this.originPromise.then(data => data.permissions.isSecretary as boolean);
  }

  isImpersonated() {
    return this.impersonated;
  }

  impersonate(userId) {
    const baseUrl = `${environment.host}/api/Security/Impersonate/${userId}`;
    this.userInfoObs = this.http_.get<UserInfo>(baseUrl);
    this.userInfoObs.subscribe((data) => {
      this.userInfoPromise = this.userInfoObs.toPromise().then(data => data.impersonatedUserInfo);
      this.impersonated = true;
      this.userInfoSubject.next({ UserInfo: data }
      )
    })
  }

  impersonating() {
    return this.userInfoSubject.asObservable();
  }

  fakeUserInfo() {
    const baseUrl = `${environment.host}/api/Security/GetFakeUserInfo`;
    this.originPromise= this.userInfoPromise = this.http_.get<UserInfo>(baseUrl).toPromise();
  }

  getStatusColor(colorCode) {
    switch (colorCode) {
      case 1:
        return "Draft";
      case 2:
        return "Requested";
      case 3:
        return "Accepted";
      case 4:
        return "Declined";
      case 5:
        return "Withdrawn";
      case 6:
        return "Completed";
      case 7:
        return "Unsolicited"
      default:
        return "";
    }
  }

}
