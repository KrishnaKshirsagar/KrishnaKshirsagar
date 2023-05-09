import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-nbfc-error",
  templateUrl: "./nbfc-error.component.html",
  styleUrls: ["./nbfc-error.component.scss"],
})
export class NbfcErrorComponent implements OnInit {
  form!: FormGroup;

  pwdVisible = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NbfcErrorComponent>
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
