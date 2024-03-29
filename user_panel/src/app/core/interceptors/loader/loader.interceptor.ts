import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { finalize, Observable } from "rxjs";
import { SpinnerService } from "../../services/spinner/spinner.service";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private spinnerService: SpinnerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if(request.headers.get('loader_flag') !== 'false'){
      this.spinnerService.show();
    }

    return next.handle(request).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    );
  }
}
