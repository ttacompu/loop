import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { of } from 'rxjs/observable/of';
import { Observable } from "rxjs/Observable";
import { HttpParams } from "@angular/common/http";

@Injectable()
export class SearchService {
  private filter_ = null;

  constructor(private http_: HttpClient) {
  }

  get fileter(): any {
    return this.filter_;
  }

  set filter(val: any) {
    this.filter_ = { ...val };
  }
  

  getSearchResults(userClearyKey: string, userRole: string, searchTerm: string): Observable<any[]> {
    const baseUrl = `${environment.host}/api/FeedbackRequest/GetFeedbackRequestBySearch?userClearyKey=${userClearyKey}&userRoleCode=${userRole}&searchTerm=${searchTerm}`;
    return this.http_.get<any[]>(baseUrl);       
  }
    
}
