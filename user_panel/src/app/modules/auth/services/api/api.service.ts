import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { AuthData } from "src/app/shared/interfaces/auth/auth.interface";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  
  BaseUrl = environment.baseUrl;

  gUser: any;

  private token!: string;

  response: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  loginUser(email: string, password: string, recaptcha:string) {
    const authData: AuthData = { email: email, password: password, recaptcha:recaptcha };
    return this.http.post<{ token: string; status: any }>(
      this.BaseUrl + "auth/user-login",
      authData
    );
  }

  setMobileNumber(mobile: number) {
    const body = {
      recipient: mobile,
    };
    return this.http.post<any>(this.BaseUrl + "auth/send-otp", body);
  }

  otpVerification(data: any) {
    return this.http.post(this.BaseUrl + "auth/verify-otp", data);
  }

  //GOOGLE SIGN-IN
  signInWithGoogle(userData: any) {
    return this.http.post(this.BaseUrl + "auth/google-login", userData);
  }

  //GOOGLE SIGN-UP
  signUpWithGoogle(id_token: string, sharedData: any) {
    return this.http.post<any>(this.BaseUrl + "auth/register-user", sharedData);
  }

  //NORMAL sIGN UP
  signupUser(user: any) {
    return this.http.post<any>(this.BaseUrl + "auth/register-user", user);
  }

  logout(userid: string) {
    const body = {
      userID: userid,
    };
    return this.http.post<void>(this.BaseUrl + "auth/logout", body);
  }

  forgotPassword(email: string) {
    return this.http.post(this.BaseUrl + "auth/forgot-password", email);
  }

  resetpasswordLinkValidation(uid: string, token: string) {
    return this.http.get(this.BaseUrl + `auth/reset-password/${uid}/${token}`);
  }

  resetPassword(
    uid: string,
    token: string,
    body: { password: string; cpassword: string }
  ) {
    return this.http.post(
      this.BaseUrl + `auth/reset-password/${uid}/${token}`,
      body
    );
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

  userEmailVerify(token: string) {
    return this.http.get(this.BaseUrl + `auth/confirm-email/${token}`);
  }

  fetchCompanyByUserid(userid: string) {
    return this.http.get(this.BaseUrl + `entity/entities/${userid}`);
  }
}
