import { Component, Inject, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-creditplan-mapping-error",
  templateUrl: "./creditplan-mapping-error.component.html",
  styleUrls: ["./creditplan-mapping-error.component.scss"],
})
export class CreditplanErrorComponent implements OnInit {
  displayedColumns: string[] = [
    "company_name",
    "GST",
    "status",
    "message",
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){
  }

  ngOnInit(){
    this.dataSource = new MatTableDataSource(this.data);
  }

  dataSource = new MatTableDataSource([]);
}
