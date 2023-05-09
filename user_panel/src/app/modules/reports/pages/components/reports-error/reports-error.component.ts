import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-reports-error",
  templateUrl: "./reports-error.component.html",
  styleUrls: ["./reports-error.component.scss"],
})
export class ReportsErrorComponent implements OnInit {
  invoice_reject_form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReportsErrorComponent>
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
