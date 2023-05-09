import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiService } from "../../services/api/api.service";

@Component({
  selector: "eMandatestatus",
  templateUrl: "./eMandatestatus.component.html",
  styleUrls: ["./eMandatestatus.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})

export class EMandateStatus implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  redirect!: string;

  private token!: any;

  companyid!: string;

  private durationInSeconds = 2;

  pwdVisible = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getCompanyId();
    this.emandateStatus();
  }

  getCompanyId() {
    const href = window.location.href;
    const url: any = href.split("/");
    this.companyid = url[5];
  }

  emandateStatus() {
    this.apiService.emandateStatus(this.companyid).subscribe((resp: any) => {
      if(resp && resp.status == true){
        this.apiService.emandatewebhooks(this.companyid);
      }
    });
    setTimeout(() => {
      if (this.companyid != undefined) {
        this.router.navigate([`/companies/${this.companyid}/invoices/sales`]);
      }
    }, 3000);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }
}
