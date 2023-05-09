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
  defaultData: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  getPaymentHistory(nbfc_id:string) {
    return this.http.get(
      this.BaseUrl +`payment/transctionshistory/nbfc/${nbfc_id}`,
      this.defaultData
    );
  }

  getDisbursedInvoices(nbfc_id:string, invoice_number?:string){
    const headerDict = {
      loader_flag: "false",
    };
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    
    if(invoice_number){
      return this.http.get<any>(
        this.BaseUrl + `nbfcs/suggesion/${nbfc_id}/invoice/invoice_disbursement?invoice_number=${invoice_number}`
      );
    }
    else{
      return this.http.get<any>(
        this.BaseUrl + `nbfcs/suggesion/${nbfc_id}/invoice/invoice_disbursement`,
        requestOptions
      );
    }
  }

  filterPaymentHistory(filterdata: any,nbfc_id:string): Observable<any> {
    let requestOptions = {};
    let urlStr: string = this.BaseUrl +`payment/transctionshistory/nbfc/${nbfc_id}`;
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

    //console.log(urlStr)
    return this.http.get<any>(urlStr, requestOptions);
  }

  getNBFCDetailsByNBFCid(nbfc_id: string){
    return this.http.get(
      this.BaseUrl + `nbfcs/get-nbfc/${nbfc_id}`
    );
  }

  getInvoicesByNBFC_id(body: any) {
    return this.http.get(
      this.BaseUrl + `nbfcs/${body.id}/nbfc-invoices`
    );
  }

  analyseBankStatement(companyid: string){
    return this.http.get(this.BaseUrl +`kyc/${companyid}/company_download`);
  }

  download_audittrail(invoiceid: string){
    return this.http.get(this.BaseUrl + `invoice/${invoiceid}/audit-trail/download`);
  }

  companynameAutoSuggestion(companyName:any):Observable<any> {
    const headerDict = {
      'loader_flag': 'false'
    }    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict),
    };
    return this.http.get<any>(
      this.BaseUrl+`entity/entities?companyName=${companyName}`, requestOptions
    );
  }

  uploadExcelFile(file: any){
    const formData: FormData = new FormData();
      formData.append('file', file);
    return this.http.post<any>(this.BaseUrl+`invoice/upload-invoice-excel`, formData);
  }
  
  filterInvoices(body:any, filterdata:any){
    let requestOptions = {};
    let urlStr: string = this.BaseUrl + `nbfcs/${body.id}/nbfc-invoices`;
    let firstEle = true;

    if (filterdata.invoice_status) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "invoice_status=" + filterdata.invoice_status;
    }

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

    if (filterdata.to && filterdata.from) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "from=" + filterdata.from + "&to="+filterdata.to;
    }

    if ((filterdata.gstuserselect == "seller") && (filterdata.gstin)) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "seller_gst=" + filterdata.gstin;
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
    }

    if ((filterdata.gstuserselect == "buyer") && (filterdata.gstin)) {
      if (!firstEle)
       {
        urlStr += "&";
       } 
      else 
      {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "buyer_gst=" + filterdata.gstin;
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
    }

    if ((filterdata.min) && (filterdata.max)) {

      if (!firstEle)
       {
        urlStr += "&";
       } 
      else 
      {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "min=" + filterdata.min + "&max=" + filterdata.max;
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
    }

    return this.http.get<any>(urlStr, requestOptions);
  }

  nbfc_mapped_byuer(collection_id : string, filter:any){
    let urlStr: string = this.BaseUrl + `/nbfcs/nbfc-detail/${collection_id}`;
    let firstEle = true;
    let requestOptions = { };

    if (filter.buyer_Name) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += `buyer_name=${filter.buyer_Name}`;
    }

    if ((filter.toDate) && (filter.fromDate)) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += `from=${filter.fromDate}&to=${filter.toDate}`;
    }

    if (filter?.minRange && filter?.maxRange) {
     if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      } 
       
      if (filter.minRange !== "min" && filter.maxRange !== "max") {

        urlStr += `min=${filter.minRange}&max=${filter.maxRange}`;
      }
      else
      {
        urlStr += `creditLimit=above25L`;
      }
    }
    return this.http.get(urlStr);
  }

  getCompanyDetailsById(companyid: string){
    return this.http.get<any>(
      this.BaseUrl + `entity/entity/${companyid}`,
      this.defaultData
    );
  }

  updateCompanyDetails(companyid: string, companyDetail: any): Observable<any> {
    return this.http.patch<any>(
      this.BaseUrl + `entity/update-entity/${companyid}`,
      { ...companyDetail, ...this.defaultData }
    );
  }

  getkycDetails(data: any) {
    return this.http.post(this.BaseUrl + "kyc/kyc-approval", {
      ...data,
      ...this.defaultData,
    });
  }

  get_payout_history(nbfcid:string){
    return this.http.get(this.BaseUrl + `nbfcs/${nbfcid}/get_disbursement`);
  }

  get_disbursement(nbfcid:string,filter:any){
    let urlStr: string = this.BaseUrl + `nbfcs/${nbfcid}/get_disbursement`;
    let firstEle = true;
    let requestOptions = {};

    if (filter.invoice_number) {
      if (!firstEle)
       {
        urlStr += "&";
       } 
      else 
      {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "invoice_number=" + filter.invoice_number;
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
    }

    if ((filter.gstuser == "seller") && (filter.gstin)) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "seller_gst=" + filter.gstin;
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
    }

    if ((filter.gstuser == "buyer") && (filter.gstin)) {
      if (!firstEle)
       {
        urlStr += "&";
       } 
      else 
      {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "buyer_gst=" + filter.gstin;
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
    }

    if (filter.payment_status) {
      if (!firstEle)
       {
        urlStr += "&";
       } 
      else 
      {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "payment_status=" + filter.payment_status;
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
    }

    if (filter.max) {
      if (filter.min && filter.max) 
      {
         if (!firstEle)
         {
          urlStr += "&";
         } 
        else 
        {
          urlStr += "?";
          firstEle = false;
        }
        urlStr += "min=" + filter.min + "&max=" + filter.max;
         
      }
      else
      {    
        if (!firstEle)
        {
         urlStr += "&";
        } 
       else 
       {
         urlStr += "?";
         firstEle = false;
       }
       urlStr += "min=" + 0 + "&max=" + filter.max;  
      }
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
    }
    
    return this.http.get(urlStr);
  }

  get_reconcilation_history(nbfcid:string, filter:any){  
    let urlStr: string = this.BaseUrl + `nbfcs/${nbfcid}/get_reconcellation`;
    let firstEle = true;
    let requestOptions = { };

    if ((filter.toDate) && (filter.fromDate)) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += `from=${filter.fromDate}&to=${filter.toDate}`;
    }

    if (filter.gstin) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "seller_gst=" + filter.gstin;
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
    }

    if (filter.max) {
      if (filter.min && filter.max) 
      {
         console.log("min max");
         if (!firstEle)
         {
          urlStr += "&";
         } 
        else 
        {
          urlStr += "?";
          firstEle = false;
        }
        urlStr += "min=" + filter.min + "&max=" + filter.max;
         
      }
      else
      {    
        if (!firstEle)
        {
         urlStr += "&";
        } 
       else 
       {
         urlStr += "?";
         firstEle = false;
       }
       urlStr += "min=" + 0 + "&max=" + filter.max;  
      }
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
    }

    if (filter.invoiceNumber) {
      if (!firstEle)
       {
        urlStr += "&";
       } 
      else 
      {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "invoice_number=" + filter.invoiceNumber;
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
    }

    if (filter.utr_id) {
      if (!firstEle)
       {
        urlStr += "&";
       } 
      else 
      {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "utr_id=" + filter.utr_id;
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
    }

    if (filter.transaction_id) {
      if (!firstEle)
       {
        urlStr += "&";
       } 
      else 
      {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += "transaction_id=" + filter.transaction_id;
      const headerDict = {
        'loader_flag': 'false'
      }    
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict), 
      };
    }

    
    return this.http.get(urlStr);
  }

  add_reconcilation(nbfc_id:any,body:any){
    return this.http.post(this.BaseUrl + `nbfcs/${nbfc_id}/add_reconciliation`,body);
  }

  // KYC

  getkyc(company_id:any){
    return this.http.get(this.BaseUrl + `kyc/${company_id}/document`)
 }

 getAllKycDocuments(company_id:any){
  return this.http.get(this.BaseUrl + `kyc/${company_id}/download`);
}
}
