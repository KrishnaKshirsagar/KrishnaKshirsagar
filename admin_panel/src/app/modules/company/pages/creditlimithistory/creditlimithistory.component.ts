import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { DATE_FORMAT } from "src/app/shared/constants/constants";
import { ApiService } from "../../services/api/api.service";

@Component({
  selector: "app-creditlimithistory",
  templateUrl: "./creditlimithistory.component.html",
  styleUrls: ["./creditlimithistory.component.scss"],
})
export class CreditlimithistoryComponent implements OnInit {

  dateformat = DATE_FORMAT;

  displayedColumns: string[] = [
    "company_name",
    "gstin",
    "exist_credit_limit",
    "new_credit_limit",
    "status",
    "created_at",
    "updated_at",
    "updated_by",
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.creditlimithistory();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  creditlimithistory() {
    this.apiService.creditlimithistory().subscribe((res) => {
      if (res.status == true) {
        const creditlimithistory = res.credit_limit_details
          ? res.credit_limit_details
          : [];
        this.dataSource = new MatTableDataSource(creditlimithistory);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "updated_at", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }
}
