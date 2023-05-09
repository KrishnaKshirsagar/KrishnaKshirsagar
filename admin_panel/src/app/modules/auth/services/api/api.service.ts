import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
// import { UserResFull } from 'src/app/shared/interfaces/results/user.interface'

@Injectable({
  providedIn: "root",
})
export class ApiService {
  BaseUrl = environment.baseUrl;
  rememberMe!: boolean;
  

login(credentials:any) {
  sessionStorage.setItem('userName', credentials.us);
  sessionStorage.setItem('token', credentials.token);
}

getCostumer() {
  const user = {
    Name:  sessionStorage.getItem('firstName'),
    token: sessionStorage.getItem('token')
}
}

  constructor(private router: Router, private http: HttpClient) {}

  Adminlogin(body: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.BaseUrl + "auth/user-login", body);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(this.BaseUrl + "auth/forgot-password", email);
  }

  verifyUser(body: any) {
    return this.http.put(this.BaseUrl + "auth/verify", body);
  }

  userMobileVerification(token: any) {
    const body = {
      token: token,
    };
    return this.http.post(this.BaseUrl + "auth/otp/user", body);
  }

  fetchCompanyByUserid(userid: string): Observable<any> {
    return this.http.get<any>(this.BaseUrl + `entities/${userid}`);
  }

  resetPassword(body: {
    token: string;
    password: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post<any>(this.BaseUrl + "auth/reset-password", body);
  }

  logout(userid: string): Observable<any> {
    const body = {
      userID: userid,
    };
    return this.http.post<any>(this.BaseUrl + "auth/logout", body);
  }
}
