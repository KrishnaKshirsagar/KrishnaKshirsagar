import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-payment-error",
  templateUrl: "./payment-error.component.html",
  styleUrls: ["./payment-error.component.scss"],
})
export class PaymentErrorComponent implements OnInit {
  form!: FormGroup;

  pwdVisible = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PaymentErrorComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      password: ["", [Validators.required]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
