import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../services/api/api.service";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
import { FormControl, FormGroup } from "@angular/forms";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-emandateshistory",
  templateUrl: "./emandateshistory.component.html",
  styleUrls: ["./emandateshistory.component.scss"],
  providers: [],
})
export class EmandateshistoryComponent implements AfterViewInit {

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  limit = 10;

  length = 0;

  page = 1;

  sortBy!: string;

  search!: string;

  maxDate!: Date;

  transactionDate!: any;

  displayedColumns: string[] = [
    "payment_Id",
    "invoice_no",
    "due_date",
    "new_due_date",
    // 'usertype',
    "updated_at",
    "outstanding_amount",
    "status",
  ];
  dataSource = new MatTableDataSource([]);
  invoice_number!: string;
  filterInvoiceByDate: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.getEmandateHistory();
    this.maxDate = new Date();
  }

  getEmandateHistory() {
    let data: any = {};
    if (this.invoice_number) {
      data.invoice_number = this.invoice_number;
    }
    if (this.filterInvoiceByDate) {
      data.transaction_date = this.filterInvoiceByDate;
    }

    this.apiService.get_emandateHistory(data).subscribe((response: any) => {
      if (response.status == true) {
        this.dataSource =
          response && response.tranc_details ? response.tranc_details : [];
        this.dataSource.paginator = this.paginator;

        // this.sort.sort(({ id: 'updated_at', start: 'desc'}) as MatSortable);
        // this.dataSource.sort = this.sort;
        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "updated_at", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    });
  }

  getNewduedate(entity: any) {
    const new_due_date =
      entity && entity.new_due_date && entity.new_due_date != " 23:59:59"
        ? entity.new_due_date
        : "";
    return new_due_date;
  }

  getDueDate(entity: any) {
    const due_date =
      entity && entity.due_date && entity.due_date != " 23:59:59"
        ? entity.due_date
        : "";
    return due_date;
  }

  openDialog() {
    this.dialog.open(EmandateshistoryDialog);
  }

  applyPagination(event: PageEvent) {
    this.limit = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getEmandateHistory();
  }

  // filter Emanted History
  get_transaction_date() {
    this.filterInvoiceByDate = formatDate(
      this.transactionDate,
      "yyyy-MM-dd",
      "en-US"
    );
    this.getEmandateHistory();
  }

  invoiceNumberFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.invoice_number = filterValue;
    this.getEmandateHistory();
  }

  invoiceNumberControl = new FormControl("");
  clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.invoice_number = "";
    this.getEmandateHistory();
  }

  date_cancle(date : any){
    if (date == "transaction_date") {
      this.filterInvoiceByDate = "";
      this.transactionDate = "";
      this.getEmandateHistory();
    } 
 }
}

@Component({
  selector: "emandateshistory-dialog",
  templateUrl: "emandateshistory-dialog.html",
  styleUrls: ["./emandateshistory.component.scss"],
})
export class EmandateshistoryDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}
