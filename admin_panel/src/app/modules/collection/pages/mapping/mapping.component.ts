import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
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

import { Location } from "@angular/common";

export interface PeriodicElement {
  companyName: string;
  gstin: string;
  action: string;
}

@Component({
  selector: "app-mapping",
  templateUrl: "./mapping.component.html",
  styleUrls: ["./mapping.component.scss"],
  providers: [],
})
export class MappingComponent implements AfterViewInit {
  displayedColumns: string[] = ["companyName", "gstin", "action"];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  staffId: any;
  durationInSeconds = 2;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.staffId = JSON.parse(params["staffId"]);
    });
    this.getCompanyByStaffId();
  }

  constructor(
    public dialogRef: MatDialogRef<MappingDialog>,
    public dialogRef1: MatDialogRef<StaffmappingDialog>,
    private fb: FormBuilder,
    private _liveAnnouncer: LiveAnnouncer,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private location: Location
  ) {}

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

  // fecthing company by staffid

  getCompanyByStaffId() {}

  unMappingDialogue(details: any) {}
  openStaffMappingDialogue() {
    this.dialogRef1 = this.dialog.open(StaffmappingDialog, {
      data: {
        staffid: this.staffId,
        flag: false,
      },
    });
    this.dialogRef1.afterClosed().subscribe((res: any) => {
      if (res.flag == true) {
        this.getCompanyByStaffId();
      }
    });
  }
}

@Component({
  selector: "mapping-dialog",
  templateUrl: "mapping-dialog.html",
  styleUrls: ["./mapping.component.scss"],
})
export class MappingDialog implements OnInit {
  unmap_form!: FormGroup;

  unmapFlag = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private apiservice: ApiService,
    public dialogRef: MatDialogRef<MappingDialog>
  ) {}

  ngOnInit() {
    this.unmap_form = this.fb.group({
      comment: ["", [Validators.required]],
    });
  }

  cancel() {
    this.dialogRef.close(this.unmapFlag);
  }

  onSubmit() {
    let data: any = {};
    data.flag = this.unmapFlag = true;
    data.comment = this.unmap_form.value.comment;
    this.dialogRef.close(data);
  }
}

@Component({
  selector: "staffmapping-dialog",
  templateUrl: "staffmapping-dialog.html",
  styleUrls: ["./mapping.component.scss"],
})
export class StaffmappingDialog implements OnInit {
  unmap_form!: FormGroup;
  flag = false;
  company_Name!: any[];
  selectedCompanyId: any;
  durationInSeconds = 2;
  // companyname: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private apiservice: ApiService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<StaffmappingDialog>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.unmap_form = this.fb.group({
      comment: ["", [Validators.required]],
    });
  }

  cancel() {
    this.dialogRef.close(this.flag);
  }

  // onSubmit() {
  //   if(this.unmap_form.valid){
  //   this.unmapFlag = true;
  //   const unmap_data = {
  //     buyerid: this.data._id,
  //     unmapFlag: this.unmapFlag,
  //     comment: this.unmap_form.value.comment,
  //   };
  //   this.dialogRef.close(unmap_data);
  //   }
  // }

  // auto suggetion companies

  companySuggetion(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2) {
      let companyName = filterValue.toUpperCase();
      // this.apiservice.companynameAutoSuggestion(companyName).subscribe((res) => {
      //   this.company_Name = [...res.companies];
      // })
    }
  }

  displayFn(company: any): string {
    return company && company.company_name ? company.company_name : "";
  }

  getPosts(event: any) {
    this.selectedCompanyId = event._id;
  }
  // Company map with Staff
  companyMap() {
    let data: any = {};
    data.flag = this.flag = true;
    let body = { company: this.selectedCompanyId };
  }
}
