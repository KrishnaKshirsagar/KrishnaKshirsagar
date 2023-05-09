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

  getNBFClist(nbfc_name: string, nbfc_status: string) {
    let requestOptions = {}
    if(nbfc_name.length > 0){
      const headerDict = {
        'loader_flag': 'false'
      }
      requestOptions = {                                                                                                                                                                                 
        headers: new HttpHeaders(headerDict),
      };
    }
    return this.http.get(
      this.Base_url +
        `nbfcs/get-nbfc?nbfc_name=${nbfc_name}&nbfc_status=${nbfc_status}`, requestOptions
    );
  }

  getNBFCDetailsByNBFCid(nbfcid: string) {
    return this.http.get(
      this.Base_url + `nbfcs/get-nbfc/${nbfcid}`,
      this.defaultData
    );
  }

  addNBFC(body: any) {
    return this.http.post(this.Base_url + "nbfcs/add-nbfc", {
      ...body,
      ...this.defaultData,
    });
  }

  updateNBFC(nbfcid: string, body: any) {
    return this.http.put(this.Base_url + `nbfcs/edit-nbfc/${nbfcid}`, {
      ...body,
      ...this.defaultData,
    });
  }

  // getMappingCompanies(nbfcid: string){
  //   return this.http.get(this.Base_url + `nbfcs/${nbfcid}/buyers`);
  // }

  companylistForAutoSuggestion(company_name: string): Observable<any> {
    const headerDict = {
      'loader_flag': 'false'
    }    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    //autosuggetionformap
    return this.http.get<any>(
      this.Base_url + `entity/entities?companyName=${company_name}`,
      requestOptions
    );
  }

  sellerCompanylistForAutoSuggestion(company_name: string): Observable<any> {
    const headerDict = {
      'loader_flag': 'false'
    }    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };
    //seller autosuggetionformap
    return this.http.get<any>(
      this.Base_url + `entity/entities?companyName=${company_name}`, requestOptions
    );
  }

  getNBFCCompanyMapping(nbfcid: string,filter:any) {
     let urlStr: string = this.Base_url + `nbfcs/nbfc-detail/${nbfcid}`;
     let firstEle = true;
    if (filter.seller_name) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += `seller_name=${filter.seller_name}`;
    }

    if (filter.buyer_name) {
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr += `buyer_name=${filter.buyer_name}`;
    }

    // return this.http.get<any>(
    //     urlStr,
    //     this.defaultData
    //   );

       return this.http.get<any>(
        urlStr,
      this.defaultData
    );
    }
    
   
  

  NBFCCompanyMapping(nbfcid: string, userid: string, body: any) {
    return this.http.post<any>(
      this.Base_url + `nbfcs/add-buyer/${nbfcid}/${userid}`,
      { ...body, ...this.defaultData }
    );
  }

  mapCompaniesByFileupload(file: any) {
    return this.http.post<any>(this.Base_url + `nbfcs/nbfcs-excel`, {
      ...file,
      ...this.defaultData,
    });
  }

  NBFCCompanyUnMapping(nbfcid: string, buyerid: string, sellerid: string) {
    //Un-Mapping
    const body = {
      companies: [{ buyer_id: buyerid, seller_id: sellerid }],
    };
    return this.http.post<any>(this.Base_url + `nbfcs/unmap-nbfc/${nbfcid}`, {
      ...body,
      ...this.defaultData,
    });
  }

  NBFCBuyerReconciliation(body: any) {
    return this.http.post<any>(this.Base_url + `nbfcs/fetch-nbfc`, {
      ...body,
      ...this.defaultData,
    });
  }

  downloadFile(key: string) {
    return this.http.get<any>(
      this.Base_url + `nbfcs/nbfc-load/${key}`,
      this.defaultData
    );
  }

  sendBuyerReconciliation(formData: any, nbfc_id: string){
    return this.http.post<any>(
      this.Base_url + `nbfcs/nbfc-reconcellation/${nbfc_id}`,formData
    );
  }

  get_reconcilation_history(nbfcid:string, filter:any){  
    let urlStr: string = this.Base_url + `nbfcs/${nbfcid}/get_reconcellation`;
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
    return this.http.post(this.Base_url + `nbfcs/${nbfc_id}/add_reconciliation`,body);
  }

}
