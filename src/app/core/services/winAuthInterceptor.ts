import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent,  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { tap, catchError, finalize, map } from 'rxjs/operators';
import { HttpStatusService } from './httpStatusService'



@Injectable()
export class WinAuthInterceptor implements HttpInterceptor {
  constructor(private httpStatusService: HttpStatusService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true
    });

    req = req.clone({
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Content-Type': 'application/json; charset=utf-8',
        'Data-Type': 'json'
      })
    })
    return next.handle(req).pipe(tap(event => { this.httpStatusService.setHttpStatus(true); }), catchError(error => { this.httpStatusService.setHttpStatus(false); return Observable.throw(error); }), finalize(() => {
      this.httpStatusService.setHttpStatus(false);
    }));
  }
}
