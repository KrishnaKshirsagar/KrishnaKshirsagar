import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate?: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class FormGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: ComponentCanDeactivate
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (component.canDeactivate) {
      return component.canDeactivate()
        ? true
        : confirm(
            'WARNING: You have unsaved changes. Do you want to continue?'
          );
    }

    return true;
  }
}
