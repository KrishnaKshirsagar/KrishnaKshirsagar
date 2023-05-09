import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
@Component({
  selector: "app-sellerinvoices",
  templateUrl: "./sellerinvoices.component.html",
  styleUrls: ["./sellerinvoices.component.scss"],
  providers: [],
})
export class SellerinvoicesComponent implements AfterViewInit {
  displayedColumns: string[] = [
    "companyname",
    "invoicedate",
    "invoiceduedate",
    "invoiceamount",
    "gstnumber",
    "invoicestatus",
    "actions",
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  openDialog() {
    this.dialog.open(SellerinvoicesDialog);
  }
}

@Component({
  selector: "sellerinvoices-dialog",
  templateUrl: "sellerinvoices-dialog.html",
  styleUrls: ["./sellerinvoices.component.scss"],
})
export class SellerinvoicesDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}

export interface PeriodicElement {
  companyname: string;
  invoicedate: string;
  invoiceduedate: string;
  gstnumber: string;
  invoiceamount: string;
  invoicestatus: string;
  actions: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    companyname: "ABC Pvt. Ltd",
    invoicedate: "15/09/2021",
    invoiceduedate: "15/10/2021",
    gstnumber: "18AABCU9603R1ZM",
    invoiceamount: "22423233",
    invoicestatus: "Seller Absent",
    actions: "Active",
  },

  {
    companyname: "ABC Pvt. Ltd",
    invoicedate: "15/09/2021",
    invoiceduedate: "15/10/2021",
    gstnumber: "18AABCU9603R1ZM",
    invoiceamount: "22423233",
    invoicestatus: "Pending Confirmation",
    actions: "Active",
  },

  {
    companyname: "ABC Pvt. Ltd",
    invoicedate: "15/09/2021",
    invoiceduedate: "15/10/2021",
    gstnumber: "18AABCU9603R1ZM",
    invoiceamount: "22423233",
    invoicestatus: "Buyer Absent",
    actions: "Active",
  },

  {
    companyname: "ABC Pvt. Ltd",
    invoicedate: "15/09/2021",
    invoiceduedate: "15/10/2021",
    gstnumber: "18AABCU9603R1ZM",
    invoiceamount: "22423233",
    invoicestatus: "Incomplete",
    actions: "Active",
  },

  {
    companyname: "ABC Pvt. Ltd",
    invoicedate: "15/09/2021",
    invoiceduedate: "15/10/2021",
    gstnumber: "18AABCU9603R1ZM",
    invoiceamount: "22423233",
    invoicestatus: "Rejected",
    actions: "Active",
  },

  {
    companyname: "ABC Pvt. Ltd",
    invoicedate: "15/09/2021",
    invoiceduedate: "15/10/2021",
    gstnumber: "18AABCU9603R1ZM",
    invoiceamount: "22423233",
    invoicestatus: "Confirmed",
    actions: "Active",
  },

  {
    companyname: "ABC Pvt. Ltd",
    invoicedate: "15/09/2021",
    invoiceduedate: "15/10/2021",
    gstnumber: "18AABCU9603R1ZM",
    invoiceamount: "22423233",
    invoicestatus: "Pending Confirmation",
    actions: "Active",
  },

  {
    companyname: "ABC Pvt. Ltd",
    invoicedate: "15/09/2021",
    invoiceduedate: "15/10/2021",
    gstnumber: "18AABCU9603R1ZM",
    invoiceamount: "22423233",
    invoicestatus: "Seller Absent",
    actions: "Active",
  },

  {
    companyname: "ABC Pvt. Ltd",
    invoicedate: "15/09/2021",
    invoiceduedate: "15/10/2021",
    gstnumber: "18AABCU9603R1ZM",
    invoiceamount: "22423233",
    invoicestatus: "Buyer Absent",
    actions: "Active",
  },

  {
    companyname: "ABC Pvt. Ltd",
    invoicedate: "15/09/2021",
    invoiceduedate: "15/10/2021",
    gstnumber: "18AABCU9603R1ZM",
    invoiceamount: "22423233",
    invoicestatus: "Incomplete",
    actions: "Active",
  },

  {
    companyname: "ABC Pvt. Ltd",
    invoicedate: "15/09/2021",
    invoiceduedate: "15/10/2021",
    gstnumber: "18AABCU9603R1ZM",
    invoiceamount: "22423233",
    invoicestatus: "Rejected",
    actions: "Active",
  },

  {
    companyname: "ABC Pvt. Ltd",
    invoicedate: "15/09/2021",
    invoiceduedate: "15/10/2021",
    gstnumber: "18AABCU9603R1ZM",
    invoiceamount: "22423233",
    invoicestatus: "Confirmed",
    actions: "Active",
  },
];
