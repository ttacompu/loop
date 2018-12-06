import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { environment } from '../../../environments/environment';
import { Log } from '../../models/Log'

@Injectable()
export class logService {

  private filter_ = null;
  private headers: HttpHeaders = new HttpHeaders()
    .set("Content-Type", "application/json; charset=utf-8");
  constructor(private http_: HttpClient) {
  }

  get fileter(): any {
    return this.filter_;
  }

  set filter(val: any) {
    this.filter_ = { ...val };
  }

  getLogs(): Observable<Log[]> {
    const baseUrl = `${environment.host}/api/Log/GetLogs`;
    return this.http_.get<Log[]>(baseUrl);
  }

  clearLog() {
    const baseUrl = `${environment.host}/api/Log/ClearLogs?id=0`;
    //this.http_.delete(baseUrl);
    this.http_.delete(baseUrl).subscribe((response) => {
      console.log("deleted");
    });
  }

}
