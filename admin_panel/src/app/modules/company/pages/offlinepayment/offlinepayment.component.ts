import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CURRENCY_FORMAT, DATE_FORMAT } from 'src/app/shared/constants/constants';
import { ToWords } from 'to-words';
import { PaymentSummeryComponent } from '../components/payment-summery/payment-summery.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-offlinepayment',
  templateUrl: 'offlinepayment.component.html',
  styleUrls: ['./offlinepayment.component.scss'],
})
export class OfflinepaymentComponent implements OnInit {

  offlinepayment_form! : FormGroup;

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  //Buyer autosuggetion
  companySelect: FormControl = new FormControl();

  company_Name: any = [];

  durationInSeconds = 2;

  sellerid!: string;

  amount_inWords!: string;

  company_name!: string;

  sellerlist: any = [];

  buyer_list: any = [];

  buyerid!: string;

  payment_receipt!: File;

  total_outstanding_amount: number = 0;

  total_interest: number = 0;

  total_discount: number = 0;

  total_amount: number = 0;

  amount: number = 0;

  settle_amount: number = 0;

  order_amount: number = 0;

  settled_invoice:any

  error_flag = false;

  max_date: Date = new Date();

  myControl = new FormControl("");

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private apiservice: ApiService,
    private dialogueRef: MatDialogRef<PaymentSummeryComponent>,
    private dialogue: MatDialog
  ) {}

  ngOnInit() {
    this.offlinepayment_form = this.fb.group({
      paid_amount: ["", [Validators.required, Validators.pattern]],
      transactionid: ["", [Validators.required]],
      payment_date: [ new Date, [Validators.required]],
      payment_mode: ["", [Validators.required]],
      comment: ["", [Validators.required]],
    });
  }

  // ========= dropdwon and auto suggetion =======
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

  displayBuyerFn(company: any): string {
    return company && company.company_name ? company.company_name : "";
  }

  getBuyerId(company: any) { //to select the buyer id
    this.buyerid = company._id;
    if ((this.buyerid != undefined || this.buyerid != null || this.buyerid != "")) {     
        this.getSellerlistByCompanyid();
    }
  }

  company_name_clear() {
    (<HTMLInputElement>document.getElementById('pay_slip')).value = "";
    this.company_Name = [];
    this.companySelect = new FormControl();
    this.buyerid = "";

    // Clear seller
    this.myControl = new FormControl(null)
    this.sellerlist = [];
    this.sellerid = "";
    this.resetAll();

    this.total_outstanding_amount = 0;
    this.total_interest = 0;
    this.total_discount = 0;
    this.total_amount = 0;
  }

  getSellerlistByCompanyid() {
    this.apiservice
      .getSellerlistByBuyerid(this.buyerid)
      .subscribe((resp: any) => {
        if (resp && resp.status == true) {
          const length = resp && resp.seller && resp.seller.length ? resp.seller.length : 0;
          for (let i = 0; i < length; i++) {
            if(resp.seller[i]){
              this.sellerlist.push(resp.seller[i]);
            }
          }
        } else {
          this.snackBar.open(resp.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      });
  }

  displayFn(company: any) {
    const company_name =
      company && company.company_name ? company.company_name : "";
    return company_name;
  }

  onChange(comp: any) {
    const sellerid = comp._id;
    if (sellerid && sellerid != undefined) {
      this.sellerid = sellerid;
      this.getPaymentDetails(this.sellerid);
    }
  }

  clearSellerName(ctrl: FormControl) {
    ctrl.setValue(null);
    this.total_outstanding_amount = 0;
    this.total_interest = 0;
    this.total_discount = 0;
    this.total_amount = 0;
    this.resetAll();
  }

  getPaymentDetails(sellerid: string) {
    this.apiservice
      .getPaymentDetails(this.buyerid, sellerid)
      .subscribe((respo: any) => {
        if (respo.status == true) {
          let total_amt = 0;
          this.total_outstanding_amount = +(respo.total_outstanding).toFixed(2);
          this.total_interest = +respo.total_interest.toFixed(2);
          this.total_discount = +respo.total_discount.toFixed(2);
          total_amt = +respo.total_payable.toFixed(2);            
          // this.onSelectCompleteAmount(this.payment_option_flag);
          this.total_amount = Number(total_amt.toFixed(2));
        }else{
          this.total_outstanding_amount = 0;
          this.total_interest = 0;
          this.total_discount = 0;
          this.total_amount = 0;
        }
      });
  }

  partpayemetAmount(event: any) {
    this.amount_inWords = "";
    let amt = +event.target.value;
    if (amt > 0) {
      let date = formatDate(this.offlinepayment_form.value.payment_date, "yyyy-MM-dd", "en-US");
      this.amount = amt;
      this.error_flag = false;
      //Convert number to words
      const toWords = new ToWords();
      this.amount_inWords = toWords.convert(amt);
      // Payment summery
      this.apiservice.getPaymentDetailsAtSettleAmt(this.buyerid, this.sellerid, amt, date).subscribe((re:any) => {
        if(re && re.status == true){
          this.settled_invoice = re.invoiceDetails ? re.invoiceDetails : [];
          this.settle_amount = re.settled_amount ? re.settled_amount : 0;
          // this.settle_amount = re.revised.reduce((n: any, { amount_cleared }: any) => n + amount_cleared, 0)
          this.order_amount = this.amount;
        }else{
          this.settled_invoice = [];
          this.settle_amount = 0;
          this.order_amount = 0;
        }
      })
    } else {
      this.amount = 0;
      this.error_flag = true;
      this.settled_invoice = [];
      this.settle_amount = 0;
      this.order_amount = 0;
    }
  }

  partpayemetAmountWithDate(event: any){
    let date = formatDate(this.offlinepayment_form.value.payment_date, "yyyy-MM-dd", "en-US");
    if(this.amount > 0){
      this.apiservice.getPaymentDetailsAtSettleAmt(this.buyerid, this.sellerid, this.amount, date).subscribe((re:any) => {
        if(re && re.status == true){
          this.settled_invoice = re.invoiceDetails ? re.invoiceDetails : [];
          this.settle_amount = re.settled_amount ? re.settled_amount : 0;
          this.order_amount = this.amount;
        }else{
          this.settled_invoice = [];
          this.settle_amount = 0;
          this.order_amount = 0;
        }
      })
    }    
  }

  openpaymentSummery(){
    this.dialogueRef = this.dialogue.open(PaymentSummeryComponent, {
      data: this.settled_invoice
    })
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size <= '5242880') {
      const file = event.target.files[0];
      this.payment_receipt = file;
    }else{
      this.snackBar.open("Payment receipt file size cannot be greater than 5MB.", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
      (<HTMLInputElement>document.getElementById('pay_slip')).value = "";
      const file = event.target.files[0];
      this.payment_receipt = file;
    }
  }

  resetAll(){
    // clear all entered data
    this.amount_inWords = '';
    this.settled_invoice = [];
    this.offlinepayment_form.patchValue({
      paid_amount: 0,
      transactionid: ' ',
      payment_mode: ' ',
      payment_date: new Date(),
      comment: ' ',
    });
  }

  onSubmit() {
    if (this.offlinepayment_form.valid && this.error_flag == false) {
      if (this.offlinepayment_form.value.paid_amount <= 0) {
        this.snackBar.open("Please enter valid paid amount.", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      } else if (
        !this.payment_receipt ||
        this.payment_receipt == null ||
        this.payment_receipt == undefined
      ) {
        this.snackBar.open("Please attach payment receipt.", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      } else {
        const formData: FormData = new FormData();
        formData.append("buyerid", this.buyerid);
        formData.append("sellerid", this.sellerid);
        formData.append(
          "order_amount", this.order_amount.toString(),
        );
        formData.append(
          "settle_amount", this.settle_amount.toString(),
        );
        formData.append("payment_date", formatDate(this.offlinepayment_form.value.payment_date, "yyyy-MM-dd", "en-US"));
        formData.append("comments", this.offlinepayment_form.value.comment);
        formData.append(
          "payment_mode",
          this.offlinepayment_form.value.payment_mode
        );
        formData.append(
          "transaction_id",
          this.offlinepayment_form.value.transactionid
        );
        formData.append("order_currency", "INR");
        formData.append("payslip", this.payment_receipt);
        //sending file
        this.apiservice
          .offlinePayment(formData)
          .subscribe((respon: any) => {
            if (respon && respon.status == true) {
              this.snackBar.open(respon.message, "Close", {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              });
              // After successful payment the outstanding amount should be refreshed
              this.company_name_clear();
            } else {
              this.snackBar.open(respon.message, "Close", {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              });
            }
          });
      }
    }
  }
}
