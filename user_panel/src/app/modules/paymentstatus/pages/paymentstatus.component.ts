import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { ApiService } from "../services/api/api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
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

  currency_format = CURRENCY_FORMAT;

  redirect!: string;

  companyid!: string;

  private durationInSeconds = 2;

  paymentSuccessFlag!: boolean;

  transactionDetails: any = {};

  order_status!: string;

  pwdVisible = false;

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
      if (queryParams["order_id"] && queryParams["order_token"]) {
        const order_id = queryParams["order_id"];
        const order_token = queryParams["order_token"];
        this.invoicePaymentstatus(order_id, order_token);
      }
    });
  }

  getCompanyId() {
    const href = window.location.href;
    const url: any = href.split("/");
    this.companyid = url[5];
  }

  invoicePaymentstatus(order_id: string, order_token: string) {
    const order = {
      order_id: order_id,
      order_token: order_token,
    };
    this.apiService.invoicePaymentstatus(order).subscribe((resp: any) => {
      if (resp.status == true) {
        this.transactionDetails = {
          invoice_id: resp.payment.invoice,
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
          this.getCompanyId();
          if (this.companyid != undefined) {
            this.router.navigate([
              `/companies/${this.companyid}/invoices/purchases`,
            ]);
          }
        }, 4000);
      } else {
        this.transactionDetails = {
          invoice_id: resp.payment.invoice,
          order_id: resp.payment.order_id,
          order_currency: resp.payment.order_currency,
          order_amount: resp.payment.order_amount,
          order_status: resp.payment.order_status,
        };
        this.order_status = this.transactionDetails.order_status;

        // this.snackBar.open(
        //   "An error occurred, Please contact to support team",
        //   "Close",
        //   {
        //     duration: this.durationInSeconds * 4000,
        //     panelClass: ["error-dialog"],
        //   }
        // );
        setTimeout(() => {
          this.getCompanyId();
          if (this.companyid != undefined) {
            this.router.navigate([
              `/companies/${this.companyid}/invoices/sales`,
            ]);
          }
        }, 3000);
      }
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }
}
