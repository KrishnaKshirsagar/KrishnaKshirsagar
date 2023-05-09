import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  Baseurl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getInvoices(): Observable<any> {
    return this.http.get<any>(this.Baseurl + "invoice/invoices");
  }

  deleteInvoice(
    invoiceid: string,
    userid: any,
    comment: string
  ): Observable<any> {
    return this.http.delete<any>(
      this.Baseurl + `invoice/invoices/${invoiceid}/${userid}`
    );
  }

  deleteDuplicate(userid: any, type: any) {
    console.log(type, userid);
    return this.http.delete<any>(
      this.Baseurl + `invoice/delete/${type}/${userid}`
    );
  }

  editInvoice(invoiceid: string, userid: any, body: any): Observable<any> {
    return this.http.patch<any>(
      this.Baseurl + `invoice/invoices/${invoiceid}/${userid}`,
      body
    );
  }

  // ========= filter invoices =========>
  filterInvoices(filterdata: any): Observable<any> {
    let urlStr: string = this.Baseurl + "invoice/invoices";
    let firstEle = true;
    let requestOptions = {};

    if (filterdata.invoiceNumber) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      const headerDict = {
        loader_flag: "false",
      };
      requestOptions = {
        headers: new HttpHeaders(headerDict),
      };
      urlStr += "invoice_number=" + filterdata.invoiceNumber;
    }

    if (filterdata.panuser && filterdata.panNumber) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      const headerDict = {
        loader_flag: "false",
      };
      requestOptions = {
        headers: new HttpHeaders(headerDict),
      };
      urlStr += `type=${filterdata.panuser}&&pan_number=${filterdata.panNumber}`;
    }

    if (filterdata.filterInvoiceByDate) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "invoice_date=" + filterdata.filterInvoiceByDate;
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

    if (filterdata.usertype == "nbfc" && filterdata.companyId) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "nbfc=" + filterdata.companyId;
    }

    if (filterdata.gstuser == "buyer" && filterdata.gstin) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      const headerDict = {
        loader_flag: "false",
      };
      requestOptions = {
        headers: new HttpHeaders(headerDict),
      };
      urlStr += "buyer_gst=" + filterdata.gstin;
    }

    if (filterdata.gstuser == "seller" && filterdata.gstin) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      const headerDict = {
        loader_flag: "false",
      };
      requestOptions = {
        headers: new HttpHeaders(headerDict),
      };
      urlStr += "seller_gst=" + filterdata.gstin;
    }

    if (filterdata.status) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "invoice_status=" + filterdata.status;
    }

    if (filterdata.days) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "days=" + filterdata.days;
    }

    if (filterdata.invoice_type) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      const headerDict = {
        loader_flag: "false",
      };
      requestOptions = {
        headers: new HttpHeaders(headerDict),
      };
      urlStr += "invoice_type=" + filterdata.invoice_type;
    }

    if (filterdata.disbursement_status) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      const headerDict = {
        loader_flag: "false",
      };
      requestOptions = {
        headers: new HttpHeaders(headerDict),
      };
      urlStr += "disbursement_status=" + filterdata.disbursement_status;
    }

    return this.http.get<any>(urlStr, requestOptions);
  }

  getinvoiceById(invoice_id: string): Observable<any> {
    return this.http.get<any>(
      this.Baseurl + `invoice/invoices?_id=${invoice_id}`
    );
  }

  //============ auto complete =============>
  companynameAutoSuggestion(companyName: string): Observable<any> {
    const headerDict = {
      loader_flag: "false",
    };
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.http.get<any>(
      this.Baseurl + `entity/entities?companyName=${companyName}`,
      requestOptions
    );
  }

  //============ NBFC auto suggest =========>
  nbfcnameAutoSuggestion(nbfcName: string) {
    const headerDict = {
      loader_flag: "false",
    };
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.http.get<any>(
      this.Baseurl + `nbfcs/get-nbfc?nbfc_name=${nbfcName}`,
      requestOptions
    );
  }

  //fetch credit plan by companyid(seller)
  getCreditplanByCompanyid(companyid: string) {
    return this.http.get<any>(
      this.Baseurl + `entity/${companyid}/credit-plans`
    );
  }

  // get comment invoice by id
  get_invoice_comments_by_id(invoice_id: any) {
    return this.http.get(this.Baseurl + `invoice/${invoice_id}/get-comments`);
  }

  // add comment
  add_comment(body: any) {
    return this.http.post(this.Baseurl + `invoice/add-comments`, body);
  }

  // ========== Credit Not APIs ============
  getSettledInvoicesByCreditNoteID(body: any) {
    return this.http.get(
      this.Baseurl +
        `invoice/credit-note/${body.creditnoteid}?buyer=${body.buyerid}&seller=${body.sellerid}`
    );
  }

  settleInvoicesByCreditNoteID(body: any) {
    return this.http.post(
      this.Baseurl +
        `invoice/credit-note/${body.creditnoteid}?buyer=${body.buyerid}&seller=${body.sellerid}`,
      {}
    );
  }

  // ======== Credit Note History ==========

  credit_note_history(cn_id: any) {
    return this.http.get(this.Baseurl + `invoice/credit-notes/${cn_id}`);
  }
}
