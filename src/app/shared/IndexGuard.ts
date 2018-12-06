import { CanActivate, ActivatedRoute } from "@angular/router"
import { Router } from "@angular/router";
import { Injectable, Input } from "@angular/core";
import { UserService } from "../core/services/userService";


@Injectable()
export class IndexGuard implements CanActivate{

  constructor(private router: Router, private userService: UserService, private routeSnapshot: ActivatedRoute) {
  }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.userService.getOriginPromise().then(data => {
        if (data.permissions.isSecretary === false) {
          resolve(true)
        }
        else if (data.permissions.isSecretary === true && this.userService.isImpersonated()) {
          resolve(true)
        }
        else if (data.permissions.isSecretary === true && this.userService.isImpersonated() === false ){
          this.router.navigate(["secretaryHome"])
          return resolve(false);
        }
      })
    })
  }
}

