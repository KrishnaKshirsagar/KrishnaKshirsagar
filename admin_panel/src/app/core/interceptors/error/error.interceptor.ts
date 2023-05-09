import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "../../services/auth/auth.service";
import { ApiService } from "src/app/modules/auth/services/api/api.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { LOCAL_STORAGE_AUTH_DETAILS_KEY } from "src/app/shared/constants/constants";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  userid!:string;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status == 401 || error.status == 403 || error.status == 440 ){
          //When session timeout or unauthorized
          this.logout();
        }

        return throwError(error);
      })
    );
  }

  logout() {
    this.dialog.closeAll();
    //checking session storage for user data
    const detailsStr = sessionStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      this.userid = userDetails._id;
      //logout from current session
      this.apiService.logout(this.userid).subscribe(() => {
        sessionStorage.removeItem('LoginId');
        sessionStorage.removeItem('Role');
        this.authService.setAuthStatus(null);
        sessionStorage.clear();
        this.router.navigate(["/admin/auth/login"]);

      });
    }
  }
}
