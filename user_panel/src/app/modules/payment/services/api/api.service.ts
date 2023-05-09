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

  getSellerlistByBuyerid(companyid: string) {
    return this.http.get(
      this.BaseUrl + `payment/get_seller?buyer=${companyid}`
    );
  }

  getPaymentDetails(companyid: string, sellerid: string) {
    return this.http.get(
      this.BaseUrl + `payment/summary?buyer=${companyid}&seller=${sellerid}`
    );
    // return this.http.get(
    //   this.BaseUrl + `invoice/paymentsummary?buyer=${companyid}&seller=${sellerid}`
    // );
  }

  getPaymentDetailsAtSettleAmt(companyid: string, sellerid: string, amt: any) {
    return this.http.get(
      this.BaseUrl +
        `payment/summary?buyer=${companyid}&seller=${sellerid}&pay_amount=${amt}`
    );
  }

  // ===============================================================

  calculatedInterest(companyid: string, invoiceData: any) {
    return this.http.post(
      this.BaseUrl + `invoice/interest?buyer=${companyid}`,
      invoiceData
    );
  }

  calculateDiscount(companyid: string, invoiceid: string) {
    return this.http.get(
      this.BaseUrl + `entity/${companyid}/invoices/${invoiceid}/discounts`
    );
  }

  paynow(paymentDetails: any) {
    //  return this.http.post(
    //    this.BaseUrl + "payment/send-payment",
    //    paymentDetails
    //  );

    return this.http.post(
      this.BaseUrl + "payment/vouch_payment",
      paymentDetails
    );
  }

  paylater(exd_data: any) {
    return this.http.post(this.BaseUrl + "payment/extendcredit", exd_data);
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

  fetchPaymentHistory(companyid: string, filterdata: any, seller_flag: string) {
    let requestOptions = {};
    var urlStr = "";
    if (seller_flag == "true") {
      urlStr = this.BaseUrl + `payment/transctionshistory?seller=${companyid}`;
    } else {
      urlStr = this.BaseUrl + `payment/transctionshistory?buyer=${companyid}`;
    }
    if (filterdata.user_id) {
      const headerDict = {
        loader_flag: "false",
      };
      requestOptions = {
        headers: new HttpHeaders(headerDict),
      };
      urlStr += "&user_id=" + filterdata.user_id;
    }
    if (filterdata.invoice_number) {
      const headerDict = {
        loader_flag: "false",
      };
      requestOptions = {
        headers: new HttpHeaders(headerDict),
      };
      urlStr += "&invoice_number=" + filterdata.invoice_number;
    }

    if (filterdata.invoice_date) {
      urlStr += "&invoice_date=" + filterdata.invoice_date;
    }
    if (filterdata.payment_date) {
      urlStr += "&createdAt=" + filterdata.payment_date;
    }
    if (filterdata.seller) {
      urlStr += "&seller=" + filterdata.seller;
    }
    if (filterdata.buyer) {
      urlStr += "&buyer=" + filterdata.buyer;
    }
    return this.http.get<any>(urlStr, requestOptions);
  }

  fetchEmandateHistory(companyid: string) {
    return this.http.get(
      this.BaseUrl + `payment/payhistory?buyer_id=${companyid}`
    );
  }

  fetchPaymentHistoryByInvoiceNumber(invoice: string) {
    const headerDict = {
      loader_flag: "false",
    };
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.http.get<any>(
      this.BaseUrl + `payment?invoiceNumber=${invoice}`,
      requestOptions
    );
  }

  fetchpaymentByInvoiceDate(invoicedate: any): Observable<any> {
    return this.http.get<any>(
      this.BaseUrl + `payment?invoiceDate=${invoicedate}`
    );
  }

  // ============= CIH History ================payment/cih_history?type=admin
  getCIHHistory(companyid: string, filterdata: any) {
    return this.http.get<any>(
      this.BaseUrl + `payment/cih_history?type=buyer&buyer=${companyid}`
    );
  }
}
