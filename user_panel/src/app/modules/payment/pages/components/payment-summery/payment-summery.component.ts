import { Component, Inject, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
  LOCAL_STORAGE_AUTH_DETAILS_KEY,
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
  selector: "app-payment-summery",
  templateUrl: "payment-summery.html",
  styleUrls: ["payment-summery.component.scss"],
})

export class PaymentSummeryComponent implements AfterViewInit{

  currency_format = CURRENCY_FORMAT;

  displayedColumns: string[] = ['invoice_number', 'previous_outstanding', 'amount_cleared', 'gst', 'discount', 'interest', 'outstanding_amount'];
 
  dataSource = new MatTableDataSource<UserData>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dataSource = new MatTableDataSource(data);
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


