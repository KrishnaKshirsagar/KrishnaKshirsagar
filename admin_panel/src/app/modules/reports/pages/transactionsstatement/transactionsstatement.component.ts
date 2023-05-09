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
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DATE_FORMAT } from "src/app/shared/constants/constants";
@Component({
  selector: "app-transactionsstatement",
  templateUrl: "./transactionsstatement.component.html",
  styleUrls: ["./transactionsstatement.component.scss"],
  providers: [],
})
export class TransactionsstatementComponent implements AfterViewInit {
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {}
}

@Component({
  selector: "transactionsstatement-dialog",
  templateUrl: "transactionsstatement-dialog.html",
  styleUrls: ["./transactionsstatement.component.scss"],
})
export class TransactionsstatementDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}
