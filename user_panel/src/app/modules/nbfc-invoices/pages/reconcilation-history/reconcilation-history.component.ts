import { LiveAnnouncer } from '@angular/cdk/a11y';
import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CURRENCY_FORMAT, DATE_FORMAT } from 'src/app/shared/constants/constants';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-reconcilation-history',
  templateUrl: './reconcilation-history.component.html',
  styleUrls: ['./reconcilation-history.component.scss']
})
export class ReconcilationHistoryComponent implements OnInit {

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  redirect!: string;

  nbfc_id: string;

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  displayedColumns: string[] = [
    "lan_id",
    "invoice_number",
    "buyer_gst",
    "seller_gst",
    "transaction_id",
    "batch_id",
    "utr_id",
    "invoice_amount",
    "gst_amount",
    "payable_amount",
    "invoice_date",
    "transaction_date",
    "status",
    "remarks"
  ];
  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  invoice_number: any;
  filterInvoiceDate: any;
  filterPaymentDate: any;
  seller_id: any;
  companyList: any[];
  invoiceNumber: string;
  gstin: string;
  transaction_id: string;
  utr_id: string;
  maxDate: Date;
  fromDate: string;
  toDate: string;
  minRange: number = 0;
  maxRange: number = 0;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
      this.maxDate = new Date();
    });

    const nbfc_id = sessionStorage.getItem("nbfc_id");
    if (nbfc_id && nbfc_id != undefined && nbfc_id != null) {
      this.nbfc_id = nbfc_id;
    }
    this.get_reconcilation_history();
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

  get_reconcilation_history(){
    let filterdata: any = {};

    if (this.invoiceNumber != "" && this.invoiceNumber) {
      filterdata.invoiceNumber = this.invoiceNumber;
    }

    if (this.gstin != "" && this.gstin) {
      filterdata.gstin = this.gstin;
    }

    if (this.utr_id != "" && this.utr_id) {
      filterdata.utr_id = this.utr_id;
    }
    if (this.transaction_id != "" && this.transaction_id) {
      filterdata.transaction_id = this.transaction_id;
    }
    if (this.fromDate != "" && this.fromDate) {
      filterdata.fromDate = this.fromDate;
    }
    if (this.toDate != "" && this.toDate) {
      filterdata.toDate = this.toDate;
    }
    if (this.minRange != undefined && this.minRange) {
      filterdata.min = this.minRange;
    }
    if (this.maxRange != undefined && this.maxRange) {
      filterdata.max = this.maxRange;
    }

    this.apiService.get_reconcilation_history(this.nbfc_id,filterdata).subscribe((res:any)=>{
      if (res.status == true) { 
         let data = res && res.reconciliation ? res.reconciliation : "";
         this.dataSource = new MatTableDataSource(data);
         this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "transaction_date", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
      else
      {
        this.dataSource = new MatTableDataSource();
      }  
    })
  }

  // invoice number filter
  applyFilterInvoiceNo(invoiceno: any) {
    const filterValue = (invoiceno.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.invoiceNumber = filterValue.toLocaleUpperCase();
    this.get_reconcilation_history();
  }
   
  // seller gst filter
  getGstNo(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.gstin = filterValue.toLocaleUpperCase();
    this.get_reconcilation_history();
  }

  // transaction id filter

  applyFilterTransactionId(transaction_id:any){
    const filterValue = (transaction_id.target as HTMLInputElement).value
    this.transaction_id = filterValue;
    this.get_reconcilation_history();
  }

  // Utr id filter
  applyFilterUtrId(utr_id:any){
    const filterValue = (utr_id.target as HTMLInputElement).value
    this.utr_id = filterValue;
    this.get_reconcilation_history();
  }

  // transaction date range filter

  transaction_date_filter(){
    const start = this.dateRange.value.start;
    const end = this.dateRange.value.end;

    this.fromDate = formatDate(start, "yyyy-MM-dd", "en-US");
    this.toDate = formatDate(end, "yyyy-MM-dd", "en-US");
    this.get_reconcilation_history();
  }
  
  // ========= clear search boxes ==========
  invoiceNumberControl = new FormControl();
  gstControl = new FormControl();
  transactionIdControl = new FormControl();
  UtrIdControl = new FormControl();

  invoice_clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.invoiceNumber = "";
    this.get_reconcilation_history();
  }

  gst_clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.gstin = "";
    this.get_reconcilation_history();
  }

  transaction_id_clear(ctrl:FormControl){
    ctrl.setValue("");
    this.transaction_id = "";
    this.get_reconcilation_history();
  }

  utr_id_clear(ctrl:FormControl){
    ctrl.setValue("");
    this.utr_id = "";
    this.get_reconcilation_history();
  }
  
  invoices_amount_range(val:any){
      switch (val) {
        case "0_to_1L":
            this.minRange = 0;
            this.maxRange = 100000;
            break;
        case "2L_to_5L":
            this.minRange = 200000;
            this.maxRange = 500000;
            break;
        case "5L_to_25L":
            this.minRange = 500000;
            this.maxRange = 2500000;
            break;
        case "above_25L" :
            break;
    }
    this.get_reconcilation_history();
  }

}
