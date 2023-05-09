import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-invoice-error",
  templateUrl: "./invoice-error.component.html",
  styleUrls: ["./invoice-error.component.scss"],
})
export class InvoiceErrorComponent implements OnInit {
  invoice_reject_form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InvoiceErrorComponent>
  ) {}

  ngOnInit(): void {
    this.invoice_reject_form = this.fb.group({
      invoice_comment: ["", [Validators.required]],
    });
  }

  onSubmit() {
    if (this.invoice_reject_form.valid) {
      this.dialogRef.close(this.invoice_reject_form.value);
    }
  }
}
