import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { of } from 'rxjs/observable/of';
import { Note } from '../../models/Note';
import { NoteView } from '../../models/NoteView';
import { Person } from '../../models/Person';
import { Observable } from "rxjs/Observable";
import { HttpParams } from "@angular/common/http";

@Injectable()
export class ViewNotesService {
  private filter_ = null;

  constructor(private http_: HttpClient) {
  }

  get fileter(): any {
    return this.filter_;
  }

  set filter(val: any) {
    this.filter_ = { ...val };
  }
  

  getRequestorList(userClearyKey: string, userRole: string): Observable<Person[]> {
    const baseUrl = `${environment.host}/api/FeedbackNote/GetAllRequesters?userClearyKey=${userClearyKey}&userRoleCode=${userRole}`;
    return this.http_.get<Person[]>(baseUrl);       
  }

  getRequestorNotes(userClearyKey: string, userRole: string, requesterClearyKey: string): Observable<NoteView[]> {
    const baseUrl = `${environment.host}/api/FeedbackNote/GetNotesForUser?userClearyKey=${userClearyKey}&userRoleCode=${userRole}&requesterClearyKey=${requesterClearyKey}`;
    return this.http_.get<NoteView[]>(baseUrl); 
  }
}
