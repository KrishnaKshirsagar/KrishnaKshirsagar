import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
import { FormControl, FormGroup } from "@angular/forms";
import { ApiService } from "../../services/api/api.service";
import { formatDate } from "@angular/common";
import { AuditTrailComponent } from "../components/audit-trail/audit-trail.component";

@Component({
  selector: "app-nbfc-invoicelist",
  templateUrl: "./nbfc-invoicelist.component.html",
  styleUrls: ["./nbfc-invoicelist.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class NBFCInvoicelistComponent implements AfterViewInit {

  Date_Format = DATE_FORMAT;

  currency_Format = CURRENCY_FORMAT;

  companySelect: FormControl = new FormControl();

  displayedColumns: string[] = [
    "invoice_no",
    "seller_company_name",
    "seller_gstin",
    "buyer_company_name",
    "buyer_gstin",

    "invoice_date",
    // "invoice_amount",
    // "total_tax",
    "total_amount",
    "amount_to_be_disbursed",
    "invoice_status",
    "disburse_status",
    "repaid_amount",
    "createdAt",
    "user_consent_message",
    "actions",

  ];

  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  redirect!: string;

  private token!: string;

  private durationInSeconds = 2;

  changeText: boolean = false;

  nbfc_id!: string;

  invoice_due_in: any;

  invoice_status: any;

  selectedCompanyId: any;

  companyList!: any[];

  invoiceStatusSelection = '';

  invoice_number:string = '';

  invoiceNumberControl = new FormControl();

  gstControl = new FormControl();

  invoiceDate!: Date;

  maxDate!: Date;

  filterInvoiceByDate: any;

  toDate: any;

  fromDate: any;

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  gstuserselect = "";
  gstin: any;
  minRange: number;
  maxRange: number;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });

    const n_id = sessionStorage.getItem("nbfc_id");
    if (n_id && n_id != undefined && n_id != null) {
      this.nbfc_id = n_id;
      this.getInvoiceByNBFC_id();
    }
  }

  getTotalAmount(ele:any){
    let invoice_amount = ele && ele.invoice_amount ? ele.invoice_amount : 0;
    let total_tax = ele && ele.bill_details && ele.bill_details.gst_summary && ele.bill_details.gst_summary.total_tax ? ele.bill_details.gst_summary.total_tax : 0;
    let amount = (+invoice_amount) + (+total_tax);
    return amount > 0 ? amount : 0;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  getstatus(status: string):any {
    if(status == "Partpay"){
      return status = "Part Pay";
    } 
    if(status == "Not paid"){
      return status = "Not Paid";
    }
    else
    {
      return status = status;
    }
  }

  // gst user type
  GstUserType(){
    if ((this.gstin !== undefined || this.gstin !=="") 
    &&  (this.gstuserselect !== undefined || this.gstuserselect !=="")) {
      this.filterInvoices();
    }
  }

  getGstNo(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.gstin = filterValue.toLocaleUpperCase();
    if ((this.gstuserselect !== undefined || this.gstuserselect !=="")
    && (this.gstin !== undefined || this.gstin !=="")) {
      this.filterInvoices();
    }  
  }

  getInvoiceByNBFC_id() {
    const body = {
      id: this.nbfc_id,
    };
    this.apiService.getInvoicesByNBFC_id(body).subscribe((response: any) => {
      if (response.status == true) {
        this.dataSource = new MatTableDataSource(response.nbfc_invoices);
        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "createdAt", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    });
  }

  datefilter() {
    const start = this.dateRange.value.start;
    const end = this.dateRange.value.end;
    this.fromDate = formatDate(start, "yyyy-MM-dd", "en-US");
    this.toDate = formatDate(end, "yyyy-MM-dd", "en-US");
    this.filterInvoices();
  }

  invoices_amount_range(val:any){
    switch (val) {
      case "0_to_1L":
          this.minRange = 0;
          this.maxRange = 100000;
          break;
      case "2L_to_5L":
          this.minRange = 200000;
          this.maxRange = 500000;
          break;
      case "5L_to_25L":
          this.minRange = 500000;
          this.maxRange = 2500000;
          break;
      case "above_25L" :
          break;
  }
  this.filterInvoices();
}

  applyFilterInvoiceNo(invoiceno: any) {
    const filterValue = (invoiceno.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.invoice_number = filterValue.toLocaleUpperCase();
    this.filterInvoices();
  }

  invoice_clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.invoice_number = "";
    this.filterInvoices();
  }

  showUserConsentMsg(element: any){
    const consentMsg = element.user_consent_message ? element.user_consent_message : '';
    alert(consentMsg);
  }

  //========= invoice filter ===========

  filterInvoices(){
    let filterdata:any = {};

    if (this.invoice_number) {
      filterdata.invoice_number = this.invoice_number
    }
    if (this.invoice_status) {
      filterdata.invoice_status = this.invoice_status
    }
    if (this.toDate) {
      filterdata.to = this.toDate;
    }
    if (this.fromDate) {
      filterdata.from = this.fromDate;
    }
    if (this.gstin != "" && this.gstin) {
      filterdata.gstin = this.gstin;
    }
    if (this.gstuserselect != "" && this.gstuserselect) {
      filterdata.gstuserselect = this.gstuserselect;
    }

    if (this.minRange != undefined && this.minRange) {
      filterdata.min = this.minRange;
    }
    if (this.maxRange != undefined && this.maxRange) {
      filterdata.max = this.maxRange;
    }

    const body = {
      id: this.nbfc_id,
    };
    
    this.apiService.filterInvoices( body, filterdata).subscribe((response:any)=>{
      if (response.status == true) {
        this.dataSource = new MatTableDataSource(response.nbfc_invoices);
        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "createdAt", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
      else{
        this.dataSource = new MatTableDataSource([]);
      }
    })
  }

  openAuditTrail(invoice: any){
    this.dialog.open(AuditTrailComponent, {
      data: invoice
    })
  }

  // viewInvoice(invoicelink: any) {
  //   if (invoicelink && invoicelink != "" && invoicelink != undefined) {
  //     window.location.href = invoicelink;
  //   } else {
  //     this.snackBar.open("Unable to download the invoice file.", "Close", {
  //       duration: this.durationInSeconds * 3000,
  //       panelClass: ["error-dialog"],
  //     });
  //   }
  // }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //========= invoice filter ===========  

  companySuggetion(event:any){ 
    const filterValue = (event.target as HTMLInputElement).value;
    if(filterValue.length > 2){
      let companyName = filterValue.toLocaleUpperCase().trim();
      this.apiService.companynameAutoSuggestion(companyName).subscribe((res)=>{
        this.companyList = [...res.companies];      
      })
    }
  }

  displayFn(company: any): string {
    return company && company.company_name ? company.company_name : '';
  }

  getPosts(companyid:any){
    this.selectedCompanyId = companyid._id;
    this.filterInvoices();
  }

  invoiceStatus(invoice_status: string) {
    this.invoice_status = invoice_status;
    this.filterInvoices(); 
  }
  
  company_name_clear(ctrl:FormControl){
    ctrl.setValue('');
    this.selectedCompanyId = '';
    this.filterInvoices();
  }

  gst_clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.gstin = "";
    this.filterInvoices();
  }
}
