import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiService } from "../../services/api/api.service";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
import { MatTableDataSource } from "@angular/material/table";

import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import { formatDate } from "@angular/common";
import { FormControl } from "@angular/forms";

interface PeriodicElement {
  _id: string;
  seller?: string;
  invoice_date?: string;
  transaction_type?: string;
  transaction_amount?: string;
  transaction_date?: string;
  amount?: string;
  interest?: string;
  discount?: string;
  remark?: string;
  details?: PeriodicElement[];
}

@Component({
  selector: "transactionalstatement",
  templateUrl: "./transactionalstatement.component.html",
  styleUrls: ["./transactionalstatement.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class TransactionalstatementComponent implements OnInit {
  user_role: string = "";

  userid: string = "";

  user_type: string = "";

  seller_flag = "";

  Date_Format = DATE_FORMAT;

  maxDate!: Date;

  currency_Format = CURRENCY_FORMAT;

  displayedColumns: string[] = [
    "invoice_number",
    "company_name",
    "invoice_date",
    "transaction_type",
    "amount",
    "tradate",
    "transaction_amount",
    "interest",
    "discount",
    "remark",
  ];

  private _transformer = (node: PeriodicElement, level: number) => {
    return {
      expandable: !!node.details && node.details.length > 0,
      _id: node._id,
      seller: node.seller,
      invoice_date: node.invoice_date,
      transaction_type: node.transaction_type,
      transaction_amount: node.transaction_amount,
      transaction_date: node.transaction_date,
      amount: node.amount,
      interest: node.interest,
      discount: node.discount,
      remark: node.remark,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<any>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener: any = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.details
  );

  companyid!: string;

  durationInSeconds = 2;

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  seller_name: any;
  invoice_number: any;
  invoiceDate!: Date;
  filter_date!: any;
  invoice_status!: string;

  constructor(private apiservice: ApiService, private snackBar: MatSnackBar) {
    // this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: any) => node.expandable;

  @ViewChild(MatSort)
  sort!: MatSort;

  ngOnInit(): void {
    this.seller_flag = sessionStorage.getItem("seller_flag");
    this.user_role = sessionStorage.getItem("Role");
    this.userid = sessionStorage.getItem("userid");
    this.user_type = this.seller_flag == "true" ? "seller" : "buyer";
    const cid = sessionStorage.getItem("companyid");
    if (cid && cid != undefined && cid != null) {
      this.companyid = cid;
      this.getTransactionStatement();
    }
    this.maxDate = new Date();
  }

  ngAfterViewInit() {
    //this.dataSource.sort = this.sort;
    this.getTransactionStatement();
  }

  getTransactionStatement() {
    let filterdata: any = {};
    filterdata.user_type = this.user_type;

    if (this.companyid == "All" && this.user_role == "HO_user") {
      filterdata.user_id = this.userid;
    }

    if (this.seller_name) {
      filterdata.seller = this.seller_name;
    }
    if (this.invoice_number && this.invoice_number !== undefined) {
      filterdata.invoice_number = this.invoice_number;
    }
    if (this.filter_date) {
      filterdata.invoice_date = this.filter_date;
    }
    if (this.invoice_status && this.invoice_status !== "") {
      filterdata.status = this.invoice_status;
    }

    this.apiservice
      .getTransactionStatement(this.companyid, filterdata)
      .subscribe((response: any) => {
        if (response && response.status == true) {
          this.dataSource.data = response.transcations;
        } else {
          this.dataSource = new MatTreeFlatDataSource(
            this.treeControl,
            this.treeFlattener
          );
        }
      });
  }
  //  filter Transaction Statement

  filterSellerName(seller: any) {
    const filterValue = (seller.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.seller_name = filterValue.toLocaleUpperCase();
    this.getTransactionStatement();
  }

  filterInvoiceNo(invoice_number: any) {
    this.invoice_number = (invoice_number.target as HTMLInputElement).value
      .trim()
      .toLocaleUpperCase();
    this.getTransactionStatement();
  }

  filterInvoicedate() {
    this.filter_date = formatDate(this.invoiceDate, "yyyy-MM-dd", "en-US");
    this.getTransactionStatement();
  }

  // clear search boxsses

  companySelect: FormControl = new FormControl();

  invoiceNumber: FormControl = new FormControl();

  company_name_clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.seller_name = "";
    this.getTransactionStatement();
  }

  invoice_number_clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.invoice_number = "";
    this.getTransactionStatement();
  }
}
