import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-usermanagement-error",
  templateUrl: "./usermanagement-error.component.html",
  styleUrls: ["./usermanagement-error.component.scss"],
})
export class UsermanagementErrorComponent implements OnInit {
  form!: FormGroup;

  pwdVisible = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UsermanagementErrorComponent>
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
