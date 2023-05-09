import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ApiService } from "../../services/api/api.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
import { map, Observable, startWith } from "rxjs";
import { formatDate } from "@angular/common";
import { animate, state, style, transition, trigger } from "@angular/animations";

// export interface SearchResponse {
//   settle: string;
//   discount: string;
//   interest: string;
//   GST: string;
// }
@Component({
  selector: "app-paymenthistory",
  templateUrl: "./payment-history.component.html",
  styleUrls: ["./payment-history.component.scss"],
  providers: [],
  // animations: [
  //   trigger('detailExpand', [
  //     state('collapsed', style({height: '0px', minHeight: '0'})),
  //     state('expanded', style({height: '*'})),
  //     transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  //   ]),
  // ],
})
export class PaymenthistoryComponent implements AfterViewInit {

  Date_Format = DATE_FORMAT;

  Currency_Format = CURRENCY_FORMAT;

  invoiceDate!: Date;

  paymentDate!: any;

  invoiceStatus:any;


  maxDate!: Date;

  nbfc_id: string;

  companySelect: FormControl = new FormControl();

  invoiceControl : FormControl = new FormControl();

  company_Name!: any;

  userType = "";

  selectedCompanyId: any;
  displayedColumns: string[] = [
    "orderid",
    "sellername",
    "buyername",
    "created_at",
    "invoiceno",
    "amountpaid",
    "discount",
    "interest",
    "settledamount",
    "payment_mode",
    "status",
    "totalorderamount",
    ];
  // expandedElement!: SearchResponse | null;

  dataSource = new MatTableDataSource([]);
  invoiceNumber: any;
  status_invoice: any;
  // filterInvoiceByDate: any;
  // formatDate!: string;
  invoiceFormatDate!: string;
  paymentFormatDate!: string;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private apiservice: ApiService,
  ) {}

  ngOnInit(): void {
    const nbfc_id = sessionStorage.getItem("nbfc_id");
    if (nbfc_id && nbfc_id != undefined && nbfc_id != null) {
      this.nbfc_id = nbfc_id;
    }
    this.getPaymentHistory();
    this.maxDate = new Date();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  getPaymentHistory() {
    this.apiservice.getPaymentHistory(this.nbfc_id).subscribe((response: any) => {
      console.log(this.nbfc_id);
      if (response && response.nbfc_payment_history) {
        console.log(response);
        const paymenthistory = response.nbfc_payment_history
          ? response.nbfc_payment_history
          : [];
        this.dataSource = new MatTableDataSource(paymenthistory);
        this.dataSource.paginator = this.paginator;
        
        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "payment_date", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    });
  }

// =============== payment filter ===============

filterPaymentHistory() {
  let filterdata: any = [];
  if (this.invoiceNumber) {
    filterdata["invoiceNumber"] = this.invoiceNumber;
  }
  if (this.status_invoice) {
    filterdata["status_invoice"] = this.status_invoice;
  }
  if (this.invoiceFormatDate) {
    filterdata["invoice_date"] = this.invoiceFormatDate;
  }
  if (this.paymentFormatDate) {
    filterdata["payment_date"] = this.paymentFormatDate;
  }
  if (this.userType !== undefined && this.userType !== "") {
    filterdata["usertype"] = this.userType;
  }
  if (this.selectedCompanyId !== undefined && this.userType !== "") {
    filterdata["companyId"] = this.selectedCompanyId;
  }
  //console.log(filterdata);
  this.apiservice
    .filterPaymentHistory(filterdata,this.nbfc_id)
    .subscribe((response: any) => {
      if (response && response.nbfc_payment_history) {
        const paymenthistory = response.nbfc_payment_history
          ? response.nbfc_payment_history
          : [];
        this.dataSource = new MatTableDataSource(paymenthistory);
        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "payment_date", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      } else {
        this.dataSource = new MatTableDataSource([]);
      }
    });
}

filterbyinvoice(invoiceno: any) {
  const filterValue = (invoiceno.target as HTMLInputElement).value
    .trim()
    .toLocaleLowerCase();
  this.invoiceNumber = filterValue.toLocaleUpperCase();
  this.filterPaymentHistory();
}

invoicesStatus(status_invoice:any){
  this.status_invoice=status_invoice;
  this.filterPaymentHistory();
}

invoicedate() {
  this.invoiceFormatDate = formatDate(
    this.invoiceDate,
    "yyyy-MM-dd",
    "en-US"
  );
  this.filterPaymentHistory();
}

paymentDateFilter() {
  this.paymentFormatDate = formatDate(
    this.paymentDate,
    "yyyy-MM-dd",
    "en-US"
  );
  this.filterPaymentHistory();
}

companySuggetion(event: any) {
  const filterValue = (event.target as HTMLInputElement).value;
  if (filterValue.length > 2) {
    let companyName = filterValue.toUpperCase();
    this.apiservice
      .companynameAutoSuggestion(companyName)
      .subscribe((res) => {
        this.company_Name = [...res.companies];
      });
  }
}

displayFn(company: any): string {
  return company && company.company_name ? company.company_name : "";
}

// getuser type
getUserType(){
  this.userType = this.userType; 
   if ((this.userType !== undefined || this.userType !== "")
    && (this.selectedCompanyId !== undefined || this.selectedCompanyId !== "")) 
    {
      this.filterPaymentHistory();
    }
}

getPosts(companyid: any) {
  this.userType = this.userType;
  this.selectedCompanyId = companyid._id;
  if ((this.selectedCompanyId !== undefined || this.selectedCompanyId !== "")
  && (this.userType !== undefined || this.userType !== "")) {
     this.filterPaymentHistory();
  }
}

// clear search boxes
invoiceNumberControl = new FormControl("");

clear(ctrl: FormControl) {
  ctrl.setValue("");
  this.invoiceNumber = "";
  this.filterPaymentHistory();
}

invoiceclear(ctrl:FormControl){
  ctrl.setValue("");
  this.invoiceNumber = "";
  this.filterPaymentHistory()
}

company_name_clear(ctrl: FormControl) {
  ctrl.setValue("");
  // this.selection = '';
  this.company_Name = [];
  this.userType = "";
  this.selectedCompanyId = "";
  this.filterPaymentHistory();
}

date_cancle(date : any){
  if (date == "payment_date") {
    this.paymentFormatDate = "";
    this.paymentDate = "";
    this.filterPaymentHistory();
  } 
}
}

