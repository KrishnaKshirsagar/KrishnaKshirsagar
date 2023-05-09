import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  userid = sessionStorage.getItem("LoginId");
  defaultData = {};
  Base_url = environment.baseUrl;

  constructor(private http: HttpClient) {
    this.defaultData = { user: this.userid?.toString() };
   }

  getagentHistory() {
    return this.http.get(
      this.Base_url + "kyc/agent-form/record-view")
  }
}
