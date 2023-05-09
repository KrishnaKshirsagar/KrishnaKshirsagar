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
    let requestOptions = {}
    let urlStr: string =
    this.BaseUrl +`user/userlist?userRole=${data.user_role}`;
    if (data.status) {
      urlStr += `&status=${data.status}`;
    }
    if (data.user_name) {
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
      urlStr += `&user_name=${data.user_name}`;
    }
    if (data.user_email) {
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
      urlStr += `&user_email=${data.user_email}`;
    }
    if (data.user_mobile) {
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
      urlStr += `&user_mobile=${data.user_mobile}`;
    }
    if (data.staff_type) {
      urlStr += `&role=${data.staff_type}`;
    }
    if (data.register_date) {
      urlStr += `&createdAt=${data.register_date}`;
    }
    return this.http.get<any>(urlStr, requestOptions);
  }

  editUser(userid: string, userData: any): Observable<any> {
    return this.http.put<any>(this.BaseUrl + `user/${userid}`, userData);
  }

  getUserByUserid(userid: string): Observable<any> {
    return this.http.get<any>(this.BaseUrl + `user/${userid}`);
  }

  resendInvite(data: any): Observable<any> {
    return this.http.post<any>(
      this.BaseUrl + `user/user?userRole=xuritiAdmin`,
      data
    );
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(
      this.BaseUrl + `user/user?userRole=xuritiAdmin`,
      user
    );
  }

  deleteUser(userid: string): Observable<any> {
    return this.http.delete<any>(this.BaseUrl + `user/${userid}`);
  }

  // Auto Suggetion Companies
  companynameAutoSuggestion(companyName: string): Observable<any> {
    const headerDict = {
      'loader_flag': 'false'
    }    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    return this.http.get<any>(
      this.BaseUrl + `entity/entities?companyName=${companyName}`, requestOptions
    );
  }
  // Get Companny By Staff Id
  fetchCompanyByUserid(userid: string) {
    return this.http.get(this.BaseUrl + `entity/entities/${userid}`);
  }
  // Map compnies
  companyMapping(staffid: string, body: any) {
    return this.http.post<any>(this.BaseUrl + `user/staff/${staffid}`, body);
  }
  // Un Map Compnies
  unmappingCompny(staffid: string, companyid: string) {
    return this.http.delete<any>(
      this.BaseUrl + `user/user/${staffid}/company/${companyid}`
    );
  }
}
