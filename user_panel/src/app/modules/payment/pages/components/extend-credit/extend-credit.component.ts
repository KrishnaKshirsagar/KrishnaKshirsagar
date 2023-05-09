import { DatePipe } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
  LOCAL_STORAGE_AUTH_DETAILS_KEY,
} from "src/app/shared/constants/constants";
import { ApiService } from "../../../services/api/api.service";

@Component({
  selector: "app-extend-credit",
  templateUrl: "./extend-credit.component.html",
  styleUrls: ["./extend-credit.component.scss"],
})
export class ExtendCreditComponent implements OnInit {

  form!: FormGroup;

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  pwdVisible = false;

  companyid!: string;

  sellerid!: string;

  user_email!: string;

  user_mobile!: string;

  errorflag = false;

  interest_amount: number = 0;

  days: number = 0;

  extend_days: number = 0;

  durationInSeconds = 2;

  new_Outstanding_amount: number = 0;

  new_due_date!: Date;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<ExtendCreditComponent> // private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      password: ["", [Validators.required]],
    });
    this.companyid = this.data.companyid;
    this.sellerid = this.data.sellerid;
    this.getLoggedInUser();
  }

  getLoggedInUser() {
    const detailsStr = sessionStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      if (userDetails.email && userDetails.mobile_number) {
        this.user_email = userDetails.email;
        this.user_mobile = userDetails.mobile_number;
      }
    }
  }

  invoiceNewDueDate(event: Event) {
    this.errorflag = false;
    this.days = (+event);

    var due_date = new Date(this.data.invoice_due_date);
    var extended_date = new Date(this.data.extended_due_date);
    var Time1 = extended_date.getTime() - due_date.getTime(); //ext - due date
    var Days1 = Math.round(Time1 / (1000 * 3600 * 24) > 0 ? Time1 / (1000 * 3600 * 24) : 0); //Diference in Ext due date and due date
    
    this.extend_days = Days1 + this.days;

    if(this.extend_days > 60){
      this.snackBar.open(
        "You cannot raise E-Mandate greater than 60 days.",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }else{
      const invoiceData = {
        amount: +this.data.outstanding_amount,
        days: +event,
      };

      if (this.sellerid && this.sellerid != undefined) {
        this.apiService
          .calculatedInterest(this.sellerid, invoiceData)
          .subscribe((resp: any) => {
            // if(resp.status == true){
            this.interest_amount = +(resp.Interest).toFixed(2);
            this.new_Outstanding_amount = +(resp.Total_Amount).toFixed(2);
            // To calculate due date
            var date = new Date(this.data.extended_due_date);
            var d = date.setDate(date.getDate() + this.days);
            this.new_due_date = new Date(date);
            // this.new_due_date = this.datePipe.transform(d, 'dd-MM-yyyy')
          });
      }

    }    
  }

  onSubmit() {
    if (this.days == 0) {
      this.errorflag = true;
    } else {
      this.errorflag = false;
    }
    // var datePipe = new DatePipe('en-US');
    // due_date: datePipe.transform(this.data.invoice_due_date, 'dd-MM-yyyy'),
    // new_due_date: datePipe.transform(this.data.invoice_due_date, 'dd-MM-yyyy'),
    if (this.new_Outstanding_amount > 0 && this.days > 0) {
      const extData = {
        due_date: this.data.invoice_due_date
          .toString()
          .split("/")
          .reverse()
          .join("/"),
        new_due_date: this.new_due_date,
        invoice_id: this.data.invoice_id,
        invoice_no: this.data.invoice_number,
        buyer_id: this.data.companyid,
        seller_id: this.data.sellerid,
        seller_name: this.data.seller_name, // sellername
        invoice_amount: this.data.invoice_amount,
        days: this.days,
        outstanding_amount: +this.data.outstanding_amount,
        interest_amount: this.interest_amount,
        email: this.user_email,
        mobile: this.user_mobile,
      };
      this.apiService.paylater(extData).subscribe((resp: any) => {
        if (resp.status == "OK") {
          if(resp.authLink &&
            resp.authLink != '' &&
            resp.authLink != undefined &&
            resp.authLink != null){
              this.snackBar.open(
                "You are redirecting for the E-Mandate, please complete the process.",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
              setTimeout(() => {
                window.location.href = resp.authLink;
              }, 4000);

          }else{
            this.snackBar.open(
              resp.message,
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
            this.dialogRef.close();

          }
        } else {
          this.snackBar.open(
            resp.message,
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
          this.dialogRef.close();
        }
      });
    }else{
      this.snackBar.open(
        "You cannot raise the E-Mandate, please check invoice details.",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
      this.dialogRef.close();
    }
  }
}
