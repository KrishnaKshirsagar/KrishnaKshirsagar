import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ApiService } from "../../services/api/api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { DATE_FORMAT } from "src/app/shared/constants/constants";
import { CompanyErrorComponent } from "../components/company-error/company-error.component";
import { Router } from "@angular/router";
@Component({
  selector: "app-creditlimitverification",
  templateUrl: "./creditlimitverification.component.html",
  styleUrls: ["./creditlimitverification.component.scss"],
})
export class CreditlimitverificationComponent implements OnInit {
  dateformat = DATE_FORMAT;

  userid = sessionStorage.getItem("LoginId");

  durationInSeconds = 2;

  displayedColumns: string[] = [
    "company_name",
    "gstin",
    "exist_credit_limit",
    "new_credit_limit",
    "status",
    "created_at",
    "updated_by",
    "action",
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private apiservice: ApiService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<CompanyErrorComponent>,
    private snackBar: MatSnackBar,
    private router: Router,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.credtilimitapproval();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  credtilimitapproval() {
    this.apiservice.credtilimitapproval().subscribe((res: any) => {
      if (res.status == true) {
        const credtilimitapproval_data = res.credit_limit_details
          ? res.credit_limit_details
          : [];
        this.dataSource = new MatTableDataSource(credtilimitapproval_data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "updated_at", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    });
  }

  creditApprovalDailog(id: string) {
    this.dialogRef = this.dialog.open(CompanyErrorComponent, {
      data: {
        flag: true,
      },
    });
    this.dialogRef.afterClosed().subscribe((response) => {
      if (response.flag == true || response.flag == !undefined) {
        let data: any = {};
        data.comment = response.comment;
        (data.status = "Approved"),
          (data.userid = this.userid),
          (data.companyid = id),
          this.apiservice
            .creditlimitapprovalStatus(data)
            .subscribe((res: any) => {
              if (res.status == true) {
                this.snackBar.open(res.message, "Close", {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                });
                this.credtilimitapproval();
              }
            });
      }
    });
  }

  creditDiclineDailog(id: string) {
    this.dialogRef = this.dialog.open(CompanyErrorComponent, {
      data: {
        flag: false,
      },
    });
    this.dialogRef.afterClosed().subscribe((response) => {
      if (response.flag == true || response.flag == !undefined) {
        let data: any = {};
        data.comment = response.comment;
        (data.status = "Declined"),
          (data.userid = this.userid),
          (data.companyid = id),
          this.apiservice
            .creditlimitapprovalStatus(data)
            .subscribe((res: any) => {
              if (res.status == true) {
                this.snackBar.open(res.message, "Close", {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                });
                this.credtilimitapproval();
              }
            });
      }
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }
}
