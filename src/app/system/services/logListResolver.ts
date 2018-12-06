import { Injectable } from "@angular/core";
import { Log } from "../../models/Log";
import { logService } from "./logService";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs/Observable";

@Injectable()
export class logListResolver implements Resolve<Log[]> {
  constructor(private logService: logService) {
  }

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<Log[]> {
    return this.logService.getLogs();
  }

}
