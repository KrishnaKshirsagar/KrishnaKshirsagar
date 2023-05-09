import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class ApiService {
  BaseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getOverdueInvoices(filter?:any): Observable<any> {
    let urlStr: string = this.BaseUrl + 'collection/invoices';
    let firstEle = true;

    if (filter.invoice_number) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr+=`invoice_number=${filter.invoice_number}`
    }

    if (filter.buyer) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr+=`buyer_name=${filter.buyer}`
    }

    if (filter.seller) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr+=`seller_name=${filter.seller}`
    }

    if (filter.invoice_status) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr+=`invoice_status=${filter.invoice_status}`
    }

    if (filter.collection_status) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr+=`collection_status=${filter.collection_status}`
    }

    return this.http.get(urlStr);
  }

  getOverdueInvoiceDetailsById(collection_id: string){
    return this.http.get(this.BaseUrl + `collection/invoices/${collection_id}`);
  }

  updateOverDueInvoice(body:any,buyer_id:string):Observable<any>{
      return this.http.patch<any>(this.BaseUrl + `collection/company/${buyer_id}`,body);
  }

  getPaymentHistory(body:any):Observable<any>{
    return this.http.get<any>(this.BaseUrl +`collection/invoices/paymenthistory?buyer=${body.buyer_id}`);
  }
  
  getCollectionStaff():Observable<any>{
    return this.http.get<any>(this.BaseUrl + `collection/userlist`);
  }

  waiverPayment(body:any){
      return this.http.post(this.BaseUrl + `collection/wavers/payment`,body)
  }

  getwaiverPaymentHistory(buyer_id:string){
    return this.http.get(this.BaseUrl + `collection/company/${buyer_id}/waiver_history`);
    
  }

  retailerOverdueInvoices(filter : any)
  {
    let urlStr : string =  this.BaseUrl + 'collection/companies';
    let firstEle = true;

    if (filter.buyer) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr+=`buyer_name=${filter.buyer}`
    }
     return this.http.get(urlStr)      
  }

  collectionInv(retailer_id : any){
      return this.http.get(this.BaseUrl + `collection/companies/${retailer_id}`)
  }

  getSellerlistByBuyerid(buyer_id : any){
     return this.http.get(this.BaseUrl + `collection/get_seller?buyer=${buyer_id}`)
  }

  collection_summry(data : any){
    let urlStr: string = this.BaseUrl + `collection/summary?buyer=${data.buyer_id}`;
    
    if (data.seller_id ) {
        urlStr += `&seller=${data.seller_id}`
     }

     if (data.waiver ) {
      urlStr += `&waver=${data.waiver}`
     }

     if(data.pay_amount){
      urlStr += `&pay_amount=${data.pay_amount}`
     }
     
     return this.http.get(urlStr);
  }
}
