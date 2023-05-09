import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../services/api/api.service";
import { NavigationExtras, Router } from "@angular/router";
import { CURRENCY_FORMAT, DATE_FORMAT } from "src/app/shared/constants/constants";
import { FormControl, FormGroup } from "@angular/forms";
import { formatDate } from "@angular/common";
import { CommentHistoryDailogComponent } from "../components/comment-history-dailog/comment-history-dailog.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-companylist",
  templateUrl: "./companylist.component.html",
  styleUrls: ["./companylist.component.scss"],
  providers: [],
})

export class CompanylistComponent implements AfterViewInit {

  Date_Format = DATE_FORMAT;

  Currency_Format = CURRENCY_FORMAT

  changeText: boolean = false;

  createdAt = ""; //Registered date

  companyList: any = {};

  companySelect: FormControl = new FormControl();

  maxDate!: Date;

  creatidlimitflag = false;

  userRole = sessionStorage.getItem("Role");

  displayedColumns: string[] = [
    "company_name",
    "companyaddress",
    "gstin",
    "admin_email",
    "admin_mobile",
    "creditLimit",
    "avail_credit",
    "kyc_document_upload",
    "status",
    "createdAt",
    "actions",
  ];
  dataSource = new MatTableDataSource([]);

  filter: any = {};
  durationInSeconds: number = 2;

  ngOnInit(): void {
    this.getCompanyList();
    this.maxDate = new Date();
    if (this.userRole == "xuritiCreditMgr") {
      this.creatidlimitflag = true;
    }
  }

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    public dialog: MatDialog,
    private apiService: ApiService,
    private dialogRef1: MatDialogRef<CommentHistoryDailogComponent>, 
    private snackBar : MatSnackBar
  ) {}

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showAllCompany(event: Event) {
    const gst = (event.target as HTMLInputElement).value;
    if (gst == "") {
      this.getCompanyList();
    }
  }
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

  getCompanyList() {
    this.apiService
      .getCompanyList()
      .subscribe((response: any) => {
        if (response && response.status == true) {
          this.companyList =
            response && response.companies ? response.companies : [];
          this.dataSource = new MatTableDataSource(this.companyList);
          this.dataSource.paginator = this.paginator;
          // this.sort.sort(({ id: 'created', start: 'desc'}) as MatSortable);
          // this.dataSource.sort = this.sort;

          this.dataSource.sort = this.sort;
          const sortState: Sort = { active: "createdAt", direction: "desc" };
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
        } else {
          this.dataSource = new MatTableDataSource();
        }
      });
  }

  editCompany(element: any) {
    const companyId = element._id;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        companyid: JSON.stringify(companyId),
      },
    };
    this.router.navigate(
      [`admin/companies/${companyId}/companydetails`],
      navigationExtras
    );
  }

  openInvoicePage(element : any){
      const obj = {
        _id          : element._id,
        seller_flag  : element.seller_flag,
        gstin : element.gstin,
        company_name : element.company_name
      }
      
      let navigationExtras: NavigationExtras = {
        queryParams: {
          obj: JSON.stringify(obj),
        },
      };
      this.router.navigate(
        [`admin/invoices`],
        navigationExtras
      );
  }

  open_payment_history(element : any){
    const obj = {
      _id          : element._id,
      seller_flag  : element.seller_flag,
      gstin : element.gstin,
      company_name : element.company_name
    }
    
    let navigationExtras: NavigationExtras = {
      queryParams: {
        obj: JSON.stringify(obj),
      },
    };
    this.router.navigate(
      [`admin/payment`],
      navigationExtras
    );
  }

  companyKycDetails(element: any) {
    const companyId = element._id;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        companyid: JSON.stringify(companyId),
      },
    };
    this.router.navigate(
      [`admin/companies/${companyId}/kycdetails`],
      navigationExtras
    );
  }

  companyGSTDetails(element: any) {
    const gst = element.gstin;
    const companyId = element._id;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        gst: JSON.stringify(gst),
      },
    };
    this.router.navigate(
      [`admin/companies/${companyId}/gstdetails`],
      navigationExtras
    );
  }

  openCreditApprovalPage() {
    this.router.navigate([`admin/companies/creditlimitverification`]);
  }

  companyCreditPlan(element: any) {
    this.router.navigate([`admin/companies/${element._id}/creditplanslist`]);
  }

  openDialog() {
    this.dialog.open(CompanyapproveDialog);
  }

  // =========== company filter ===========

  filterEntities() {
    this.apiService.filterentities(this.filter).subscribe((response: any) => {
      if (response.status == true) {
        this.companyList =
          response && response.companies ? response.companies : [];
        this.dataSource = new MatTableDataSource(this.companyList);
        this.dataSource.paginator = this.paginator;

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

  filterbygstno(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.filter.gstin = filterValue.toLocaleUpperCase();
    this.filterEntities();
  }

  filterByAdminEmail(email:any){
    const filterValue = (email.target as HTMLInputElement).value
    .trim()
    .toLocaleLowerCase();
  this.filter.email = filterValue.toLocaleUpperCase();
  this.filterEntities();
  }

  filterByAdminMobile(mobile:any){
    const filterValue = (mobile.target as HTMLInputElement).value
    .trim()
    .toLocaleLowerCase();
  this.filter.mobile = filterValue.toLocaleUpperCase();
  this.filterEntities();
  }

  companiesByStatus(event: string) {
    const filterValue = event;
    this.filter.company_status = filterValue;
    this.filterEntities();
  }

  datefilter() {
    const start = this.dateRange.value.start;
    const end = this.dateRange.value.end;

    if (end !== null) {
    this.filter.from = formatDate(start, "yyyy-MM-dd", "en-US");
    this.filter.to = formatDate(end, "yyyy-MM-dd", "en-US");
    this.filterEntities();
    }
    else{
      this.snackBar.open(
        "Please select date range",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
      this.filter.from = "";
      this.filter.to = "";
      this.dateRange = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
      });
      this.filterEntities();
    }
  }

  // =========== company filter by company name ========

  filterCompanyName(company_name: any) {
    const filterValue = (company_name.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.filter.company_Name = filterValue.toLocaleUpperCase();
    this.filterEntities();
  }

  companyNameControl = new FormControl();
  gstControl = new FormControl();
  emailControl = new FormControl();
  mobileControl = new FormControl();

  clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.filter.company_Name = "";
    this.filterEntities();
  }

  gstclear(ctrl: FormControl) {
    ctrl.setValue("");
    this.filter.gstin = "";
    this.filterEntities();
  }

  date_cancle(date : any){
    if (date == "date_range") {
      this.filter.from = "";
      this.filter.to = "";
      this.dateRange = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
      });
      this.filterEntities();

    } 
}

email_clear(ctrl: FormControl){
    ctrl.setValue("");
    this.filter.email = "";
    this.filterEntities();
}

mobile_clear(ctrl: FormControl){
    ctrl.setValue("");
    this.filter.mobile = "";
    this.filterEntities();
}

openCommentsDialog(comment:any) {
    let obj = {
      company_id : comment._id,
      gst: comment.gstin
    }
    this.dialogRef1 = this.dialog.open(CommentHistoryDailogComponent, {
      data: {
        object: obj,
        position: {right:'10px', top: '10px'} 
      },
    });
}
}

@Component({
  selector: "companyapprove-dialog",
  templateUrl: "companyapprove-dialog.html",
  styleUrls: ["./companylist.component.scss"],
})
export class CompanyapproveDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}
