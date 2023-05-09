import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Data } from "@angular/router";

@Component({
  selector: "app-company-error",
  templateUrl: "./company-error.component.html",
  styleUrls: ["./company-error.component.scss"],
})
export class CompanyErrorComponent implements OnInit {
  pwdVisible = false;

  title!: string;

  msg!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Data,
    public dialogRef: MatDialogRef<CompanyErrorComponent>
  ) {}

  ngOnInit(): void {
    this.title = this.data["title"];
    this.msg = this.data["msg"];
  }
}
