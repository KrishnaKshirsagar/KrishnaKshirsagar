import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  BaseUrl = environment.baseUrl;
  private token!: string;

  response: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  getPurchaseLedgerReport(companyid: string) {
    return this.http.get(this.BaseUrl + `ledger/${companyid}/buyer`);
  }

  getTransactionStatement(companyid: string, filterdata: any) {
    let requestOptions = {};
    let urlStr: string =
      this.BaseUrl + `ledger/statement/${filterdata.user_type}/${companyid}`;
    let firstEle = true;

    if (filterdata.seller) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "seller=" + filterdata.seller;
    }

    if (filterdata.invoice_number) {
      const headerDict = {
        loader_flag: "false",
      };
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

    if (filterdata.invoice_date) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "invoice_date=" + filterdata.invoice_date;
    }

    if (filterdata.status) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "status=" + filterdata.status;
    }

    if (filterdata.user_id) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "user_id=" + filterdata.user_id;
    }
    return this.http.get<any>(urlStr, requestOptions);
  }

  getTransactionLedger(filter_data: any) {
    let urlStr: string =
      this.BaseUrl +
      `ledger/companies/transaction_ledger?${filter_data.user_type}=${filter_data._id}`;

    if (filter_data.as_on_date) {
      urlStr += `&as_on_date=${filter_data.as_on_date}`;
    }
    return this.http.get(urlStr);
  }

  getVirtualAccounts(filter_data: any) {
    let urlStr: string =
      this.BaseUrl +
      `ledger/companies/virtual_accounts?${filter_data.user_type}=${filter_data._id}`;

    if (filter_data.as_on_date) {
      urlStr += `&as_on_date=${filter_data.as_on_date}`;
    }
    return this.http.get(urlStr);
  }

  ageing_by_invoice(filter_data: any) {
    let urlStr: string =
      this.BaseUrl +
      `ledger/invoices/ageing/receivables_agings_invoice?${filter_data.user_type}=${filter_data._id}`;

    let firstEle = true;

    if (filter_data.as_on_date) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += `as_on_date=${filter_data.as_on_date}`;
    }

    if (filter_data.anchor_id) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += `Anchor=${filter_data.anchor_id}`;
    }

    if (filter_data.dealer_id) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += `Dealer=${filter_data.dealer_id}`;
    }

    if (filter_data.nbfc_id) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += `Financing_Partner=${filter_data.nbfc_id}`;
    }
    return this.http.get(urlStr);
  }

  companynameAutoSuggestion(companyName: string): Observable<any> {
    const headerDict = {
      loader_flag: "false",
    };
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.http.get<any>(
      this.BaseUrl + `entity/entities?companyName=${companyName}`,
      requestOptions
    );
  }
  // auto suggetion nbfcs
  nbfcAutoSuggestion(nbfc_name: string) {
    const headerDict = {
      loader_flag: "false",
    };
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.http.get<any>(
      this.BaseUrl + `nbfcs/get-nbfc?nbfc_name=${nbfc_name}`,
      requestOptions
    );
  }

  getSellerListForHOuser(user_id: string) {
    const headerDict = {
      loader_flag: "false",
    };
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.http.get<any>(
      this.BaseUrl + `entity/selller_lists/${user_id}`,
      requestOptions
    );
  }
}
