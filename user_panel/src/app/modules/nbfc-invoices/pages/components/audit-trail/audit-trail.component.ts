import { Component, Inject, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {
  CURRENCY_FORMAT, DATE_FORMAT
} from "src/app/shared/constants/constants";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiService } from "../../../services/api/api.service";
import { AstMemoryEfficientTransformer } from "@angular/compiler";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

// =================  Pament dia =======================



export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
  ams: string;
}

@Component({
  selector: "app-audit-trail",
  templateUrl: "audit-trail.html",
  styleUrls: ["audit-trail.component.scss"],
})

export class AuditTrailComponent implements AfterViewInit{

  currency_format = CURRENCY_FORMAT;

  date_format = DATE_FORMAT + ' h:mm:ss a'

  invoiceid!: string;

  audit_trail: any = [];

  displayedColumns: string[] = ['action', 'timeStamp', 'user_name', 'userIp'];
 
  dataSource = new MatTableDataSource<UserData>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiservice: ApiService
  ) {
    this.invoiceid = data && data.id ? data.id : '';
    this.audit_trail = data && data.metadata && data.metadata.audit_trail ? data.metadata.audit_trail : [];
    this.dataSource = new MatTableDataSource(this.audit_trail);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  download_audittrail(){    
    if(this.invoiceid != undefined && this.invoiceid != ''){
    this.apiservice.download_audittrail(this.invoiceid).subscribe((res: any) => {
      if(res && res.status == true){
        window.open(res.url);
      }
    })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


