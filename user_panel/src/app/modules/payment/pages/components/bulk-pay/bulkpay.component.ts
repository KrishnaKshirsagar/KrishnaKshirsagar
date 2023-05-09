import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
  LOCAL_STORAGE_AUTH_DETAILS_KEY,
} from "src/app/shared/constants/constants";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiService } from "../../../services/api/api.service";
import { PaymentSummeryComponent } from "../payment-summery/payment-summery.component";

// =================  Pament dia =======================

@Component({
  selector: "app-bulkpay-dialog",
  templateUrl: "bulkpay-dialog.html",
  styleUrls: ["bulkpay.component.scss"],
})

export class BulkpayDialogComponent implements OnInit {

  myControl = new FormControl('');

  options: string[] = ['Company Name 1', 'Company Name Two', 'Company Name Three'];

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  paynow_form!: FormGroup;

  companyid!: string;

  sellerid!: string;

  sellerlist: any= [];

  settled_invoice:any = [];

  all_settled_invoice:any = [];

  total_outstanding_amount:number = 0;

  gst_amount: number = 0;

  total_interest: number = 0;

  total_discount: number = 0;

  partpay_outstanding_amount:number = 0;

  partpay_interest: number = 0;

  partpay_discount: number = 0;

  gst_settled: number = 0;

  userDetails!: any;

  durationInSeconds = 2;

  fullAmountPayflag: boolean;

  amountErrorflag = false;

  errorflag = false;

  paymenttype!: any;

  total_amount: number = 0;

  settle_amount: number = 0;

  payment_option_flag!: boolean;

  payableAmt = 0;

  days: number =0;

  payableAmount: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PaymentSummeryComponent>,
  ) {}

  ngOnInit() {
    const detailsStr = sessionStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      this.userDetails = details.user;
    }
    const cid = sessionStorage.getItem('companyid');
    this.companyid = cid ? cid : '';
    // ======================================
    this.getSellerlistByCompanyid();
    this.paynow_form = this.fb.group({
      partPay: "",
    });
  }

  openpaymentSummery(){
    this.dialogRef = this.dialog.open(PaymentSummeryComponent, {
      data: this.settled_invoice
    });
  }

  clear(ctrl:FormControl){
    ctrl.setValue(null);
  }

  getSellerlistByCompanyid(){
    this.payment_option_flag = true;
    this.apiService.getSellerlistByBuyerid(this.companyid).subscribe((resp: any) => {
      if(resp && resp.status == true){
        const length = resp && resp.seller && resp.seller.length ? resp.seller.length : 0;
        for(let i=0; i<length; i++){
          if(resp.seller[i]){
            this.sellerlist.push(resp.seller[i]);
          }
        }
      }else{
        this.snackBar.open(
          resp.message,
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }
    })
  }

  displayFn(company: any){
    const company_name = company && company.company_name ? company.company_name : ''
    return company_name;
  }

  onChange(comp: any){    
    const sellerid = comp._id;
    if(sellerid && sellerid != undefined){
      this.sellerid = sellerid;
      this.payment_option_flag = true;
      this.getPaymentDetails(this.sellerid);
    }
  }

  getPaymentDetails(sellerid: string){
    this.payment_option_flag = true;
    this.apiService.getPaymentDetails(this.companyid, sellerid).subscribe((respo:any)=>{
      if(respo.status == true){
        this.settled_invoice = respo.invoiceDetails;
        this.all_settled_invoice = respo.invoiceDetails
        // =======================================================
        this.total_outstanding_amount= (+respo.total_outstanding);
        this.gst_amount = (+respo.total_gst);
        this.total_interest = (+respo.total_interest);
        this.total_discount = (+respo.total_discount);
        this.total_amount = (this.total_outstanding_amount + this.total_interest) - this.total_discount;
        this.onSelectCompleteAmount(this.payment_option_flag);
      }
    })
  }

  onSelectCompleteAmount(flag: boolean) {
    this.fullAmountPayflag = flag;
    if (this.fullAmountPayflag == true) { //full pay selected
      this.payment_option_flag = true;
      this.errorflag = false;
      this.settle_amount = +(this.total_outstanding_amount).toFixed(2);
      this.payableAmount = this.total_amount;
      this.settled_invoice = this.all_settled_invoice;
      this.paynow_form.patchValue({
        partPay: "",
      });
      this.partpay_outstanding_amount = 0;
      this.partpay_interest = 0;
      this.partpay_discount = 0;
      this.gst_settled = 0;
    }else{ //partpay selected
      this.settled_invoice = [];
      this.payment_option_flag = false;
      this.payableAmount = this.partpay_outstanding_amount;
    }
  }

  onEnterAmount(event: any) {
    let amt = (+event.target.value);
    if(amt <= 0){
      this.settled_invoice = [];
      this.errorflag = true;
      this.payableAmount = 0;
    } else{
      this.errorflag = false;
      this.apiService.getPaymentDetailsAtSettleAmt(this.companyid, this.sellerid, amt).subscribe((res: any) => {
        this.settled_invoice = res.invoiceDetails;
        // ===========================================================
        this.partpay_outstanding_amount = +(res.settled_amount).toFixed(2);
        this.gst_settled = (+res.total_gst);
        this.partpay_interest = (+res.total_interest);
        this.partpay_discount = (+res.total_discount);
        this.payableAmount = +(amt).toFixed(2);
        this.settle_amount = this.partpay_outstanding_amount;
        // this.settle_amount = res.revised.reduce((n, { amount_cleared }) => n + amount_cleared, 0)
      });
    }
  }

  paynow() {
    if (this.fullAmountPayflag == true) {
      this.errorflag = false;
      this.payableAmt = this.payableAmount;
      this.payPayableAmount();
    } else {
      if (
        this.paynow_form.valid &&
        this.paynow_form.value.partPay > 0
      ) {
        this.errorflag = false;
        this.payableAmt = this.payableAmount;
        this.payPayableAmount();
      } else {
        this.errorflag = true;
      }
    }
  }

  payPayableAmount() {
    if (this.payableAmt < 0 || this.payableAmt == 0) {
      this.errorflag = true;
    } else {
      this.errorflag = false;
      const body: any = {
        customer_details: { //required field by cashfree
          customer_id: this.companyid,
          // customer_name: this.data.invoiceData.buyer.companyName,
          customer_email: this.userDetails.email,
          customer_phone: this.userDetails.mobile_number,
        },
        order_amount: this.payableAmt, //req
        settle_amount: this.settle_amount,
        order_currency: "INR", //req
        outstanding_amount: (+this.total_outstanding_amount),
        buyerid: this.companyid,
        sellerid: this.sellerid
      };
      this.apiService.paynow(body).subscribe((response: any) => {
        if (response.status == true) {
          if (
            response.payment_link &&
            response.payment_link != '' &&
            response.payment_link != undefined &&
            response.payment_link != null
          ) {
            window.location.href = response.payment_link;
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
            response.message,
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
        }
      });
    }
  }
}
