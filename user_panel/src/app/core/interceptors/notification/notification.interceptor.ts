import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { DialogService } from "../../services/dialog/dialog.service";
import { InfoDialogData } from "src/app/shared/interfaces/components/info-dialog-data.interface";
import { ErrorDialogData } from "src/app/shared/interfaces/components/error-dialog-data.interface";

@Injectable()
export class NotificationInterceptor implements HttpInterceptor {
  constructor(private dialogService: DialogService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<InfoDialogData>) => {
        if (event instanceof HttpResponse) {
          if (
            event.body &&
            event.body.message &&
            event.status != 200 &&
            event.status != 201 &&
            event.status != 202
          ) {
            const data: InfoDialogData = {
              message: event.body.message,
            };

            this.dialogService.openInfoDialog(data);
          }
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        const data: ErrorDialogData = {
          code: error.error.code,
          message: error.error.message,
        };

        if (error && error.error && error.error.code && error.error.code !== 401 && error.error.code !== 500) {
          this.dialogService.openErrorDialog(data);
        }

        return throwError(error);
      })
    );
  }
}
