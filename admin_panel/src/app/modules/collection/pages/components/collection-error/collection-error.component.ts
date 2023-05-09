import { AfterViewInit, Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CURRENCY_FORMAT } from "src/app/shared/constants/constants";

@Component({
  selector: "app-collection-error",
  templateUrl: "./collection-error.component.html",
  styleUrls: ["./collection-error.component.scss"],
})
export class CollectionErrorComponent implements AfterViewInit {
  currency_format = CURRENCY_FORMAT;

  audit_trail: any = [];

  displayedColumns: string[] = ['action', 'timeStamp', 'user_name', 'userIp'];
 
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.audit_trail = data && data.comment_history ? data.comment_history : [];
    this.dataSource = new MatTableDataSource(this.audit_trail);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get_action(action : any) : any{
    if (action == "Invoice Partpay") {
      return "Invoice Part Pay"
    }
    else{
     return action
    }
 }

}
