import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RoleguardGuard implements CanActivate {
  durationInSeconds = 2;
  constructor(public snackBar: MatSnackBar) {}
  canActivate() {
    let Role = sessionStorage.getItem("Role");
    if (Role == "xuritiAdmin") {
      return true;
    }

    this.snackBar.open("Your are not allowed to accsess this page.", "Close", {
      duration: this.durationInSeconds * 3000,
      panelClass: ["error-dialog"],
    });
    return false;
  }
}
