import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ApiService } from "../../services/api/api.service";
import { Router } from "@angular/router";
import { DATE_FORMAT } from "src/app/shared/constants/constants";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-creditplanslist",
  templateUrl: "./creditplanslist.component.html",
  styleUrls: ["./creditplanslist.component.scss"],
  providers: [],
})
export class CreditplanslistComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  companyid: string | undefined;

  company_name!: string;

  user_role!: string;

  durationInSeconds = 2;

  dateformat = DATE_FORMAT;

  displayedColumns: string[] = [
    "default_plan",
    "plan_name",
    "credit_period",
    "payment_interval",
    "createdAt",
    "createdBy",
    "action",
  ];

  dataSource = new MatTableDataSource([]);

  ngOnInit(): void {
    const role =  sessionStorage.getItem('Role');
    this.user_role = role!= null && role != '' ? role: '';
    const href = window.location.href;
    const url: any = href.split("/");
    this.companyid = url[7]; //7
    if (this.companyid && this.companyid != undefined) {
      this.getCompanyDetailByCompanyid(this.companyid);
      this.fetchCreditPlanByCompanyId(this.companyid);
    }
  }

  constructor(
    public dialogRef: MatDialogRef<CreditplanslistDialog>,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onClickBack() {
    this.router.navigate([`admin/companies`]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  fetchCreditPlanByCompanyId(companyid: string) {
    this.apiService
      .fetchCreditPlansByCompanyId(companyid)
      .subscribe((response: any) => {
        if (response && response.status == true) {
          const creditplnlist = response.plan_Details
            ? response.plan_Details
            : [];
          this.dataSource =  new MatTableDataSource(creditplnlist);

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          const sortState: Sort = { active: "createdAt", direction: "desc" };
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
        }
      });
  }

  getCompanyDetailByCompanyid(companyid: string) {
    this.apiService.getCompany(companyid).subscribe((respons: any) => {
      if (respons && respons.status == true) {
        this.company_name =
          respons.company && respons.company.company_name
            ? respons.company.company_name
            : "";
      }
    });
  }

  manageCreditPlan(element: any) {
    const id = element && element._id ? element._id : "newplan";
    this.router.navigate([
      `admin/companies/${this.companyid}/creditplans/${id}`,
    ]);
  }

  openDialog(plan: any) {
    //Delete credit plan
    this.dialogRef = this.dialog.open(CreditplanslistDialog, {
      data: {
        planid: plan._id,
      },
    });
    this.dialogRef.afterClosed().subscribe((deleteplan) => {
      if (deleteplan.flag == true) {
        this.apiService
          .deleteCreditPlan(plan.seller_id._id, deleteplan.planid)
          .subscribe((resp: any) => {
            if (resp.status == true) {
              this.snackBar.open("Plan deleted successfully.", "Close", {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              });
            } else {
              this.snackBar.open(
                "Unable to delete, credit-plan is mapped to active invoices.",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
            }
            if (this.companyid && this.companyid != undefined) {
              this.fetchCreditPlanByCompanyId(this.companyid);
            }
          });
      }
    });
  }

  openDialog1() {
    this.dialog.open(CreditplansmappingDialog);
  }

  defaultplan(event: any, companyid: string, planid: string) {
    this.apiService.defaultPlan(companyid, planid).subscribe((res: any) => {
      if (res.status == true) {
        this.snackBar.open("Default plan selected", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
        this.fetchCreditPlanByCompanyId(companyid);
      }
    });
  }
}

// ==============Delete dialogue box ===============

@Component({
  selector: "creditplanslist-dialog",
  templateUrl: "creditplanslist-dialog.html",
  styleUrls: ["./creditplanslist.component.scss"],
})
export class CreditplanslistDialog implements OnInit {
  planid!: string;

  deletePlanFlag = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreditplanslistDialog>
  ) {
    this.planid = data.planid;
  }

  ngOnInit() {}

  deletePlan() {
    this.deletePlanFlag = true;
    const deleteplan = {
      planid: this.planid,
      flag: this.deletePlanFlag,
    };
    this.dialogRef.close(deleteplan);
  }

  cancel() {
    this.deletePlanFlag = false;
    const deleteplan = {
      planid: this.planid,
      flag: this.deletePlanFlag,
    };
    this.dialogRef.close(deleteplan);
  }
}

// ============= Company Plan Mapping File =====================

@Component({
  selector: "creditplansmapping-dialog",
  templateUrl: "creditplansmapping-dialog.html",
  styleUrls: ["./creditplanslist.component.scss"],
})
export class CreditplansmappingDialog implements OnInit {
  
  company_Name: any;

  companyid!: string;

  myControl = new FormControl();

  cardValue: any = {
    options: [],
  };

  selectOptions: any = [];

  selectChange = (event: any) => {
    const key: string = event.key;
    this.cardValue[key] = [...event.data];
  };

  companyMap_form!: FormGroup;

  buyersList: any[] = [];

  buyers: any = [];

  planid!: string;

  durationInSeconds = 2;

  seller_id!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreditplansmappingDialog>,
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.planid = data.planid;
    this.seller_id = data.seller_id;
  }

  ngOnInit() {
    this.companyMap_form = this.fb.group({
      buyers: new FormControl(),
    });
    this.getCompanies(event);
  }

  getCompanies(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue && filterValue.length > 2) {
      let companyName = filterValue.toUpperCase();
      this.apiService
        .companynameAutoSuggestionforMap(companyName)
        .subscribe((res) => {
          this.company_Name = [...res.companies];
        });
    }
  }

  cancel() {
    this.dialogRef.close("");
  }

  onChange(comp: any) {
    this.companyid = comp._id;
  }

  displayFn(company: any) {
    const company_name =
      company && company.company_name ? company.company_name : "";
    return company_name;
  }

  onMapCompanies() {
    if (this.companyid && this.companyid != undefined) {
      const body = {
        credit_planid: this.planid,
        seller_id: this.seller_id,
        buyers: [{ buyer_id: this.companyid }],
      };
      this.apiService.addCompanyPlanMap(body).subscribe((resp: any) => {
        if (resp.status == true) {
          this.snackBar.open(
            "Company mapped with credit plan successfully.",
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
        } else {
          this.snackBar.open(resp.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
        this.dialogRef.close(resp);
      });
    } else {
      this.snackBar.open(
        "Please select company to map with credit plan",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
  }
}
