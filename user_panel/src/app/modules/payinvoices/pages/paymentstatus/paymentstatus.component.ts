import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiService } from "../../services/api/api.service";
import { CURRENCY_FORMAT } from "src/app/shared/constants/constants";

@Component({
  selector: "paymentstatus",
  templateUrl: "./paymentstatus.component.html",
  styleUrls: ["./paymentstatus.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})

export class PaymentStatus implements OnInit {
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  redirect!: string;

  private token!: any;

  companyid!: string;

  private durationInSeconds = 2;

  paymentSuccessFlag!: boolean;

  transactionDetails: any = {};

  order_status!: string;

  currency_format = CURRENCY_FORMAT;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams) {
        this.token = queryParams;
        this.invoicePaymentstatus();
      }
    });
  }

  invoicePaymentstatus() {
    this.apiService.invoicePaymentstatus(this.token).subscribe((resp: any) => {
      if (resp.status == true) {
        this.transactionDetails = {
          invoice_id: resp.payment.orderid,
          order_id: resp.payment.order_id,
          order_currency: resp.payment.order_currency,
          order_amount: resp.payment.order_amount,
          order_status: resp.payment.order_status,
        };
        this.order_status = this.transactionDetails.order_status;
        this.snackBar.open(
          "Please wait, we are fetching your payment status !",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
        setTimeout(() => {
          this.router.navigate([`auth/login`]);
        }, 4000);
      } else {
        this.transactionDetails = {
          invoice_id: resp.payment.invoice,
          order_id: resp.payment.order_id,
          order_currency: resp.payment.order_currency,
          order_amount: +resp.payment.order_amount,
          order_status: resp.payment.order_status,
        };
        this.order_status = this.transactionDetails.order_status;
        this.snackBar.open(
          "Please wait, we are fetching your payment status !",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
        // this.snackBar.open(
        //   "An error occurred, Please contact to support team",
        //   "Close",
        //   {
        //     duration: this.durationInSeconds * 4000,
        //     panelClass: ["error-dialog"],
        //   }
        // );
        setTimeout(() => {
          this.router.navigate([`auth/login`]);
        }, 3000);
      }
    });
  }

  gotoHomepage() {
    this.router.navigate([`auth/login`]);
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }
}
