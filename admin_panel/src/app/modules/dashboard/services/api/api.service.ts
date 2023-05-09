import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

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

  getdashbord(): Observable<any> {
    return this.http.get<any>(
      this.Base_url + "ledger/mis/companies/list_of_comapaines",
      this.defaultData
    );
  }

  getTotalInvoice() {
    return this.http.get<any>(
      this.Base_url + "ledger/invoices/dashboard?type=all ",
      this.defaultData
    );
  }

  getPendingInvoice() {
    return this.http.get<any>(
      this.Base_url + "ledger/invoices/dashboard?type=all&status=Pending",
      this.defaultData
    );
  }

  getDraftInvoice() {
    return this.http.get<any>(
      this.Base_url + "ledger/invoices/dashboard?type=all&status=Draft",
      this.defaultData
    );
  }

  getTotalInvoiceAmt() {
    return this.http.get<any>(
      this.Base_url +
        "ledger/payment/dashboard?payment_type=invoice_valuation&type=all",
      this.defaultData
    );
  }

  getPaymentRecieved() {
    return this.http.get<any>(
      this.Base_url +
        "ledger/payment/dashboard?payment_type=payment_received&type=all",
      this.defaultData
    );
  }

  getPaymentDue() {
    return this.http.get<any>(
      this.Base_url +
        "ledger/payment/dashboard?payment_type=payment_due&type=all",
      this.defaultData
    );
  }

  getCompaniesOnboarded() {
    return this.http.get<any>(
      this.Base_url + "ledger/company/dashboard?type=all",
      this.defaultData
    );
  }

  getCompaniesPending() {
    return this.http.get<any>(
      this.Base_url + "ledger/company/dashboard?company_status=Hold&type=all",
      this.defaultData
    );
  }

  getNBFCOnboarded() {
    return this.http.get<any>(
      this.Base_url + "ledger/nbfc/dashboard?type=all",
      this.defaultData
    );
  }

  // =========== map ============
  getCompaniesLatLong(){
    return this.http.get<any>(
      this.Base_url + "entity/locate_entities",
      this.defaultData
    );

  }
  getTotal(){
    return  this.http.get<any>(
      this.Base_url + "/user/invoices/dashboard",
      this.defaultData
    )
  }

  getPayment(){
    return this.http.get<any>(
      this.Base_url + "/user/payment/dashboard",
      this.defaultData
    )
  }

  getInvoiceFilter(filterdata:any){
   
    let firstEle = true;
    let urlStr = this.Base_url + `user/invoices/dashboard`;

    if (filterdata.dateType) {
      if (filterdata.dateType == "DateRange") {
        if (filterdata.to && filterdata.from) {
          if (!firstEle) {
            urlStr += "&";
          } else {
            urlStr += "?";
            firstEle = false;
          }
          urlStr += `from_date=${filterdata.from}&to_date=${filterdata.to}`;
        }
      }
      else {
        if (!firstEle) {
          urlStr += "&";
        } else {
          urlStr += "?";
          firstEle = false;
        }
        urlStr += `days=${filterdata.dateType}`;
      }
    }

    if(filterdata.seller){
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }

      urlStr+=`seller=${filterdata.seller}`

    }


    console.log(urlStr)

    return this.http.get(urlStr,this.defaultData)
  }

  getPaymentFilter(filterdata:any){
    // return  this.http.get<any>(
    //   this.Base_url + `/user/invoices/dashboard?days=${filter}`,
    //   this.defaultData
    // )
    // let firstEle = true;
    let urlStr = this.Base_url + `user/payment/dashboard?`;

    if(filterdata.dateType == "DateRange"){
      if (filterdata.to && filterdata.from) {
        // if (!firstEle) {
        //   urlStr += "&";
        // } else {
        //   urlStr += "?";
        //   firstEle = false;
        // }
        urlStr += `from_date=${filterdata.from}&to_date=${filterdata.to}`;
      }
    }
    else{
        // if (!firstEle) {
        //   urlStr += "&";
        // } else {
        //   urlStr += "?";
        //   firstEle = false;
        // }
        urlStr += `days=${filterdata.dateType}`;
      }
    



    return this.http.get(urlStr,this.defaultData)
  }
  
  getRetailersDetails(){
    return this.http.get(this.Base_url+"user/retailer/dashboard",this.defaultData)
  }

  getRetailerFilter(filterData:any){

    let urlStr = this.Base_url + `user/retailers/dashboard`;
    let firstEle = true; 


    

    if(filterData.type){
      if (!firstEle) {
        urlStr += "&";
      } else {
        urlStr += "?";
        firstEle = false;
      }
      urlStr +=`type=${filterData.type}`;
    }
    return this.http.get(urlStr,this.defaultData)

  }

  getInvoiceData(){
    
    return this.http.get(this.Base_url+'user/invoice/dashboard',this.defaultData)
  }
  getPaymentData(){
    return this.http.get(this.Base_url+'user/payment/dashboard',this.defaultData)
  }

  getRetailerData(){
    return this.http.get(this.Base_url+"user/retailer/dashboard",this.defaultData)
  }

  getInvoicesData(){
    return this.http.get(this.Base_url+'user/invoices/dashboard',this.defaultData)

  }
  get_nbfc_mapped_Data(){
    return this.http.get(this.Base_url+'user/nbfcs/dashboard',this.defaultData)
    // return this.http.get('http://localhost:5004/user/nbfcs/dashboard',this.defaultData)

  }
  public exportAsExcelFile(json: any, document_type: string): void {
    switch (document_type) {
      case "overdue":
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json.overdue30);
        const worksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json.overdue60);
        const worksheet3: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json.overdue90);
        const worksheet4: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json.overdue120);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, worksheet, "Overdue 0-30");
        XLSX.utils.book_append_sheet(wb, worksheet2, "Overdue 30-60");
        XLSX.utils.book_append_sheet(wb, worksheet3, "Overdue 60-90");
        XLSX.utils.book_append_sheet(wb, worksheet4, "Overdue 90-120");

        XLSX.writeFile(wb, "Overdue.xlsx");

        break;
      case "overall":
        const overallworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json.disbursed);
        const overallworksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json.paid);
        const overallworksheet3: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json.total);
        const overall_wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(overall_wb, overallworksheet, "Disbursed");
        XLSX.utils.book_append_sheet(overall_wb, overallworksheet2, "Paid");
        XLSX.utils.book_append_sheet(overall_wb, overallworksheet3, "Total");

        XLSX.writeFile(overall_wb, "Overall.xlsx");

        break;
      case "invoice":
        const invoiceworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const invoice_wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(invoice_wb, invoiceworksheet, "Invoices");

        XLSX.writeFile(invoice_wb, "invoices.xlsx");

        break;
      case "payment":
        const paymentworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json.due);
        const paymentworksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json.received);
        const paymentworksheet3: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json.total);
        const payment_wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(payment_wb, paymentworksheet, "Due");
        XLSX.utils.book_append_sheet(payment_wb, paymentworksheet2, "Received");
        XLSX.utils.book_append_sheet(payment_wb, paymentworksheet3, "Total");

        XLSX.writeFile(payment_wb, "payment.xlsx");

        break;
      case "retailer":
        const retailerworksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json.hold);
        const retailerworksheet3: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json.approved);
        const retailerworksheet4: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json.inactive);
        const retailerworksheet5: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json.inprogress);
        const retailer_wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(retailer_wb, retailerworksheet2, "Hold");
        XLSX.utils.book_append_sheet(retailer_wb, retailerworksheet3, "Approved");
        XLSX.utils.book_append_sheet(retailer_wb, retailerworksheet4, "Inactive");
        XLSX.utils.book_append_sheet(retailer_wb, retailerworksheet5, "Inprogress");
        XLSX.writeFile(retailer_wb, "Retailers.xlsx");
        break;
      case "nbfc map":
        const nbfc_mappedWorksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const nbfc_map_wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(nbfc_map_wb, nbfc_mappedWorksheet, "NBFC MAPPED DETAILS");

        XLSX.writeFile(nbfc_map_wb, "Mapping data.xlsx");
        break;
      default:
        break;
    }

  }
 
}

