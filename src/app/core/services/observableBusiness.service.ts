import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { debounceTime, map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { environment } from "../../../environments/environment";


@Injectable()
export class ObservableBusinessService{

  addBusineeRuleToObservable(obs, mapFn, subscriptionFn) {
    const resultObs = obs
      .pipe(debounceTime(200))
      .pipe(distinctUntilChanged())
      .pipe(map(mapFn));
    return resultObs.subscribe(
      subscriptionFn
    );
  }
}
