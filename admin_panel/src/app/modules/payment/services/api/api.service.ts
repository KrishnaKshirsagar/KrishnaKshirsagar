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

  getPaymentHistory() {
    return this.http.get(
      this.Base_url + "payment/transctionshistory",
      this.defaultData
    );
  }
  get_emandateHistory(filterdata: any) {
    let requestOptions = {};

    let urlStr: string = this.Base_url + "payment/payhistory";
    let firstEle = true;
    if (filterdata.invoice_number) {
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
      urlStr += "invoice_number=" + filterdata.invoice_number;
    }

    if (filterdata.transaction_date) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "transaction_date=" + filterdata.transaction_date;
    }

    return this.http.get(urlStr, requestOptions);
  }

  changePaymentStatus(id: string, status: string) {
    return this.http.patch(
      this.Base_url + `payment/transctionshistory/${id}`,
      status
    );
  }

  changeEmandateStatus(id: string, status: string) {
    return this.http.patch(this.Base_url + `transctions/${id}`, status);
  }

  // ====================>
  companynameAutoSuggestion(companyName: string): Observable<any> {
    const headerDict = {
      'loader_flag': 'false'
    }    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    return this.http.get<any>(
      this.Base_url + `entity/entities?companyName=${companyName}`, requestOptions
    );
  }

  filterPaymentHistory(filterdata: any): Observable<any> {
    let requestOptions = {};
    let urlStr: string = this.Base_url + "payment/transctionshistory";
    let firstEle = true;

    if (filterdata.invoiceNumber) {
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
      urlStr += "invoice_number=" + filterdata.invoiceNumber;
    }

    if (filterdata.invoice_date) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "invoice_date=" + filterdata.invoice_date;
    }

    if (filterdata.status_invoice) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "status_invoice=" + filterdata.status_invoice;
    }
    if (filterdata.payment_date) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "createdAt=" + filterdata.payment_date;
    }

    if (filterdata.usertype == "buyer" && filterdata.companyId) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "buyer=" + filterdata.companyId;
    }

    if (filterdata.usertype == "seller" && filterdata.companyId) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "seller=" + filterdata.companyId;
    }
    return this.http.get<any>(urlStr, requestOptions);
  }
}
