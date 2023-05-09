import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  BaseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  fetchUser(data: any): Observable<any> {
    let requestOptions = {};
    let urlStr: string = this.BaseUrl + `user/userlist`;
    let firstEle = true;
    if (data.status) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += `status=${data.status}`;
    }

    if (data.user_name) {
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += `user_name=${data.user_name}`;
    }

    if (data.user_email) {
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += `user_email=${data.user_email}`;
    }

    if (data.user_mobile) {
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += `user_number=${data.user_mobile}`;
    }

    if (data.register_date) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += `createdAt=${data.register_date}`;
    }

    return this.http.get<any>(urlStr, requestOptions);
  }

  resendInviteUser(email: string){
    return this.http.post<any>(this.BaseUrl + `auth/resend-email/${email}`, '');
  }

  editUser(userid: string, userData: any): Observable<any> {
    return this.http.put<any>(this.BaseUrl + `user/${userid}`, userData);
  }

  getUserByUserid(userid: string): Observable<any> {
    return this.http.get<any>(this.BaseUrl + `user/${userid}`);
  }

  deleteUser(userid: string): Observable<any> {
    return this.http.delete<any>(this.BaseUrl + `user/${userid}`);
  }
}
