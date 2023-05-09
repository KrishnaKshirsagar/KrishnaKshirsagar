import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
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

  getInvoicesByCompanyId(body: any) {
    return this.http.get(
      this.BaseUrl + `invoice/search-invoice/${body.id}/${body.type}`
    );
  }

  changeInvoiceStatus(invoiceStatus: any) {
    return this.http.patch(this.BaseUrl + `invoice/status`, invoiceStatus);
  }

  companynameAutoSuggestion(companyName: any): Observable<any> {
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

  uploadExcelFile(file: any){
    const formData: FormData = new FormData();
      formData.append('file', file);
    return this.http.post<any>(this.BaseUrl+`invoice/upload-invoice-excel`, formData);
  }

  filterInvoices(body: any, filterdata: any): Observable<any> {
    let user_id = sessionStorage.getItem("userid");
    const headerDict = {
      loader_flag: "false",
    };
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    let urlStr: string =
    this.BaseUrl + `invoice/search-invoice/${body.id}/${body.type}`;
    let firstEle = true;
    if (body.id == "All") {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "user_id=" + user_id;
    }
    if (filterdata.type == "buyer" && filterdata.companyid != undefined) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "buyer=" + filterdata.companyid;
    }

    if (filterdata.type == "seller" && filterdata.companyid != undefined) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "seller=" + filterdata.companyid;
    }

    if (filterdata.invoice_status) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "invoice_status=" + filterdata.invoice_status;
    }

    if (filterdata.invoice_due_in) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "days=" + filterdata.invoice_due_in;
    }

    if (filterdata.invoice_type) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "invoice_type=" + filterdata.invoice_type;
    }

    if (filterdata.disbursement_status) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "disbursement_status=" + filterdata.disbursement_status;
    }

    return this.http.get<any>(urlStr, requestOptions);
  }

  // comment add in admin comment history
  add_comment(body: any) {
    return this.http.post(this.BaseUrl + `invoice/add-comments`, body);
  }

  //invoice format download option
  invoiceFormat() {
    const headers = new HttpHeaders({
      Accept: "text/csv",
    });
    let urlStr: string = this.BaseUrl + "invoice/get-invoiceformat";
    return this.http.get(urlStr);
  }

  show_uploaded_history(seller_id : any){
    return this.http.get(this.BaseUrl + `/invoice/invoice-upload-history/${seller_id}`)
  }
}
