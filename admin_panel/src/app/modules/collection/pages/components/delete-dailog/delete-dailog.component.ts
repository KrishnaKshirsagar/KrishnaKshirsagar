import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-delete-dailog",
  templateUrl: "./delete-dailog.component.html",
  styleUrls: ["./delete-dailog.component.scss"],
})
export class DeleteDailogComponent implements OnInit {
  deleteflag = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialogRef: MatDialogRef<DeleteDailogComponent>
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
