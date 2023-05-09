import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
@Component({
  selector: "app-conform-dailog",
  templateUrl: "./conform-dailog.component.html",
  styleUrls: ["./conform-dailog.component.scss"],
})
export class ConformDailogComponent implements OnInit {
  deleteflag = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConformDailogComponent>
  ) {}

  ngOnInit(): void {}

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.deleteflag = true;
    this.dialogRef.close(this.deleteflag);
  }
}
