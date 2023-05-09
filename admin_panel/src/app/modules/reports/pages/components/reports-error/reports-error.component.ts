import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-reports-error",
  templateUrl: "./reports-error.component.html",
  styleUrls: ["./reports-error.component.scss"],
})
export class ReportsErrorComponent implements OnInit {
  form!: FormGroup;

  pwdVisible = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReportsErrorComponent>
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
