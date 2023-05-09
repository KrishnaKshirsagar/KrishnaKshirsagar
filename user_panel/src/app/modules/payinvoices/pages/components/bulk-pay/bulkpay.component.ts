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
import { PaymentSummeryComponent } from "src/app/modules/payment/pages/components/payment-summery/payment-summery.component";

// =================  Pament dia =======================

@Component({
  selector: "app-bulkpay-dialog",
  templateUrl: "bulkpay-dialog.html",
  styleUrls: ["bulkpay.component.scss"],
})
export class BulkpayDialogComponent implements OnInit {

  myControl = new FormControl('');

  options: string[] = ['Company Name 1', 'Company Name Two', 'Company Name Three'];

  clear(ctrl:FormControl){
    ctrl.setValue(null);
  }

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  paynow_form!: FormGroup;

  companyid!: string;

  uid!: string;

  sellerid!: string;

  sellerlist: any= [];

  total_outstanding_amount:number = 0;

  total_interest: number = 0;

  total_discount: number = 0;

  gst_amount: number = 0;

  partpay_outstanding_amount:number = 0;

  partpay_interest: number = 0;

  partpay_discount: number = 0;

  userDetails!: any;

  durationInSeconds = 2;

  fullAmountPayflag: boolean = false;;

  amountErrorflag = false;

  errorflag = false;

  paymenttype!: any;

  total_amount: number = 0;

  settle_amount: number = 0;

  settled_invoice:any = [];

  all_settled_invoice:any = [];

  payment_option_flag: boolean = false;

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
    this.companyid = this.data.companyid;
    this.uid = this.data.uid;
    // ======================================
    this.getSellerlistByCompanyid();
    this.paynow_form = this.fb.group({
      partPay: "",
    });
  }

  getSellerlistByCompanyid(){
    this.payment_option_flag = true;
    this.fullAmountPayflag = true;
    this.apiService.getSellerlistByBuyerid(this.companyid, this.uid).subscribe((resp: any) => {
      if(resp && resp.status == true){
        const length = resp && resp.seller.length ? resp.seller.length : 0;
        for(let i=0; i<length; i++){
          if(resp.seller[i] && resp.seller[i].seller && resp.seller[i].seller != undefined){
            this.sellerlist.push(resp.seller[i].seller);
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
    this.apiService.getPaymentDetails(this.companyid, sellerid, this.uid).subscribe((respo:any)=>{
      if(respo.status == true){
        this.settled_invoice = respo.invoiceDetails;
        this.all_settled_invoice = respo.invoiceDetails
        this.total_outstanding_amount= (+respo.total_outstanding);
        this.gst_amount = (+respo.total_gst);
        this.total_interest = (+respo.total_interest);
        this.total_discount = (+respo.total_discount);
        this.total_amount = (this.total_outstanding_amount + this.total_interest) - this.total_discount;
        this.onSelectCompleteAmount(this.payment_option_flag);
      }
    })
  }

  openpaymentSummery(){
    this.dialogRef = this.dialog.open(PaymentSummeryComponent, {
      data: this.settled_invoice
    });
  }

  onSelectCompleteAmount(flag: boolean) {
    this.fullAmountPayflag = flag;
    if (this.fullAmountPayflag == true) { //full pay selected
      this.settled_invoice = this.all_settled_invoice;
      this.payment_option_flag = true;
      this.errorflag = false;
      this.settle_amount = +(this.total_outstanding_amount).toFixed(2);
      this.payableAmount = this.total_amount;
      this.paynow_form.patchValue({
        partPay: "",
      });
      this.partpay_outstanding_amount = 0;
      this.partpay_interest = 0;
      this.partpay_discount = 0;
    }else{ //partpay selected
      this.settled_invoice = [];
      this.payment_option_flag = false;
      this.payableAmount = this.partpay_outstanding_amount;
    }
  }

  onEnterAmount(event: any) {
    let amt = (+event.target.value);
    if(amt < 0){
      this.settled_invoice = [];
      this.errorflag = true;
      this.payableAmount = 0;
    }
    else{
      // this.settle_amount = Math.round(amt*100)/100;
      this.apiService.getPaymentDetailsAtSettleAmt(this.companyid, this.sellerid, amt, this.uid).subscribe((res: any) => {
        this.settled_invoice = res.revised;
        this.partpay_outstanding_amount = +(res.paybaleAmount).toFixed(2);
        this.partpay_interest = (+res.total_interest);
        this.partpay_discount = (+res.total_discount);
        // this.payableAmount = Math.round(+this.partpay_outstanding_amount*100)/100 ;
        this.payableAmount = +(amt).toFixed(2);
        // this.settle_amount = this.partpay_outstanding_amount;
        this.settle_amount = res.revised.reduce((n, { amount_cleared }) => n + amount_cleared, 0)
      });
      this.errorflag = false;
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
        order_amount: this.payableAmt, //req
        settle_amount: this.settle_amount,
        order_currency: "INR", //req
        outstanding_amount: (+this.total_outstanding_amount),
        buyerid: this.companyid,
        sellerid: this.sellerid
      };
      this.apiService.paynowFromWA(this.uid, body).subscribe((response: any) => {
        if (response.status == true) {
          if (
            response.payment_link &&
            response.payment_link != '' &&
            response.payment_link != undefined &&
            response.payment_link != null
          ) {
            // setTimeout(() => {
            window.location.href = response.payment_link;
            // }, 5000);
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
