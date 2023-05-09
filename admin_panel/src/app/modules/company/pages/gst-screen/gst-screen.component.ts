import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, Validators, FormArray, FormBuilder } from "@angular/forms";
import { MatFormField } from "@angular/material/form-field";
import { MatLabel } from "@angular/material/form-field";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";

import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";

import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";

@Component({
  selector: "app-new-screen",
  templateUrl: "./gst-screen.component.html",
  styleUrls: ["./gst-screen.component.scss"],
})
export class GSTDetails implements OnInit {

  public data: any;

  gstin: any;

  durationInSeconds = 2;

  fetchButton:boolean =false;

  private _liveAnnouncer: any;

  fetchGst() {}

  addOnBlur = true;

  displayedColumns: string[] = [
    "filingYear",
    "monthOfFiling",
    "methodOfFilling",
    "dateOfFiling",
    // "registeredby",
    "gstType",
    "annual_return",
    "gstStatus",
  ];

  dataSource = new MatTableDataSource<any>([]);

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiservice: ApiService,
    private snackBar: MatSnackBar
  ) {}

  updateProfile() {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.gstin = JSON.parse(params["gst"]);
    });

    this.fetchDetails();

   
  }

  fetchDetails(){
    if (this.gstin) {
      this.apiservice
        .getGSTDetails({ gstin: this.gstin })
        .subscribe((res: any) => {
          if (res.statusCode == 200) {
             this.fetchButton = false;
            this.data = res.data;
            let flingdata =
              res.data && res.data.filingStatus ? res.data.filingStatus : "";
            this.dataSource = new MatTableDataSource(flingdata);
            this.dataSource.paginator = this.paginator;

            this.dataSource.sort = this.sort;
            const sortState: Sort = { active: "createdAt", direction: "desc" };
            this.sort.active = sortState.active;
            this.sort.direction = sortState.direction;
            this.sort.sortChange.emit(sortState);
          } else {
            this.dataSource = new MatTableDataSource();
            this.snackBar.open(res.message, "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
            this.fetchButton = true;
          }
        });
    }
  }
  onClickBack() {
    this.router.navigate([`admin/companies/`]);
  }

  TriggerApi(){
    if (this.gstin) {
      this.apiservice
        .updateGST({ gstin: this.gstin })
        .subscribe((res: any) => {
          if (res.status) {
            this.snackBar.open(res.message, "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
            window.location.reload();
            return ;
          } else {
            this.snackBar.open(res.message, "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
            this.fetchButton = true;
            return ;
          }
        });
    } 
  }

  async onSubmit() {}
}
