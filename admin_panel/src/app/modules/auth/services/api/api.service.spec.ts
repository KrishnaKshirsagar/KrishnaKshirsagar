import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { UserResfull } from "src/app/shared/interfaces/result/user";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  BaseUrl = environment.baseUrl;

  constructor(private router: Router, private http: HttpClient) {}

  // AdminLogin(email: string, password: string) {
  //   const headers = new HttpHeaders().set('content-type', 'application/json').set('Access-Control-Allow-Origin', '*');

  //   const authData: AuthData = { email: email, password: password };
  //   return this.http.post<{ token: string; status: any }>(this.BaseUrl + 'signin', authData, { headers: headers });
  // }

  Adminlogin(body: {
    email: string;
    password: string;
  }): Observable<UserResfull> {
    return this.http.post<UserResfull>(this.BaseUrl + "signin", body);
  }

  forgotPassword(email: string) {
    return this.http.post(this.BaseUrl + "forgotpassword", email);
  }
}
