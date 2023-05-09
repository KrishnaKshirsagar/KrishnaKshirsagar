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
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SafeHtml } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CreditplansmappingDialog } from "../creditplanslist/creditplanslist.component";
import { Location } from "@angular/common";
import { LOCAL_STORAGE_AUTH_DETAILS_KEY } from "src/app/shared/constants/constants";
import { CreditplanErrorComponent } from "../components/creditplan-mapping-error/creditplan-mapping-error.component";
@Component({
  selector: "app-creditplans",
  templateUrl: "./creditplans.component.html",
  styleUrls: ["./creditplans.component.scss"],
  providers: [],
})
export class CreditplansComponent implements AfterViewInit {
  dynamicRows: any[] = [];

  numberofRow: number = 0;

  creditAllowedflag = true;

  editModeFlag = false;

  plan_name: string = "";

  credit_free_period: string = "";

  payment_interval: string = "";

  durationInSeconds = 2;

  companyid!: string;

  userid!: string;

  default_plan = false;

  onchangeflag = false;

  planid!: string;

  creditPlanDetails: any;

  data: SafeHtml | undefined;

  creditPlan_form!: FormGroup;

  displayedColumns: string[] = ["discountinterval", "discount"];

  displayedColumns1: string[] = ["companyName", "gstin", "action"];

  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    const href = window.location.href;
    const url: any = href.split("/");
    if (url[7] && url[7] != undefined && url[7] != null) {
      this.companyid = url[7];
    }
    if (url[9] && url[9] != undefined && url[9] != null) {
      this.planid = url[9];
    }
    this.creditPlan_form = this.fb.group({
      plan_name: ["", [Validators.required, Validators.pattern]],
      credit_period: ["", [Validators.required, Validators.pattern]],
      payment_interval: ["", Validators.required],
    });
    if (this.planid != "newplan" && this.planid != undefined) {
      this.getPlanDetailsByPlanid();
    }
    if (this.companyid && this.companyid != undefined) {
      this.fetchCreditPlanByCompanyId(this.companyid);
    }
    this.getLoggedInUser();
  }

  getLoggedInUser() {
    const detailsStr = sessionStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      if (userDetails && userDetails != undefined) {
        this.userid = userDetails._id;
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

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
    public dialogRef: MatDialogRef<CreditplansmappingDialog>,
    private fb: FormBuilder,
    private _liveAnnouncer: LiveAnnouncer,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private location: Location,
    public dialogRef1: MatDialogRef<CreditplansDialog>,
    public dialogRef2: MatDialogRef<CreditplanErrorComponent>

  ) {}

  fetchCreditPlanByCompanyId(companyid: string) {
    this.apiService
      .fetchCreditPlansByCompanyId(companyid)
      .subscribe((response: any) => {
        if (response.status == true && response.plan_Details.length == 0) {
          this.default_plan = true;
        }
      });
  }

  onClickBack() {
    this.router.navigate([`admin/companies/${this.companyid}/creditplanslist`]);
  }

  openDialog(element: any) {
    // To unmap buyer
    this.dialogRef1 = this.dialog.open(CreditplansDialog, {
      data: element,
    });
    this.dialogRef1.afterClosed().subscribe((unmap_data) => {
      const body = {
        companyid: this.companyid,
        planid: this.planid,
        buyerid: unmap_data.buyerid,
      };
      this.apiService.unmapCompany(body).subscribe((res: any) => {
        if (res.status == true) {
          // this.snackBar.open(
          //   'Buyer is un-mapped successfully.',
          //   'Close',
          //   {
          //     duration: this.durationInSeconds * 3000,
          //     panelClass: ['error-dialog'],
          //   }
          // );
        } else {
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
        this.getMappedBuyersByPlanid();
      });
    });
  }

  onKey(event: any) {
    this.dynamicRows = [];
    this.numberofRow = event;
    for (var i = 1; i <= this.numberofRow; i++) {
      if (this.dynamicRows.length == 0) {
        var x = {
          from: "0",
          to: "",
          discount: "",
        };
      } else {
        var x = {
          from: "",
          to: "",
          discount: "",
        };
      }
      this.dynamicRows.push(x);
    }
  }

  addFromDay(event: any) {
    for (let i = 0; i < this.dynamicRows.length - 1; i++) {
      if (this.dynamicRows[i].to && this.dynamicRows[i].to != "") {
        this.dynamicRows[i + 1].from = +this.dynamicRows[i].to + 1;
      }
    }
  }

  getPlanDetailsByPlanid() {
    //get plan details
    this.apiService
      .getPlanDetailsByPlanid(this.companyid, this.planid)
      .subscribe((respon: any) => {
        if (respon.status == true) {
          this.editModeFlag = true;
          this.plan_name = respon.plan_Details.plan_name;
          this.credit_free_period = respon.plan_Details.credit_period;
          this.payment_interval =
            respon.plan_Details.payment_interval.toString();
          this.dynamicRows =
            respon && respon.plan_Details && respon.plan_Details.discount_slabs
              ? respon.plan_Details.discount_slabs
              : 0;
          this.getMappedBuyersByPlanid();
        }
      });
  }

  getMappedBuyersByPlanid() {
    this.apiService
      .getMappedBuyersByPlanid(this.companyid, this.planid)
      .subscribe((resp: any) => {
        if (resp && resp.status == true) {
          const mappedBuyersByPlanid =
            resp.plan_Details && resp.plan_Details.buyers
              ? resp.plan_Details.buyers
              : [];
          this.dataSource = mappedBuyersByPlanid;
        } else {
          this.snackBar.open(
            "This plan is not mapped with any buyer.",
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
        }
      });
  }

  openMapCompaniesDialogue() {
    this.dialogRef = this.dialog.open(CreditplansmappingDialog, {
      data: {
        planid: this.planid,
        seller_id: this.companyid,
      },
    });
    this.dialogRef.afterClosed().subscribe((resp) => {
      if (resp.status == true) {
        this.snackBar.open(
          "Company is mapped with plan successfully.",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      } else if (resp.status == false) {
        this.snackBar.open(resp.message, "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
      this.getPlanDetailsByPlanid();
    });
  }

  onFileChange(event :any) { //To upload the excel file
    if (event.target.files.length > 0 && event.target.files[0].size <= '3145728') { //3MB
      const file = event.target.files[0];
      
      const formData: FormData = new FormData();
      formData.append("planid", this.planid);
      formData.append("seller_id", this.companyid);
      formData.append("file", file);

      this.apiService.uploadExcelFile(formData).subscribe((response:any) => {

        (<HTMLInputElement>document.getElementById('excel_file')).value = "";
        if(response && response.status == true){
          this.dialogRef2 = this.dialog.open(CreditplanErrorComponent, {
            data:response.credit_data
          });
          this.dialogRef2.afterClosed().subscribe(()=>{
            this.getMappedBuyersByPlanid();
          })
        }else if(response.errorCode == '402'){
          this.snackBar.open(
            response.message,
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
        }
        else {
          this.dialogRef2 = this.dialog.open(CreditplanErrorComponent, {
            data:response.credit_data
          });

          this.dialogRef2.afterClosed().subscribe(()=>{
            this.getMappedBuyersByPlanid();
          })
        }
      })
    }else{
      this.snackBar.open(
        "File size cannot be greater than 3MB.",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
  }

  onChange() {
    this.onchangeflag = true;
  }

  onSubmit() {
    //Validation for negative discount %
    for (let i = 0; i <= this.dynamicRows.length - 1; i++) {
      if (
        !this.dynamicRows[i].discount ||
        this.dynamicRows[i].discount == null ||
        this.dynamicRows[i].discount == "" ||
        this.dynamicRows[i].discount == undefined
      ) {
        this.snackBar.open("Please enter valid discount %", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
        this.creditAllowedflag = false;
        break;
      }
    }
    const length = this.dynamicRows.length;
    for (let i = 0; i < this.dynamicRows.length - 1; i++) {
      if (
        this.creditPlan_form.valid &&
        (this.dynamicRows[i].discount < 0 || this.dynamicRows[i].discount > 100)
      ) {
        this.creditAllowedflag = false;
        break;
      } else {
        this.creditAllowedflag = true;
      }
    }
    // Validating for making changes in edit mode
    if (
      this.onchangeflag == false &&
      this.editModeFlag == true &&
      this.creditAllowedflag == true
    ) {
      this.creditAllowedflag = false;
      this.snackBar.open("Please make changes to edit this plan", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }

    //Validation for To days and From days
    for (let i = 0; i < this.dynamicRows.length - 1; i++) {
      if (
        this.dynamicRows[i].from > this.dynamicRows[i].to ||
        this.dynamicRows[i].from == this.dynamicRows[i].to
      ) {
        //correct
        this.creditAllowedflag = false;
        this.snackBar.open(
          "Please check days entered by you, To days must be greater then From days.",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
        break;
      } else if (i > 0 && (+this.dynamicRows[i].to) < (+this.dynamicRows[i - 1].to)) {
        //correct
        this.creditAllowedflag = false;

        this.snackBar.open("Please enter correct days.", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
        break;
      }
    }
    if (
      (this.editModeFlag == true && this.creditAllowedflag == false) ||
      this.dynamicRows[this.dynamicRows.length - 1].to !=
        this.creditPlan_form.value.credit_period
    ) {
      this.snackBar.open(
        "Unable to edit the credit plan, please enter correct details.",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    } else if (
      this.editModeFlag == true &&
      this.creditPlan_form.valid &&
      this.creditAllowedflag == true &&
      this.dynamicRows[this.dynamicRows.length - 1].to ==
        this.creditPlan_form.value.credit_period
    ) {
      const creditPlan = {
        plan_name: this.creditPlan_form.value.plan_name,
        credit_period: this.creditPlan_form.value.credit_period,
        payment_interval: this.creditPlan_form.value.payment_interval,
        discount_slabs: this.dynamicRows,
      };
      this.apiService
        .editCreditPlan(this.companyid, this.planid, creditPlan)
        .subscribe((response: any) => {
          if (response.status == true) {
            this.snackBar.open("Plan edited successfully", "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          } else {
            this.snackBar.open("Unable to edit plan", "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }
          this.router.navigate([
            `/admin/companies/${this.companyid}/creditplanslist`,
          ]);
        });
    }
    if (
      (this.editModeFlag == false && this.creditAllowedflag == false) ||
      this.dynamicRows[this.dynamicRows.length - 1].to !=
        this.creditPlan_form.value.credit_period
    ) {
      this.snackBar.open(
        "Unable to add the credit plan, please enter correct details.",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    } else if (
      this.editModeFlag == false &&
      this.creditPlan_form.valid &&
      this.creditAllowedflag == true &&
      this.dynamicRows[this.dynamicRows.length - 1].to ==
        this.creditPlan_form.value.credit_period
    ) {
      const creditPlan = {
        plan_name: this.creditPlan_form.value.plan_name,
        default_plan: this.default_plan,
        credit_period: this.creditPlan_form.value.credit_period,
        payment_interval: this.creditPlan_form.value.payment_interval,
        discount_slabs: this.dynamicRows,
        createdBy: this.userid,
      };
      this.apiService
        .addCreditPlan(this.companyid, creditPlan)
        .subscribe((response: any) => {
          if (response.status == true) {
            this.snackBar.open("Plan added successfully", "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          } else {
            this.snackBar.open("Unable to add plan", "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }
          this.router.navigate([
            `/admin/companies/${this.companyid}/creditplanslist`,
          ]);
        });
    }
  }
}

@Component({
  selector: "creditplans-dialog",
  templateUrl: "creditplans-dialog.html",
  styleUrls: ["./creditplans.component.scss"],
})
export class CreditplansDialog implements OnInit {

  unmap_form!: FormGroup;

  unmapFlag = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private apiservice: ApiService,
    public dialogRef: MatDialogRef<CreditplansDialog>
  ) {}

  ngOnInit() {
    this.unmap_form = this.fb.group({
      comment: ["", [Validators.required]],
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.unmap_form.valid) {
      this.unmapFlag = true;
      const unmap_data = {
        buyerid: this.data._id,
        unmapFlag: this.unmapFlag,
        comment: this.unmap_form.value.comment,
      };
      this.dialogRef.close(unmap_data);
    }
  }
}
