import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { InvoiceErrorComponent } from "../components/invoice-error/invoice-error.component";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { CURRENCY_FORMAT } from "src/app/shared/constants/constants";
@Component({
  selector: "app-invoicedetails",
  templateUrl: "./invoicedetails.component.html",
  styleUrls: ["./invoicedetails.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class InvoicedetailsComponent implements AfterViewInit {
  displayedColumns: string[] = [
    "invoiceno",
    "sellername",
    "invoiceamount",
    "duedate",
    "outamount",
    "status",
    "actions",
  ];

  currency_format = CURRENCY_FORMAT;
  dataSource = new MatTableDataSource([]);

  openDialog1() {
    const dialogRef = this.dialog.open(InvoicedetailsDialog);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {}

  redirect!: string;

  changeText: boolean = false;

  invoiceDetail: any;

  companyid!: string;

  private token!: string;

  private invoiceData: any;

  pwdVisible = false;

  constructor(
    private dataRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    // this.route.queryParams.subscribe((queryParams) => {
    //   console.log("Data from invoice page : ", queryParams);
    //   if (queryParams['redirect']) {
    //     this.redirect = queryParams['redirect'];
    //   }
    // });
    this.route.queryParams.subscribe((params) => {
      this.invoiceDetail = JSON.parse(params["invoiceDetail"]);
    });
    const cid = sessionStorage.getItem("companyid");
    if (cid && cid != undefined && cid != null) {
      this.companyid = cid;
    }
  }

  openDialog() {
    this.dialog.open(InvoiceErrorComponent);
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
}

@Component({
  selector: "invoicedetails-dialog",
  templateUrl: "invoicedetails-dialog.html",
  styleUrls: ["./invoicedetails.component.scss"],
})
export class InvoicedetailsDialog {}
