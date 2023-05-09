import { LiveAnnouncer } from "@angular/cdk/a11y";
import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
import { DialogConfirmComponent } from "../components/dialog-confirm/dialog-confirm.component";
import { BulkpayDialogComponent } from "../components/bulk-pay/bulkpay.component";

@Component({
  selector: "app-invoicestatus",
  templateUrl: "./invoicestatus.component.html",
  styleUrls: ["./invoicestatus.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class InvoicestatusComponent implements AfterViewInit {

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  uid!: string;

  type!: string;

  invoice_status!: string;

  invoice_displayedColumns: string[] = [
    "invoice_number",
    "company_name",
    "total_tax",
    "invoice_amount",
    "total_invoice_amount",
    "invoice_due_date",
    "invoice_status",
    "actionsstatic",
  ];

  payment_displayedColumns: string[] = [
    "invoice_number",
    "company_name",
    "total_tax",
    "invoice_amount",
    "total_invoice_amount",
    "outstanding_amount",
    "discount",
    "interest",
    "payable_amount",
    "invoice_due_date",
    "invoice_status",
  ];

  payment_dataSource = new MatTableDataSource([]);
  invoice_dataSource = new MatTableDataSource([]);


  @ViewChild(MatPaginator) invoice_paginator!: MatPaginator;
  @ViewChild(MatSort) invoice_sort!: MatSort;

  @ViewChild(MatPaginator) payment_paginator!: MatPaginator;
  @ViewChild(MatSort) payment_sort!: MatSort;

  redirect!: string;

  action_flag: boolean = false;

  changeText: boolean = false;

  companyid!: string;

  durationInSeconds = 2;

  interestAmount: any;

  payableAmount: number = 0;

  private token!: string;

  pwdVisible = false;

  keyword = "name";

  data = [];

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogConfirmComponent>,
    public dialogRef1: MatDialogRef<BulkpayDialogComponent>
  ) {
    this.payment_dataSource.sort = this.payment_sort;
    this.invoice_dataSource.sort = this.invoice_sort;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["uid"] && queryParams["type"]) {
        this.uid = queryParams["uid"];
        this.type = queryParams["type"];

        //To check the type of invoice we are going to show
        if (this.type == "payment") {
          this.invoice_status = "Confirmed";
        } else if (this.type == "invoice") {
          this.invoice_status = "Pending";
        }
        this.validateUser();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.payment_dataSource.filter = filterValue.trim().toLowerCase();
    this.invoice_dataSource.filter = filterValue.trim().toLowerCase();
  }

  validateUser() {
    //Validating the link
    this.apiService
      .validateUser(this.uid, this.type)
      .subscribe((response: any) => {
        if (response.status == true) {
          this.getInvoiceById();
        } else {
          this.snackBar.open("Link is expired, please try again", "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
          setTimeout(() => {
            this.router.navigate([`auth/login`]);
          }, 3000);
        }
      });
  }

  ngAfterViewInit() {
    this.payment_dataSource.paginator = this.payment_paginator;
    this.payment_dataSource.sort = this.payment_sort;

    this.invoice_dataSource.paginator = this.invoice_paginator;
    this.invoice_dataSource.sort = this.invoice_sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  getInvoiceById() {
    this.apiService
      .getInvoicesByCompanyId(this.uid, this.invoice_status)
      .subscribe((response: any) => {
        if (response.status == true) {
          this.action_flag = false;
          this.companyid = response && response.invoice[0] && response.invoice[0].buyer && response.invoice[0].buyer._id ? response.invoice[0].buyer._id : '';
          const invoices = response && response.invoice && response.invoice.length > 0 ? response.invoice : []

          if (this.type == "payment") {
            this.invoice_dataSource = new MatTableDataSource([]);
            this.payment_dataSource = new MatTableDataSource(invoices);

            this.payment_dataSource.paginator = this.payment_paginator;

            // Sorting
            this.payment_dataSource.sort = this.payment_sort;
            const _sortState: Sort = { active: "createdAt", direction: "desc" };
            this.payment_sort.active = _sortState.active;
            this.payment_sort.direction = _sortState.direction;
            this.payment_sort.sortChange.emit(_sortState);

          } else if (this.type == "invoice") {
            this.payment_dataSource = new MatTableDataSource([]);
            this.invoice_dataSource = new MatTableDataSource(invoices);

            this.invoice_dataSource.paginator = this.invoice_paginator;
            
            // Sorting
            this.invoice_dataSource.sort = this.invoice_sort;
            const sortState: Sort = { active: "createdAt", direction: "desc" };
            this.invoice_sort.active = sortState.active;
            this.invoice_sort.direction = sortState.direction;
            this.invoice_sort.sortChange.emit(sortState);

          } else {
            this.invoice_dataSource = new MatTableDataSource([]);
            this.payment_dataSource = new MatTableDataSource([]);
          }
          
        } else {
          this.payment_dataSource = new MatTableDataSource([]);
          this.invoice_dataSource = new MatTableDataSource([]);

          this.snackBar.open(
            "No invoice found against selected company.",
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
        }
      });
  }

  getPayableAmount(element: any){
    const outstanding_amt = (element && element.outstanding_amount ? element.outstanding_amount : 0)
    const discount = (element && element.discount ? element.discount : 0)
    const interest = (element && element.interest ? element.interest : 0)
    const payable_amt = (+outstanding_amt) + (+interest) - (+discount);
    return payable_amt;
  }

  payInvoice(){
    if(this.companyid != undefined && this.companyid != null && this.companyid != ''){
      this.action_flag = true;
      this.dialogRef1 = this.dialog.open(BulkpayDialogComponent, {
        data: {
          companyid : this.companyid,
          uid : this.uid
        }
      });
    }else{
      this.action_flag = false;
      this.snackBar.open(
        "Please check the invoice or contact Xuriti team.",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
  }

  viewInvoice(invoicelink: any) {
    if (invoicelink && invoicelink != "" && invoicelink != undefined) {
      window.location.href = invoicelink;
    } else {
      this.snackBar.open("Unable to download the invoice file.", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
  }
  
  confirmInvoice(invoiceData: any) {
    this.action_flag = true;
    let data = {
      invoiceid:invoiceData._id,
      invoice_number:invoiceData.invoice_number,
      seller_name:invoiceData.seller.company_name,
      nbfc_name:invoiceData.nbfc_name,
      status:"Confirmed"
    }
    this.openDialog(data);
  }

  rejectInvoice(invoiceData: any) {
    this.action_flag = true;
    let data = { 
      invoiceid:invoiceData._id,
      invoice_number:invoiceData.invoice_number,
      seller_name:invoiceData.seller.company_name,
      nbfc_name:invoiceData.nbfc_name,
      status:"Rejected"
    }
    this.openDialog(data);
  }

  openDialog(invoicedetails: any) {
    this.dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: invoicedetails
    });

    this.dialogRef.afterClosed().subscribe((invoic_status_data) => {
      this.action_flag = false;
      if(invoic_status_data != null && invoic_status_data != undefined){
        const invoiceStatus: any = {
          invoiceID: invoicedetails.invoiceid,
          status: invoicedetails.status, //'Rejected',
          user_comment: invoic_status_data.invoice_comment,
          user_consent_message: invoicedetails.status != 'Rejected' ? invoic_status_data.consent_msg : '',
          userConsentGiven: invoicedetails.status != 'Rejected' ?  invoic_status_data.userConsentGiven : false,
        };
        this.apiService
          .changeInvoiceStatus(this.uid, invoiceStatus)
          .subscribe((resp: any) => {
            if (resp.status == true) {
              this.snackBar.open(
                "Invoice Status is changed successfully",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
              this.getInvoiceById();
            } else {
              this.snackBar.open(
                "Unable to change the Invoice Status, Please try again after sometime",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
              this.getInvoiceById();
            }
        });
      }
    });
  }
}

@Component({
  selector: "invoicestatus-dialog",
  templateUrl: "invoicestatus-dialog.html",
  styleUrls: ["./invoicestatus.component.scss"],
})
export class InvoicestatusDialog {}
