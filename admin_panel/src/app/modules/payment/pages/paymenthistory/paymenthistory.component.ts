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
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
import { map, Observable, startWith } from "rxjs";
import { formatDate } from "@angular/common";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: "app-paymenthistory",
  templateUrl: "./paymenthistory.component.html",
  styleUrls: ["./paymenthistory.component.scss"],
  providers: [],
})
export class PaymenthistoryComponent implements AfterViewInit {

  Date_Format = DATE_FORMAT;

  Currency_Format = CURRENCY_FORMAT;

  invoiceDate!: Date;

  paymentDate!: any;

  invoiceStatus:any;

  maxDate!: Date;

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
    "paidamount",
    "discount",
    "interest",
    "settledamount",
    "payment_mode",
    "status",
    "totalorderamount",
    "actions",
  ];

  dataSource = new MatTableDataSource([]);
  invoiceNumber: any;
  status_invoice: any;
  invoiceFormatDate!: string;
  paymentFormatDate!: string;
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private apiservice: ApiService,
    public dialogRef: MatDialogRef<PaymenthistoryDialog>,
    private route : ActivatedRoute,
  ) {}

  ngOnInit(): void {
    let obj : any = {}
    this.route.queryParams.subscribe((params) => {
      obj = JSON.parse(params["obj"]);
   });

   if (obj.seller_flag == false) {
    this.company_Name = [{
      company_name : obj.company_name
    }]
    this.companySelect.setValue({company_name: obj.company_name});
    this.userType = "buyer"
    this.getPosts({_id : obj._id})
  }
  else if (obj.seller_flag == true) {
    this.company_Name = [{
      company_name : obj.company_name
    }]
    this.companySelect.setValue({company_name: obj.company_name});
    this.userType = "seller"
    // this.filterdata.usertype = this.selection
    this.getPosts({_id : obj._id})
  }
  else{
    this.getPaymentHistory();
  }
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
    this.apiservice.getPaymentHistory().subscribe((response: any) => {
      if (response && response.trunc_details) {
        const paymenthistory = response.trunc_details
          ? response.trunc_details
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

  openDialog(element: any) {
    //Change status dialogue box
    this.dialogRef = this.dialog.open(PaymenthistoryDialog, {
      data: {
        transactionid: element._id,
        order_status: element.order_status,
      },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.getPaymentHistory();
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
    this.apiservice
      .filterPaymentHistory(filterdata)
      .subscribe((response: any) => {
        if (response && response.trunc_details) {
          const paymenthistory = response.trunc_details
            ? response.trunc_details
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

@Component({
  selector: "paymenthistory-dialog",
  templateUrl: "paymenthistory-dialog.html",
  styleUrls: ["./paymenthistory.component.scss"],
})
export class PaymenthistoryDialog implements OnInit {
  transactionStatus_Form!: FormGroup;

  durationInSeconds = 2;

  status_change_flag = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PaymenthistoryDialog>,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.transactionStatus_Form = this.fb.group({
      order_status: ["", [Validators.required]],
    });

    if (this.data && this.data != null) {
      this.transactionStatus_Form.patchValue({
        order_status: this.data.order_status,
      });
    }
  }

  status_change() {
    this.status_change_flag = true;
  }

  onSubmit() {
    if (this.transactionStatus_Form.valid && this.status_change_flag == true) {
      this.apiService
        .changePaymentStatus(
          this.data.transactionid,
          this.transactionStatus_Form.value
        )
        .subscribe((resp: any) => {
          if (resp.status == true) {
            this.snackBar.open(
              "Payment status is changed successfully",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          } else {
            this.snackBar.open(
              "Transaction status is not changed, please try again later",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
          // this.dialogRef.close();
        });
      this.dialogRef.close();
    } else {
      this.snackBar.open("Please change payment status.", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
  }
}
