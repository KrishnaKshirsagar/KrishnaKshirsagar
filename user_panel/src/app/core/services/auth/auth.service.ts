import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { LOCAL_STORAGE_AUTH_DETAILS_KEY } from "src/app/shared/constants/constants";
import { UserResFull } from "src/app/shared/interfaces/results/user.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  authDetails = new BehaviorSubject<UserResFull | null>(null);

  constructor() {
    if (!this.authDetails.value) {
     const detailsStr = sessionStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);

      if (detailsStr) {
        const details = JSON.parse(detailsStr) as UserResFull;
        this.authDetails.next(details);
      }
    }
    this.getToken();
  }

  getAuthStatusObservable(): Observable<UserResFull | null> {
    return this.authDetails.asObservable();
  }

  getAuthStatus(): UserResFull | null {
    return this.authDetails.value;
  }

  setAuthStatus(details: UserResFull | null) {
    this.authDetails.next(details);
    if (details) {
      sessionStorage.setItem(LOCAL_STORAGE_AUTH_DETAILS_KEY, JSON.stringify(details));

    } else {
      sessionStorage.removeItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    }
  }

  getToken() {
    const detailsStr = sessionStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const token = details.token;
      return token;
    }
  }
}
