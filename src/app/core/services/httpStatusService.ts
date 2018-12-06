import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class HttpStatusService {

  private requestStatus: BehaviorSubject<boolean>;

  constructor() {
    this.requestStatus = new BehaviorSubject(false);
  }
  setHttpStatus(inFlight: boolean) {
    this.requestStatus.next(inFlight);
  }
  getHttpStatus(): Observable<boolean> {
    return this.requestStatus.asObservable();
  }

}
