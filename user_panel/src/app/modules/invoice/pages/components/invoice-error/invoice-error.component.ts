import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-invoice-error",
  templateUrl: "./invoice-error.component.html",
  styleUrls: ["./invoice-error.component.scss"],
})
export class InvoiceErrorComponent implements OnInit {

  consentflag = true;

  nbfc_name!: string;

  invoice_number!: string;

  seller_name!: string;

  invoice_type!: string;

  consent_msg!: string;
  
  invoice_reject_form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InvoiceErrorComponent>
  ) {}

  ngOnInit(): void {
    this.nbfc_name = this.data && this.data.nbfc_name ? this.data.nbfc_name : '';
    this.invoice_number = this.data && this.data.invoice_number ? this.data.invoice_number : '';
    this.seller_name = this.data && this.data.seller_name ? this.data.seller_name : '';
    this.invoice_type = this.data && this.data.invoice_type ? this.data.invoice_type : '';

    this.invoice_reject_form = this.fb.group({
      invoice_comment: ["", [Validators.required]],
      consent: [this.consentflag, [Validators.requiredTrue]],
    });
    if(this.invoice_type == "CN"){
      this.consent_msg = `I agree and approve that credit note- ${this.invoice_number} is correct. Xuriti and it's financing partner ${this.nbfc_name} is authorised to adjust the \ncredit note amount towards the upcoming invoices and disburse the remaining balance to ${this.seller_name}`;
    }else{
      this.consent_msg = `I agree and approve Xuriti and it's financing partner ${ this.nbfc_name }  is authorised to disburse funds to the\nSeller- ${ this.seller_name } for invoice- ${ this.invoice_number } on my behalf.`;      
    }
  }

  consent_cheack(val: any) {
    this.consentflag = val.checked;
  }

  onSubmit() {
    if (this.invoice_reject_form.valid) {
      const data = {
        invoice_comment: this.invoice_reject_form.value.invoice_comment,
        userConsentGiven: this.consentflag,
        consent_msg: this.consent_msg,
        consentimeStamp: Date.now(),
      };
      this.dialogRef.close(data);
    }
  }

  cancle() {
    this.dialogRef.close();
  }
}
