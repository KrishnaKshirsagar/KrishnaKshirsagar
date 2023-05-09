import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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

  getApprovedDocuments() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.defaultData}`
    });

    const requestOptions = { headers: headers };
    return this.http.get(this.Base_url + `kyc/approved`, requestOptions);
  }

  getRejectedDocuments() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.defaultData}`
    });

    const requestOptions = { headers: headers };
    return this.http.get(this.Base_url + `kyc/rejected`, requestOptions);
  }

  getPendingDocuments() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.defaultData}`
    });

    const requestOptions = { headers: headers };
    return this.http.get(this.Base_url + `kyc/pending`, requestOptions);
    // return this.http.get( `http://localhost:5010/kyc/pending`, requestOptions);

  }

  getKycDocument(companyId:any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.defaultData}`
    });

    const requestOptions = { headers: headers };
    return this.http.get(this.Base_url + `kyc/${companyId}/document`, requestOptions);
    // return this.http.get( `http://localhost:5010/kyc/${companyId}/status`, requestOptions);

  }

  setStatusForDocument(companyId:any, body:any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.defaultData}`
    });
    const requestOptions = { headers: headers };
    
    return this.http.patch(`${this.Base_url}kyc/${companyId}/status`,body, requestOptions);
    // return this.http.patch("http://localhost:5010/api/kyc/"+companyId+"/status",body, requestOptions);
  
  }

  getSpecifiedCompanyDetails(companyId: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.defaultData}`
    });

    const requestOptions = { headers: headers };
    return this.http.get(this.Base_url + `entity/entity/${companyId}`, requestOptions);
  }

  getAllKycDocuments(company_id: any) {
    return this.http.get(this.Base_url + `kyc/${company_id}/download`);
  }
}
