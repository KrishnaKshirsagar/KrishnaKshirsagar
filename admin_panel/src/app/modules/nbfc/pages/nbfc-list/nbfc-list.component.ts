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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NavigationExtras, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DATE_FORMAT } from "src/app/shared/constants/constants";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

export interface State {
  name: string;
}

@Component({
  selector: "app-nbfc-list",
  templateUrl: "./nbfc-list.component.html",
  styleUrls: ["./nbfc-list.component.scss"],
  providers: [],
})
export class NbfcListComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    "ndbfc_name",
    "nbfc_address",
    "nbfc_email",
    "nbfc_status",
    "createdAt",
    "action",
  ];

  dataSource = new MatTableDataSource([]);

  date_format = DATE_FORMAT;

  nbfc_name!: string;

  nbfc_status!: string;

  stateCtrl = new FormControl();
  filteredStates: Observable<State[]>;
  clear(ctrl: FormControl) {
    ctrl.setValue(null);
  }

  states: State[] = [
    {
      name: "Arkansas",
    },
    {
      name: "California",
    },
    {
      name: "Florida",
    },
    {
      name: "Texas",
    },
  ];

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private apiservice: ApiService
  ) {
    this.filteredStates = this.stateCtrl.valueChanges.pipe(
      startWith(""),
      map((state) => (state ? this._filterStates(state) : this.states.slice()))
    );
  }

  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();
    return this.states.filter((state) =>
      state.name.toLowerCase().includes(filterValue)
    );
  }

  ngOnInit(): void {
    this.nbfc_name = "";
    this.nbfc_status = "";
    this.getNBFClist(this.nbfc_name, this.nbfc_status);
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

  getNBFClist(nbfc_name: string, nbfc_status: string) {
    this.apiservice
      .getNBFClist(nbfc_name, nbfc_status)
      .subscribe((response: any) => {
        if (response && response.status == true) {
          const nbfcList = response.get_nbfc ? response.get_nbfc : [];
          this.dataSource = new MatTableDataSource(nbfcList);

          this.dataSource.paginator = this.paginator;

          this.dataSource.sort = this.sort;
          const sortState: Sort = { active: "createdAt", direction: "desc" };
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
        }
      });
  }

  nbfcSelect = new FormControl();

  nbfc_name_clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.nbfc_name = "";
    this.onEnterValue(this.nbfc_name);
  }

  onSelect(event: any) {
    this.nbfc_status = event && event.value ? event.value : "";
    this.getNBFClist(this.nbfc_name, this.nbfc_status);
  }

  onEnterValue(event: any) {
    this.nbfc_name =
      event && event.target && event.target.value ? event.target.value : "";
    this.getNBFClist(this.nbfc_name, this.nbfc_status);
  }

  openMappingPage(nbfc_id: string) {
    const id = nbfc_id != undefined && nbfc_id != null ? nbfc_id : "";
    let navigationExtras: NavigationExtras = {
      queryParams: {
        nbfcid: JSON.stringify(nbfc_id),
      },
    };
    this.router.navigate(["admin/nbfc/nbfc-mapping"], navigationExtras);
  }

  openReconciliationPage(nbfc_id: string) {
    const id = nbfc_id != undefined && nbfc_id != null ? nbfc_id : "";
    let navigationExtras: NavigationExtras = {
      queryParams: {
        nbfcid: JSON.stringify(nbfc_id),
      },
    };
    this.router.navigate(["admin/nbfc/reconciliation"], navigationExtras);
  }

  manageNBFC(nbfc_id: string) {
    const id = nbfc_id != undefined && nbfc_id != null ? nbfc_id : "";
    let navigationExtras: NavigationExtras = {
      queryParams: {
        nbfcid: JSON.stringify(nbfc_id),
      },
    };
    this.router.navigate(["admin/nbfc/add-nbfc"], navigationExtras);
  }
}

@Component({
  selector: "nbfc-list-dialog",
  templateUrl: "nbfc-list-dialog.html",
  styleUrls: ["./nbfc-list.component.scss"],
})
export class NbfcListDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}
