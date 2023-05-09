import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
  LOCAL_STORAGE_AUTH_DETAILS_KEY,
} from "src/app/shared/constants/constants";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-associated-entities",
  templateUrl: "./associated-entities.component.html",
  styleUrls: ["./associated-entities.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class AssociatedEntitiesComponent implements AfterViewInit {
  Date_Format = DATE_FORMAT;

  currency_Format = CURRENCY_FORMAT;

  action_flag: boolean = false;

  selectedCompanyId!: string;

  company_name!: string;

  companyList!: any[];

  companySelect: FormControl = new FormControl();

  gstControl = new FormControl();

  displayedColumns1: string[] = [
    "nbfc_name",
    "company_name",
    "gstin",
    "company_email",
    "company_mobile",
    "creditLimit",
    "avail_credit",
    "createdAt",
  ];

  displayedColumns2: string[] = [
    "company_name",
    "gstin",
    "company_email",
    "company_mobile",
    "createdAt",
  ];

  dataSource1 = new MatTableDataSource([]);

  dataSource2 = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator1!: MatPaginator;

  @ViewChild(MatPaginator) paginator2!: MatPaginator;

  @ViewChild(MatSort) sort1!: MatSort;

  @ViewChild(MatSort) sort2!: MatSort;

  redirect!: string;

  private token!: string;

  private durationInSeconds = 2;

  companyid!: string;

  userid!: string;

  user_role!: string;

  userType = "seller";

  seller_flag = "";

  company_details: any = [];

  gstin!: string;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });
    this.seller_flag = sessionStorage.getItem("seller_flag");
    this.userid = sessionStorage.getItem("userid");
    this.user_role = sessionStorage.getItem("Role");
    this.userType = this.seller_flag == "true" ? "seller" : "buyer";
    const cid = sessionStorage.getItem("companyid");
    if (cid && cid != undefined && cid != null) {
      this.companyid = cid;
    }
    this.getAssociatedCompaniesByCompanyId();
  }

  ngAfterViewInit() {
    this.dataSource1.paginator = this.paginator1;
    this.dataSource2.paginator = this.paginator2;
  }

  openInvoicePage(mode: string) {
    this.userType = mode;
    this.getAssociatedCompaniesByCompanyId();
  }

  getAssociatedCompaniesByCompanyId() {
    let body = {};
    if (this.companyid == "All" && this.user_role == "HO_user") {
      body = {
        type: this.userType,
        user_id: this.userid,
        id: this.companyid,
        company_name: this.company_name,
        gstin: this.gstin,
      };
    } else {
      body = {
        type: this.userType,
        // user_id: this.userid,
        id: this.companyid,
        company_name: this.company_name,
        gstin: this.gstin,
      };
    }
    this.apiService
      .getAssociatedCompaniesByCompanyId(body)
      .subscribe((response: any) => {
        if (response?.status == true) {
          this.company_details = [];
          this.company_details = response?.company_details;

          if (this.userType == "seller") {
            this.dataSource1 = new MatTableDataSource(this.company_details);
            this.dataSource1.paginator = this.paginator1;
            this.dataSource1.sort = this.sort1;
            const sortState: Sort = { active: "createdAt", direction: "desc" };
            this.sort1.active = sortState.active;
            this.sort1.direction = sortState.direction;
            this.sort1.sortChange.emit(sortState);
          } else if (this.userType == "buyer") {
            this.dataSource2 = new MatTableDataSource(this.company_details);
            this.dataSource2.paginator = this.paginator2;
            this.dataSource2.sort = this.sort2;
            const sortState: Sort = { active: "createdAt", direction: "desc" };
            this.sort2.active = sortState.active;
            this.sort2.direction = sortState.direction;
            this.sort2.sortChange.emit(sortState);
          } else {
            this.company_details = [];
          }
        }
      });
  }

  companyfilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.company_name = filterValue.toLocaleUpperCase().trim();
    if (this.company_name !== null && this.company_name !== undefined) {
      this.getAssociatedCompaniesByCompanyId();
    }
  }

  company_name_clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.company_name = "";
    this.selectedCompanyId = "";
    this.getAssociatedCompaniesByCompanyId();
  }

  getGstNo(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.gstin = filterValue.toLocaleUpperCase();
    if (this.gstin !== undefined && this.gstin !== null) {
      this.getAssociatedCompaniesByCompanyId();
    }
  }

  gst_clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.gstin = "";
    this.getAssociatedCompaniesByCompanyId();
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
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }
}
