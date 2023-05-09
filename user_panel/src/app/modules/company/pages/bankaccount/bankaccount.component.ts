import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Data, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { CompanyErrorComponent } from "../components/company-error/company-error.component";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { BankAccount } from "src/app/shared/interfaces/results/bankaccount.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { ConformDailogComponent } from "../components/conform-dailog/conform-dailog.component";
@Component({
  selector: "app-bankaccount",
  templateUrl: "./bankaccount.component.html",
  styleUrls: ["./bankaccount.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class BankaccountComponent implements AfterViewInit {

  defaultBankFlag: boolean = false;

  displayedColumns: string[] = [
    "defaultaccount",
    "bank_name",
    "account_no",
    "acc_holder",
    "account_type",
    "ifsc_code",
    "actions",
  ];
  dataSource = new MatTableDataSource<BankAccount>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  redirect!: string;

  durationInSeconds = 2;

  companyid!: string;

  private token!: string;

  pwdVisible = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    public dialogRef: MatDialogRef<AddBankaccountDialog>,
    public dialogRef1: MatDialogRef<ConformDailogComponent>
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.companyid = id;
    }
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });
    this.fetchBankAccountsByCompanyId();
  }

  fetchBankAccountsByCompanyId() {
    this.apiService
      .fetchBankAccountsByCompanyId(this.companyid)
      .subscribe((resp: any) => {
        if (resp.status == true) {
          this.defaultBankFlag = false;
          this.dataSource = new MatTableDataSource(resp.details);
          this.dataSource.paginator = this.paginator;          
        } else {
          if (resp.errorCode == 404) {
            this.defaultBankFlag = true;
            this.dataSource = new MatTableDataSource(resp.details);
          } else {
            this.defaultBankFlag = false;
          }
        }
      });
  }

  openDialog1() {
    this.dialogRef = this.dialog.open(AddBankaccountDialog, {
      data: {
        defaultBankFlag: this.defaultBankFlag,
      },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.fetchBankAccountsByCompanyId();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialog() {
    this.dialog.open(CompanyErrorComponent, {
      data: {
        companyid: this.companyid,
      },
    });
  }

  deleteAccount($event: any, id: string) {
    this.dialogRef1 = this.dialog.open(ConformDailogComponent);
    this.dialogRef1.afterClosed().subscribe((flag) => {
      if (flag == true) {
        this.apiService.deleteBankAccount(id).subscribe((resp: any) => {
          if (resp.status == true) {
            this.snackBar.open("Account deleted successfully", "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
            this.fetchBankAccountsByCompanyId();
          } else {
            this.snackBar.open("Unable to delete bank account", "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
            this.fetchBankAccountsByCompanyId();
          }
        });
      }
    });
  }

  defaultAccount($event: any, companyid: string, id: string) {
    this.apiService.defaultBankAccount(companyid, id).subscribe((res: any) => {
      if (res.status) {
        this.snackBar.open("Default account selected", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
        this.fetchBankAccountsByCompanyId();
      }
    });
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

// ================ Bank Account Dialogue ============================

@Component({
  selector: "add-bankaccount-dialog",
  templateUrl: "add-bankaccount-dialog.html",
  styleUrls: ["./bankaccount.component.scss"],
})
export class AddBankaccountDialog implements OnInit {
  bankAcc_form!: FormGroup;

  companyid!: string;

  durationInSeconds = 2;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: Data
  ) {}

  ngOnInit() {
    const href = window.location.href;
    const url: any = href.split("/");
    this.companyid = url[5];

    this.bankAcc_form = this.fb.group({
      bank_name: ["", [Validators.pattern, Validators.required]],
      account_no: ["", [Validators.required]],
      account_type: ["", [Validators.required]],
      acc_holder: ["", [Validators.pattern, Validators.required]],
      branch_name: ["", [Validators.pattern, Validators.required]],
      ifsc_code: ["", [Validators.pattern, Validators.required]],
    });
  }

  onSubmit() {
    if (this.bankAcc_form.valid) {
      const accountData = {
        bank_name: this.bankAcc_form.value.bank_name,
        account_no: this.bankAcc_form.value.account_no,
        account_type: this.bankAcc_form.value.account_type,
        acc_holder: this.bankAcc_form.value.acc_holder,
        branch_name: this.bankAcc_form.value.branch_name,
        ifsc_code: this.bankAcc_form.value.ifsc_code,
        defaultFlag: this.data["defaultBankFlag"],
      };
      this.apiService
        .addBankAccount(this.companyid, accountData)
        .subscribe((resp: any) => {
          if (resp.status == true) {
              this.snackBar.open("Bank account added successfully.", "Close", {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              });
              const dialogRef = this.dialog.closeAll();
            this.dialog.closeAll();
          } else {
            this.snackBar.open(
              resp.message,
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
        });
    }
  }
}
