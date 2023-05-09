import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-dialog-confirm",
  templateUrl: "./dialog-confirm.component.html",
  styleUrls: ["./dialog-confirm.component.scss"],
})
export class DialogConfirmComponent implements OnInit {
  form!: FormGroup;

  pwdVisible = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogConfirmComponent>
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
