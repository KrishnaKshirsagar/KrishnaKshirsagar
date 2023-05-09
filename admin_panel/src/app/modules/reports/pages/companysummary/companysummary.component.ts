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

import { ApiService } from "../../services/api/api.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DATE_FORMAT } from "src/app/shared/constants/constants";
import { MatDialog } from "@angular/material/dialog";
import { thousandsSeprator } from 'src/app/shared/constants/constants';
import { FormControl } from "@angular/forms";


@Component({
  selector: "app-companysummary",
  templateUrl: "./companysummary.component.html",
  styleUrls: ["./companysummary.component.scss"],
  providers: [],
})
export class CompanysummaryComponent implements AfterViewInit {

  company_select: FormControl = new FormControl();

  company_Name!: any;

  filter:any = {}

  companyNameControl = new FormControl("");

  displayedColumns: string[] = [
    'comapny',
    'gstin',
    "cih_amount",
    'creditLimit',
    'creditutilize',
    'available_credit_limit',
    'invoice_processed',
    'count_pending',
    'count_confirmed_partpay',
    'countOverdue',
  ];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    public dialog: MatDialog,
    private apiservice: ApiService
  ) {}

  ngOnInit(): void {
    this.getCompaniesSummary();
  }

  filterCompanyName(company_name: any) {
    const filterValue = (company_name.target as HTMLInputElement).value
      .trim()
    this.filter.company_name = filterValue
    this.getCompaniesSummary();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // ========= dropdwon and auto suggetion =======
  companySuggetion(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2) {
      let companyName = filterValue.toUpperCase();
      this.apiservice
        .companynameAutoSuggestion(companyName)
        .subscribe((res) => {
          this.company_Name = [...res.companies];
        });
    }
  }

  displayFn(company: any): string {
    return company && company.company_name ? company.company_name : "";
  }

  getPosts(companyid: any) {
    this.filter.company_id = companyid._id;
      this.getCompaniesSummary();
  }

  company_name_clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.company_Name = [];
    this.filter.company_id = "";
    this.getCompaniesSummary();
  }

  clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.filter.company_name = "";
    this.getCompaniesSummary();
  }

  // =================================================

  getCompaniesSummary() {
    this.apiservice.getCompaniesSummary(this.filter).subscribe((res) => {
      if (res && res.status == true) {
        let list_of_companies = res && res.company_list ? res.company_list : [];
        this.dataSource = new MatTableDataSource(list_of_companies);
        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: " ", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }else{
        this.dataSource = new MatTableDataSource();
      }
    })
  }

  numberformat(no: any) {
    return thousandsSeprator(no)
 }
}

