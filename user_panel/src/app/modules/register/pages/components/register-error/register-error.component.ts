import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Data } from "@angular/router";

@Component({
  selector: "app-register-error",
  templateUrl: "./register-error.component.html",
  styleUrls: ["./register-error.component.scss"],
})
export class RegisterErrorComponent implements OnInit {
  title!: string;

  msg!: string;

  pwdVisible = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Data,
    public dialogRef: MatDialogRef<RegisterErrorComponent>
  ) {}

  ngOnInit(): void {
    this.title = this.data["title"];
    this.msg = this.data["msg"];
  }

  onSubmit() {
    this.dialogRef.close();
  }
}
