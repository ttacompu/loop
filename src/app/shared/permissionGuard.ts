import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRoute } from "@angular/router";
import { UserService } from "../core/services/userService";

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService, private routeSnapshot: ActivatedRoute) {
  }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.userService.getOriginPromise().then(data => {
        if (this.hasPermission(data.permissions)) {
          return resolve(true);
        }
        this.router.navigate(["/404"])
        return resolve(false);
      })
    })
  }

  private hasPermission(permissions) {
    for (let permission in permissions) {
      if (permissions.hasOwnProperty(permission)) {
        if (permissions[permission] === true) {
          return true;
        }
      }
    }
    return false;
  }
}
