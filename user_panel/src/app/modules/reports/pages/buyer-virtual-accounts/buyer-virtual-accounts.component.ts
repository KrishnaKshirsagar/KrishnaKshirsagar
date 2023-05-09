import { LiveAnnouncer } from '@angular/cdk/a11y';
import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CURRENCY_FORMAT, DATE_FORMAT } from 'src/app/shared/constants/constants';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-transactionledger',
  templateUrl: './buyer-virtual-accounts.component.html',
  styleUrls: ['./buyer-virtual-accounts.component.scss']
})

export class BuyerVirtualAccountsComponent implements OnInit {

  currency_format = CURRENCY_FORMAT;

  date_format = DATE_FORMAT;

  redirect!: string;

  selection = "";

  user_type: string = '';

  seller_flag = ''

  counter_party: string = ""

  companyid!: string;

  maxDate!: Date;

  as_no_date!: Date;


  displayedColumns: string[] = [
    "Buyer Name",
    "Buyer GST",
    "Buyer VAN",
    "Credit Limit",
    "Credit Available",
  ];

  dataSource = new MatTableDataSource([]);

  company_Name!: any[];
  anchor_id: any;
  dealer_id: any;
  filterInvoiceByDate: any;
  durationInSeconds = 2;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private snackBar: MatSnackBar
  ) { }

  anchorSelect = new FormControl();

  dealer = new FormControl();

  ngOnInit(): void {
    this.as_no_date = new Date();
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });
    this.seller_flag =  sessionStorage.getItem("seller_flag");
    this.user_type = (this.seller_flag == 'true') ? 'seller' : 'buyer';

    const cid = sessionStorage.getItem("companyid");
    if (cid && cid != undefined && cid != null) {
      this.companyid = cid;
      this.getVirtualAccounts();

    }
    this.maxDate = new Date();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  selectedUserView(mode: string) {
    this.user_type = mode;
    this.getTransactionLedger();
  }

  counterPartySelect = new FormControl();

  counter_party_clear(ctrl: any) {
    ctrl.setValue("");
    this.counter_party = "";
    this.getTransactionLedger();
  }

  applyFilter(event: Event): void {
    const filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    this.dataSource.filter = filter;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  } 

  getTransactionLedger() {
    let filter: any = {}

    if (this.user_type !== undefined || this.user_type !== "") {
      filter.user_type = this.user_type;
      filter._id = this.companyid;
    }

    if (this.filterInvoiceByDate != undefined && this.filterInvoiceByDate != "") {
      filter.as_on_date = this.filterInvoiceByDate;
    }

    if (filter.user_type && filter.user_type !== null && filter.user_type !== undefined &&
      filter._id && filter._id !== null && filter._id !== undefined) {
      this.apiService.getTransactionLedger(filter).subscribe((res: any) => {
         console.log(res)
        if (res.status == true) {
          this.dataSource = new MatTableDataSource(res.transaction);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          const sortState: Sort = { active: "createdAt", direction: "asc" };
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
        }
        else {
          this.dataSource = new MatTableDataSource([]);
        }
      })
    } else {
      this.dataSource = new MatTableDataSource([]);

      this.snackBar.open("Please select user view ", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
  }

  getVirtualAccounts() {
    console.log("function called")
    let filter: any = {}

    if (this.user_type !== undefined || this.user_type !== "") {
      filter.user_type = this.user_type;
      filter._id = this.companyid;
    }

    if (this.filterInvoiceByDate != undefined && this.filterInvoiceByDate != "") {
      filter.as_on_date = this.filterInvoiceByDate;
    }

    if (filter.user_type && filter.user_type !== null && filter.user_type !== undefined &&
      filter._id && filter._id !== null && filter._id !== undefined) {
      this.apiService.getVirtualAccounts(filter).subscribe((res: any) => {
        // console.log(filter._id);
        // console.log(res)
        if (res.status == true) {
          console.log(res.buyer_virtual_account)
          this.dataSource = new MatTableDataSource(res.buyer_virtual_account);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          const sortState: Sort = { active: "createdAt", direction: "asc" };
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
        }
        else {
          this.dataSource = new MatTableDataSource([]);
        }
      })
    } else {
      this.dataSource = new MatTableDataSource([]);

      this.snackBar.open("Please select user view ", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
  }

  getTransactionType(element: any) {
    const type = element && element.record_type ? element.record_type : ''
    if (type == 'SALESINVOICE') {
      return 'Sales Invoice';
    } else if (type == 'BPAYMENT') {
      return 'Buyer Payment';
    } else if (type == 'DISCOUNT') {
      return 'Discount'
    } else if (type == 'INTERST') {
      return 'Interest'
    } else if (type == 'SPAYMENT') {
      return 'Supplier Payment'
    } else if (type == 'CREDIT NOTE') {
      return 'Credit Note'
    }
    else {
      return type;
    }
  }

  // As On Date
  as_On_Date() {
    this.filterInvoiceByDate = formatDate(
      this.as_no_date,
      "yyyy-MM-dd",
      "en-US"
    );
    this.getTransactionLedger();
  }

  // clear input boxes
  anchor_clear() {
    this.anchorSelect = new FormControl;
    this.company_Name = [];
    this.anchor_id = "";
    this.getTransactionLedger();
  }
}
