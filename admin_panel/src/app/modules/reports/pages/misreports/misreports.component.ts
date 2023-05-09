import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DATE_FORMAT } from 'src/app/shared/constants/constants';
import { formatDate } from '@angular/common';


export interface State {
  name: string;
}
@Component({
  selector: 'app-misreports',
  templateUrl: './misreports.component.html',
  styleUrls: ['./misreports.component.scss'],
  providers: [],
})
export class MisreportsComponent implements AfterViewInit {

  showdaterange = "";
  public showreport = "irr";
  mis_downloaded_date = new Date().toLocaleDateString();
  selection = "";
  maxDate!: any;

  fromDate!: any;

  toDate!: any;
  selectText!: any;
  csvData!: any;

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  Company_mis_select = "";
  invoice_mis_select = "";
  User_mis_select = "";
  nbfc_mis_select = "";
  kyc_mis_select = "";
  collection_mis_select = "";
  whatsapp_select = "";
  company_Name!: any[];
  selectedCompanyId: any;
  companyname!: string;
  durationInSeconds = 2;

  companyNumberControl = new FormControl();

  ngAfterViewInit() {}

  constructor(private apiService: ApiService, public snackBar: MatSnackBar) {}

  ngOnInit(): void {
    if (this.showreport == "irr") {
      this.User_mis_select = "";
      this.invoice_mis_select = "";
      this.nbfc_mis_select = "";
      this.collection_mis_select = "";
      this.whatsapp_select = "";
      this.showdaterange = "";
      this.Company_mis_select = "";
      this.whatsapp_select = "";
      this.selection = "";
      this.kyc_mis_select = "";
      this.fromDate = "";
      this.toDate = "";
      this.dateRange = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
      });
    }
  }

  radiobuttonChange() {
      this.User_mis_select = "";
      this.invoice_mis_select = "";
      this.Company_mis_select = "";
      this.nbfc_mis_select = "";
      this.collection_mis_select = "";
      this.whatsapp_select = "";
      this.showdaterange = "";
      this.selection = "";
      this.kyc_mis_select = "";
      this.fromDate = "";
      this.toDate = "";
      this.dateRange = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
      });
  }

  // ====== user type dropdwon and auto suggetion =======

  companySuggetion(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2) {
      let companyName = filterValue.toUpperCase();
      this.apiService
        .companynameAutoSuggestion(companyName)
        .subscribe((res) => {
          this.company_Name = [...res.companies];
        });
    }
  }

  nbfcSuggetion(event: any){
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2) {
      let companyName = filterValue.toUpperCase();
      this.apiService
      .nbfcAutoSuggestion(companyName)
      .subscribe((res) => {
        this.company_Name = [...res.get_nbfc];
      });
    }
  }

  displayFn(company: any): any {
    if (company?.company_name) {
      return company && company.company_name ? company.company_name : "";
    }

    if (company?.nbfc_name) {
      return company && company.nbfc_name ? company.nbfc_name : "";
    }
    
  }

  getPosts(event: any) {
    this.selectedCompanyId = event._id;
    this.companyname = event.company_name;
  }

  // ========== date range filter ==============>

  dateRangeVal() {
    let start = this.dateRange.value.start;
    let end = this.dateRange.value.end;

    this.fromDate = formatDate(start, "yyyy-MM-dd", "en-US");
    this.toDate = formatDate(end, "yyyy-MM-dd", "en-US");
  }

  // ============== MIS Report =============

  selectChange(event: any) {
    if (event !== 'invoicesbyduedate') {
      this.maxDate = new Date();
    }
    else{
      this.maxDate = '';
    }

    this.showdaterange = "";
    this.fromDate = "";
    this.toDate = "";
    this.clear(this.companyNumberControl);
    this.dateRange = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });
  }

  // ========== Company MIS Report ============

  companies_misReport() {
    let filterdata = {
      misReportSelect: this.Company_mis_select,
      dateType: this.showdaterange,
      from: this.fromDate,
      to: this.toDate,
     // userType: this.selection,
      id: this.selectedCompanyId,
    };

    if (!filterdata.misReportSelect && !filterdata.dateType) {
      this.snackBar.open("Please select report and date", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
    else if (!filterdata.misReportSelect) {
      this.snackBar.open("Please select report", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
    else if (
       filterdata.misReportSelect == "companiesonboarded" 
    || filterdata.misReportSelect == "companiesapproved" 
    || filterdata.misReportSelect == "companiespending"
    || filterdata.misReportSelect == "companiesupdated"
    || filterdata.misReportSelect == "companies_not_done_payment"
    || filterdata.misReportSelect == "companies_with_no_invoices"
    || filterdata.misReportSelect == "companies_with_no_invoices_upload" 
    || filterdata.misReportSelect == "companiesphonebook" 
    ) {
    
    if (!filterdata.dateType){
      this.snackBar.open("Please select date", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
    else if((this.showdaterange == "DateRange") && (!this.fromDate && !this.toDate)){
      this.snackBar.open("Please select date range", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
    else{
      this.apiService.companymisReport(filterdata).subscribe((res: any) => {
        if (res.status == true) {
          window.open(res.url);
        }
        if (res.status == false) {
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      });
    } 
   }
   else{
    this.apiService.companymisReport(filterdata).subscribe((res: any) => {
     if (res.status == true) {
        window.open(res.url);
      }

      if (res.status == false) {
        this.snackBar.open(res.message, "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
      
    })
   }
  }

  //========== Invoice MIS Report ============

  invoices_misReport() {
    let filterdata = {
      misReportSelect: this.invoice_mis_select,
      dateType: this.showdaterange,
      from: this.fromDate,
      to: this.toDate,
      userType: this.selection,
      id: this.selectedCompanyId,
    };
    
    
   if (!filterdata.misReportSelect) {
      this.snackBar.open("Please select report", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }

    else if( filterdata.misReportSelect !== "consolidatedinvoices" ){
      if (!filterdata.misReportSelect && !filterdata.dateType) {
        this.snackBar.open("Please select report and date", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
      
      else if (!filterdata.misReportSelect) {
        this.snackBar.open("Please select report", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
      else if (!filterdata.dateType) {
        this.snackBar.open("Please select date", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
      else if (!filterdata.userType){
        this.snackBar.open("Please select user type", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }

      else if (!filterdata.id){
        this.snackBar.open("Please select user", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
      
       else if((filterdata.dateType == "DateRange") && (!this.fromDate && !this.toDate)){
        this.snackBar.open("Please select date range", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }

      else{
        this.apiService.companymisReport(filterdata).subscribe((res: any) => {
          if (res.status == true) {
            window.open(res.url);
          }
          if (res.status == false) {
            this.snackBar.open(res.message, "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
      } 
    }
    
    else{
      this.apiService.invoicemisReport(filterdata).subscribe((res: any) => {
        if (res.status == true) {
          window.open(res.url);
        }     
        if (res.status == false) {
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      });
    }
  }

  //==========   User MIS Report  ============

  users_misRrport() {
    let filterdata = {
      misReportSelect: this.User_mis_select,
      dateType: this.showdaterange,
      from: this.fromDate,
      to: this.toDate,
    };
    
    if (!filterdata.misReportSelect) {
      this.snackBar.open("Please select report", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
    if (filterdata.misReportSelect  !== "users_with_last_not_login_15days" && filterdata.misReportSelect  !== "users_virtual_account") {
      if (!filterdata.misReportSelect && !filterdata.dateType) {
        this.snackBar.open("Please select report and date", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
      
      else if (!filterdata.misReportSelect) {
        this.snackBar.open("Please select report", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
      else if (!filterdata.dateType) {
        this.snackBar.open("Please select date", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
       else if((filterdata.dateType == "DateRange") && (!this.fromDate && !this.toDate)){
        this.snackBar.open("Please select date range", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }

      else{
        this.apiService.usersReport(filterdata).subscribe((res: any) => {
        if (res && res.status == true) {
          window.open(res.url);
        } 
        else {
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      });
      }
    }
    else
    {
      this.apiService.usersReport(filterdata).subscribe((res: any) => {
        if (res && res.status == true) {
          window.open(res.url);
        } 
        else {
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      });
    }
  }
  
  //=========    NBFC MIS Report  ============
  nbfc_misRrport() {
    let filterdata = {
      misReportSelect: this.nbfc_mis_select,
      dateType: this.showdaterange,
      from: this.fromDate,
      to: this.toDate,
      nbfc_id: this.selectedCompanyId
    };
    if (filterdata.misReportSelect == "disbursments_statements") {
      this.apiService.nbfcmisReport(filterdata).subscribe((res:any)=>{
        if (res.status == true) {
          window.open(res.url)
        }
        else{
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      })   
    }

    else{
      if (!filterdata.misReportSelect && !filterdata.dateType) {
        this.snackBar.open("Please select report and date", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
      else if (!filterdata.misReportSelect) {
        this.snackBar.open("Please select report", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
      else if (!filterdata.dateType) {
        this.snackBar.open("Please select date", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
     else
     {
      this.apiService.nbfcmisReport(filterdata).subscribe((res: any) => {
        if (res && res.status == true && res.nbfc_onboarding) {
          this.csvData = [...res.nbfc_onboarding];
          const selectedText = this.selectText;
          let dateType = this.showdaterange;
          let title = "";
    
            if (dateType == "DateRange") {
              dateType = `from=${filterdata.from}&to=${filterdata.to}`;
              title = `MIS Report - ${selectedText} \nFilter By Date-${dateType}`
            }
            else {
              if (dateType == "10days") 
              title = `MIS Report - ${selectedText}  \nFilter By Date- Last 10 Days`;
              else
              title = `MIS Report - ${selectedText}  \nFilter By Date-${dateType}`;
            }
  
          var options = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: false,
            showTitle: true,
            title: title,
            useBom: true,
            // noDownload: true,
            headers: [
              "NBFC Name",
              "Address",
              "Email",
              "Mobile Number",
              "Status",
              "Created At",
            ],
          };
          new ngxCsv(
            this.csvData,
            `NBFC_MIS_Report_ ${this.mis_downloaded_date}`,
            options
          );
        }
        if (res && res.status == true && res.nbfc_mappped) {
          this.csvData = [...res.nbfc_mappped];
          const selectedText = this.selectText;
          let dateType = this.showdaterange;
          if (dateType == "DateRange") {
            dateType = `from=${filterdata.from}&to=${filterdata.to}`;
          }
          var options = {
            fieldSeparator: ",",
            quoteStrings: '"',
            decimalseparator: ".",
            showLabels: false,
            showTitle: true,
            title: `MIS Report - ${selectedText} \nFilter By Date-${dateType}`,
            useBom: true,
            // noDownload: true,
            headers: [
              "Buyer Name",
              "Seller Name",
              "Mapped By",
              "NBFC Name",
              "Status",
              "Created At",
            ],
          };
          new ngxCsv(
            this.csvData,
            `NBFC_MIS_Report_ ${this.mis_downloaded_date}`,
            options
          );
        }
        if (res.status == true && res.url) {
           window.open(res.url)
        }
        if (res.status == false) {
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      });
     }
    } 
  }
  //=========  Collection MIS Report =========
  collection_misReport(){
    const status = this.collection_mis_select;
    if(this.collection_mis_select && this.collection_mis_select!= null && 
      this.collection_mis_select!= undefined && this.collection_mis_select!= "")
    {
      this.apiService.collection_misReport(status).subscribe((res: any) => {
        if (res && res.status == true) {
          window.open(res.url);
        }
        else {
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      });
    }else {
      this.snackBar.open("Please select collection status", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
  }

  //=======   KYC MIS Report =========
  kyc_misReport(){
    let filterdata = {
      misReportSelect: this.kyc_mis_select,
      dateType: this.showdaterange,
      from: this.fromDate,
      to: this.toDate,
    };

    if (!filterdata.misReportSelect && !filterdata.dateType) {
      this.snackBar.open("Please select report and date", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
    else if (!filterdata.misReportSelect) {
      this.snackBar.open("Please select report", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
    else if (!filterdata.dateType) {
      this.snackBar.open("Please select Date", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
    else if((filterdata.dateType == "DateRange") && (!filterdata.from && !filterdata.to)){
      this.snackBar.open("Please select date range", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
    else{
      this.apiService.kyc_misReport(filterdata).subscribe((res:any)=>{
        if (res.status == true) {
          window.open(res.url);
        }
        else{
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      })
    }
  }

  //=========    Whatsapp Reports  ============
  whatsapp_reports(){
    let filterdata = {
      whatsappSelect: this.whatsapp_select,
      dateType: this.showdaterange,
      from: this.fromDate,
      to: this.toDate,
    };

    if (!filterdata.whatsappSelect) {
      this.snackBar.open("Please select report", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
      console.log("Please select report");
    }

    else{

      if (!filterdata.dateType){
        this.snackBar.open("Please select date", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
      else if((this.showdaterange == "DateRange") && (!this.fromDate && !this.toDate)){
        this.snackBar.open("Please select date range", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
      else{
        this.apiService.whatsappReport(filterdata).subscribe((res: any) => {
          console.log(res);
          if (res.status == true) {
            window.open(res.url);
          }
          if (res.status == false) {
            this.snackBar.open(res.message, "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
      } 
     }

  }

  clear(ctrl: FormControl){
    ctrl.setValue("");
    this.selectedCompanyId = "";
    this.company_Name = []
  }

}

@Component({
  selector: "misreports-dialog",
  templateUrl: "misreports-dialog.html",
  styleUrls: ["./misreports.component.scss"],
})
export class MisreportsDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}
