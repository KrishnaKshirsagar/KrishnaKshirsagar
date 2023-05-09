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
import { Router } from "@angular/router";
import { LOCAL_STORAGE_AUTH_DETAILS_KEY } from "src/app/shared/constants/constants";
import { ApiService as AuthApiService } from "src/app/modules/auth/services/api/api.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  userid!: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: AuthApiService
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
        // switch (error.error.code) {
        //   case 401: {
        //     this.authService.setAuthStatus(null);

        //     this.router.navigate(["/auth/login"]);
        //     break;
        //   }
        //   case 403: {
        //     this.router.navigate(["/forbidden"]);
        //     break;
        //   }
        //   case 500: {
        //     this.router.navigate(["/error"]);
        //     break;
        //   }
        //   default: {
        //     break;
        //   }
        // }
        return throwError(error);
      })
    );
  }

  logout() {
    this.getLoggedInUser();
    this.apiService.logout(this.userid).subscribe(() => {
      sessionStorage.clear();
      sessionStorage.removeItem('companyid');
      this.authService.setAuthStatus(null);
      this.router.navigate(["/auth/login"]);
    });
  }

  getLoggedInUser() {
    const detailsStr = sessionStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      this.userid = userDetails._id;
    }
  }
}
