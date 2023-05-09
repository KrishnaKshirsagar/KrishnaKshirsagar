import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { InvoiceErrorComponent } from "../components/invoice-error/invoice-error.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
@Component({
  selector: "app-invoicelist",
  templateUrl: "./invoicelist.component.html",
  styleUrls: ["./invoicelist.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class InvoicelistComponent implements AfterViewInit {

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  minLengthTerm = 3;
  interestAmount: any;
  payableAmount: number = 0;
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  myControl = new FormControl();
  options: string[] = ["One", "Two", "Three"];
  filteredOptions!: Observable<string[]>;
  openDialog1() {
    const dialogRef = this.dialog.open(InvoicelistDialog);
  }

  displayedColumns: string[] = [
    "invoice_number",
    "invoiceamount",
    "duedate",
    "actions",
  ];

  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  redirect!: string;

  private token!: string;

  private durationInSeconds = 2;

  uid!: string;

  type!: string;

  invoice_status!: string;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<InvoiceErrorComponent>
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["uid"] && queryParams["type"]) {
        this.uid = queryParams["uid"];
        this.type = queryParams["type"];

        //To check the type of invoice we are going to show
        if (this.type == "pay") {
          this.invoice_status == "Confirmed";
        } else if (this.type == "invoice") {
          this.invoice_status == "Pending";
        }
        this.validateUser();
      }
    });
  }

  validateUser() {
    this.apiService
      .validateUser(this.uid, this.invoice_status)
      .subscribe((response: any) => {
        if (response.success == true) {
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

  getInvoiceById() {
    this.apiService
      .getInvoicesByCompanyId(this.uid, this.type)
      .subscribe((response: any) => {
        if (response.success == true) {
          this.dataSource = new MatTableDataSource(response.invoice);
        }else{
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

  calculatedInterest(invoicedata: any) {
    const due_date = invoicedata.extended_due_date
      ? invoicedata.extended_due_date
      : invoicedata.invoice_due_date;
    var today = new Date();
    var date1 = new Date(due_date); //mmddyyyy
    var date2 = new Date(today);
    var Time = date2.getTime() - date1.getTime();
    var Days = Time / (1000 * 3600 * 24) > 0 ? Time / (1000 * 3600 * 24) : 0; //Diference in Days

    const data = {
      amount: invoicedata.outstanding_amount,
      days: Days,
    };
    this.apiService
      .calculatedInterest(invoicedata.buyer._id, data)
      .subscribe((resp: any) => {
        // if(resp.status == true){
        this.interestAmount = resp.total_interest;
        this.payableAmount = resp.total_amount;
        // }
      });
  }

  payInvoice(invoiceData: any) {
    const due_date = invoiceData.extended_due_date
      ? invoiceData.extended_due_date
      : invoiceData.invoice_due_date;
    var today = new Date();
    var date1 = new Date(due_date); //mmddyyyy
    var date2 = new Date(today);
    var Time = date2.getTime() - date1.getTime();
    var Days = Time / (1000 * 3600 * 24) > 0 ? Time / (1000 * 3600 * 24) : 0; //Diference in Days

    const data = {
      amount: invoiceData.outstanding_amount,
      days: Days,
    };
    this.apiService
      .calculatedInterest(invoiceData.buyer._id, data)
      .subscribe((resp: any) => {
        // if(resp.success == true){
        this.interestAmount = resp.total_interest;
        this.payableAmount = resp.total_amount;
        // }

        // ===================================================================================
        const body: any = {
          customer_details: {
            //req
            customer_id: invoiceData.buyer._id,
            customer_name: invoiceData.buyer.company_name,
            customer_emai: invoiceData.buyer.email
              ? invoiceData.buyer.email
              : "",
            customer_phone: invoiceData.buyer.mobile_number
              ? invoiceData.buyer.mobile_number
              : "",
          },
          invoiceid: invoiceData._id,
          order_amount: +(this.payableAmount).toFixed, //req
          order_currency: "INR", //req
          invoiceNumber: invoiceData.invoice_no,
          invoiceAmount: invoiceData.invoice_amount,
          invoiceDate: invoiceData.invoice_date,
          invoiceDueDt: invoiceData.invoice_duedate,
          outstanding_amount: invoiceData.outstanding_amount,
          buyerid: invoiceData.buyer._id,
          interest: this.interestAmount,
          returnurl: "https://dev.xuriti.app/#/invoices/status",
        };

        this.apiService.paynow(this.uid, body).subscribe((response: any) => {
          if (response.success == true) {
            if (
              response.data &&
              response.data.paymentlink &&
              response.data.paymentlink != '' &&
              response.data.paymentlink != undefined &&
              response.data.paymentlink != null
            ) {
              window.location.href = response.data.paymentlink;
            } else {
              this.snackBar.open(
                "Unable to process at this moment, please contact to support team.",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
            }           
          } else {
            this.snackBar.open(
              "An error occurred, please try again later or contact to support team.",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
        });
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

@Component({
  selector: "invoicelist-dialog",
  templateUrl: "invoicelist-dialog.html",
  styleUrls: ["./invoicelist.component.scss"],
})
export class InvoicelistDialog {}
