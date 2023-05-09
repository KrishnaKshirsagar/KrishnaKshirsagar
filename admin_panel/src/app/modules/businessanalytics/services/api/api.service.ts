import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  userid = sessionStorage.getItem("LoginId");
  defaultData = {};
  Base_url = environment.baseUrl;

  constructor(private http: HttpClient) {
    this.defaultData = { user: this.userid?.toString() };
  }

  companynameAutoSuggestion(companyName: any): Observable<any> {
    const headerDict = {
      loader_flag: "false",
    };
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    return this.http.get<any>(
      this.Base_url + `entity/entities?companyName=${companyName}`,
      requestOptions
    );
  }

  getBox1Data(companyId: string) {
    //Bill summary
    return this.http.get<any>(
      this.Base_url + `entity/csv-dashboard/bill-summary/${companyId}`
    );
  }

  getBox3Data(companyId: string) {
    //invoice pattern
    return this.http.get<any>(
      this.Base_url + `entity/csv-dashboard/invoice-pattern/${companyId}`
    );
  }

  getBox4Data(companyId: string, filter: any) {
    //Business analysis trend
    return this.http.get<any>(
      this.Base_url +
        `entity/csv-dashboard/business-analysis-trends/${companyId}?from_month=${filter.from_month}&from_year=${filter.from_year}&type=${filter.type}&with_month=${filter.with_month}&with_year=${filter.with_year}`
    );
  }

  getGSTAnalyserData(companyId: string) {
    return this.http.get<any>(
      this.Base_url + `entity/csv-dashboard/gst-analyzer/${companyId}`
    );
  }

  getBox12Data(companyId: string) {
    //Payment mode data
    return this.http.get<any>(
      this.Base_url + `entity/csv-dashboard/payment-method/${companyId}`
    );
  }
}
