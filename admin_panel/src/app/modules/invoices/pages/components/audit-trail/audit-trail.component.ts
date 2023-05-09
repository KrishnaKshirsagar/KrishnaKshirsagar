import { Component, Inject, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CURRENCY_FORMAT, DATE_FORMAT } from "src/app/shared/constants/constants";

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss']
})
export class AuditTrailComponent implements AfterViewInit {

  currency_format = CURRENCY_FORMAT;

  date_format = DATE_FORMAT + ' hh:mm:ss a'

  audit_trail: any = [];

  displayedColumns: string[] = ['action', 'timeStamp', 'user_name', 'userIp'];
 
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.audit_trail = data && data.metadata && data.metadata.audit_trail ? data.metadata.audit_trail : [];
    this.dataSource = new MatTableDataSource(this.audit_trail);
  }
  
  get_action(action : any) : any{
     if (action == "Invoice Partpay") {
       return "Invoice Part Pay"
     }
     else{
      return action
     }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
