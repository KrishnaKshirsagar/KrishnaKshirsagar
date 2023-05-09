import { LiveAnnouncer } from "@angular/cdk/a11y";
import { AfterViewInit, Component, Inject, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { InvoiceErrorComponent } from "../components/invoice-error/invoice-error.component";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
import { FormControl } from "@angular/forms";
import { filter } from "rxjs";

@Component({
  selector: "app-salesdashboard",
  templateUrl: "./salesdashboard.component.html",
  styleUrls: ["./salesdashboard.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class SalesdashboardComponent implements AfterViewInit {

  invoiceList:any;
  Date_Format = DATE_FORMAT;

  currency_Format = CURRENCY_FORMAT;

  companySelect: FormControl = new FormControl();

  companyGSTSelect: FormControl = new FormControl();

  invoice_number: FormControl = new FormControl();

  companyList!: any;
  companyGST!: any;

  displayedColumns: string[] = [
    "invoice_number",
    "invoice_type",
    "company_name",
    "buyer_gst",
    "invoice_date",
    "invoice_amount",
    "total_tax",
    // "extended_due_date",
    "outstanding_amount",
    "invoice_due_date",
    "invoice_status",
    "disbursement_status",
    "disbursement_date",
    "disbursement_amount",
    "createdAt",
    "comment",
  ];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  redirect!: string;

  changeText: boolean = false;

  company_gst: string = "";

  invoiceNumber: string = "";

  companyid!: string;

  durationInSeconds = 2;

  private token!: string;

  pwdVisible = false;

  selectedCompanyId!: any;

  invoice_due_in!: string;

  invoice_status!: string;

  userType = "buyer";

  invoice_type: string = "";

  disbursement_status: string  = "";

  constructor(
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });
    const cid = sessionStorage.getItem("companyid");
    if (cid && cid != undefined && cid != null) {
      this.companyid = cid;
    }
    // this.getInvoiceByCompanyId();
    this.filterInvoices();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog1() {
    const dialogRef = this.dialog.open(SalesdashboardDialog);
  }

  openInvoicePage(mode: string) {
    if (mode == "sales") {
      this.router.navigate([`/companies/${this.companyid}/invoices/sales`]);
    } else {
      this.router.navigate([`/companies/${this.companyid}/invoices/purchases`]);
    }
  }

  getInvoiceByCompanyId() {
    const body = {
      type: "seller",
      id: this.companyid,
    };
    this.apiService.getInvoicesByCompanyId(body).subscribe((response: any) => {
      
      if (response.status == true) {
        this.dataSource = new MatTableDataSource(response.invoice);
        this.dataSource.paginator = this.paginator;

        // this.sort.sort({ id: "createdAt", start: "desc" } as MatSortable);
        // this.dataSource.sort = this.sort;
        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "createdAt", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    });
  }
  // get Invoice status
  getstatus(status: string): any {
    if (status == "Partpay") {
      return (status = "Part Pay");
    } else {
      return (status = status);
    }
  }

  uploadInvoices() {
    this.router.navigate([
      `/companies/${this.companyid}/invoices/invoiceupload`,
    ]);
  }

  viewInvoice(invoicelink: any) {
    if (invoicelink && invoicelink != "" && invoicelink != undefined) {
      window.open(invoicelink, "_blank");
    } else {
      this.snackBar.open("Unable to download the invoice file.", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
  }

  openDialog() {
    this.dialog.open(InvoiceErrorComponent);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //========= invoice filter ===========

  filterInvoices() {
    let filterdata: any = {};
    if (this.invoice_due_in) {
      filterdata.invoice_due_in = this.invoice_due_in;
    }
    if (this.invoice_status) {
      filterdata.invoice_status = this.invoice_status;
    }
    if (this.selectedCompanyId) {
      filterdata.companyid = this.selectedCompanyId;
    }
    if (this.invoice_type) {
      filterdata.invoice_type = this.invoice_type;
    }
    if (this.disbursement_status) {
      filterdata.disbursement_status = this.disbursement_status;
    }
    filterdata.type = this.userType;

    const body = {
      type: "seller",
      id: this.companyid,
    };

    this.apiService
      .filterInvoices(body, filterdata)
      .subscribe((response: any) => {
        if (response.status == true) {
          this.invoiceList =response?.invoice
          this.dataSource = new MatTableDataSource(response.invoice);
          this.dataSource.paginator = this.paginator;

          // this.sort.sort({ id: "createdAt", start: "desc" } as MatSortable);
          // this.dataSource.sort = this.sort;
          this.dataSource.sort = this.sort;
          const sortState: Sort = { active: "createdAt", direction: "desc" };
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
        } else {
          this.dataSource = new MatTableDataSource([]);
        }
      });
  }
  disbursementStatus(disbursement_status:string){
    this.disbursement_status = disbursement_status;
    this.filterInvoices();
  }
  applyFilterBuyergst(event: Event): void {
    const filter = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.dataSource.filter = filter;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterInvoiceNumber(event: Event): void {
    const filter = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.dataSource.filter = filter;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  companySuggetion(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2) {
      let companyName = filterValue.toLocaleUpperCase().trim();
      this.apiService
        .companynameAutoSuggestion(companyName)
        .subscribe((res) => {
          this.companyList = [...res.companies];
        });
    }
  }

  displayFn(company: any): string {
    return company && company.company_name ? company.company_name : "";
  }

  getPosts(companyid: any) {
    this.userType = "buyer";
    this.selectedCompanyId = companyid._id;
    this.filterInvoices();
  }

  invoiceDueIn(invoice_due_in: string) {
    this.invoice_due_in = invoice_due_in;
    this.filterInvoices();
  }

  invoiceStatus(invoice_status: any) {
    switch (invoice_status.index) {
      case 1:
        this.invoice_status = "Pending";
        break;

      case 2:
        this.invoice_status = "Confirmed";
        break;

      case 3:
        this.invoice_status = "Partpay";
        break;

      case 4:
        this.invoice_status = "Paid";
        break;

      default:
        this.invoice_status = "";
        break;
    }
    this.filterInvoices();
  }

  invoiceType(invoice_type: string) {
    this.invoice_type = invoice_type;
    this.filterInvoices();
  }

  company_name_clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.userType = "";
    this.selectedCompanyId = "";
    this.filterInvoices();
  }

  company_gst_clear(ctrl: any) {
    ctrl.setValue("");
    this.company_gst = "";
    // this.getInvoiceByCompanyId();
    this.filterInvoices();
  }

  invoice_number_clear(ctrl: any) {
    ctrl.setValue("");
    this.invoiceNumber = "";
    // this.getInvoiceByCompanyId();
    this.filterInvoices();
  }
  open_dialog(comment: any) {
    this.dialog.open(CommentDialog, {
      data: comment,
      height: "200px",
      width: "300px",
    });
  }
}

@Component({
  selector: "salesdashboard-dialog",
  templateUrl: "salesdashboard-dialog.html",
  styleUrls: ["./salesdashboard.component.scss"],
})
export class SalesdashboardDialog {}

@Component({
  selector: "comment-dialog",
  templateUrl: "comment-dialog.html",
  styleUrls: ["./salesdashboard.component.scss"],
})
export class CommentDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public comment: any) {}
}
