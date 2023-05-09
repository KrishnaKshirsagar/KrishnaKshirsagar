import { AfterViewInit, Component, Inject, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../../services/api/api.service";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { formatDate } from "@angular/common";
import { CURRENCY_FORMAT, DATE_FORMAT } from "src/app/shared/constants/constants";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";

export interface State {
  name: string;
}

@Component({
  selector: "app-reconciliation",
  templateUrl: "./reconciliation.component.html",
  styleUrls: ["./reconciliation.component.scss"],
  providers: [],
})
export class ReconciliationComponent implements AfterViewInit {

  nbfc_id!: string;

  durationInSeconds = 2;

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  invoice_number: any;
  filterInvoiceDate: any;
  filterPaymentDate: any;
  seller_id: any;
  companyList!: any[];
  invoiceNumber!: string;
  gstin!: string;
  transaction_id!: string;
  utr_id!: string;
  maxDate!: Date;
  fromDate!: string;
  toDate!: string;
  minRange: number = 0;
  maxRange: number = 0;

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

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() 
  {
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
    private apiservice: ApiService, 
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ReconciliationDialog>,
    // private router: Router,
    ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.nbfc_id = JSON.parse(params["nbfcid"]);
    });
    if(this.nbfc_id && this.nbfc_id != '' && this.nbfc_id != null && this.nbfc_id != undefined){
      this.get_reconcilation_history()
    }
  }

  onFileChange(event :any) { //To upload the excel file
    if (event.target.files.length > 0 && event.target.files[0].size <= '3145728') { //3MB
      let formData : any
      const file = event.target.files[0];
      formData = new FormData();
      formData.append ("file",file);
      this.apiservice.add_reconcilation(this.nbfc_id,formData).subscribe((res:any)=>{
        if (res.status == true) 
        {
          (<HTMLInputElement>document.getElementById('excel_file')).value = "";
          this.snackBar.open(
            res.message,
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
        } 
        else 
        {
          this.dialogRef = this.dialog.open(ReconciliationDialog, {
            data:res.message.data
          });     
        }
    })
    }else{
      this.snackBar.open(
        "File size cannot be greater than 3MB.",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
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

    this.apiservice.get_reconcilation_history(this.nbfc_id,filterdata).subscribe((res:any)=>{
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

@Component({
  selector: "reconciliation-dialog",
  templateUrl: "reconciliation-dialog.html",
  styleUrls: ["./reconciliation.component.scss"],
})
export class ReconciliationDialog implements OnInit {
  displayedColumns: string[] = [
    "invoice_no",
    "status",
    "message",
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){
  }

  ngOnInit(){
  this.dataSource = new MatTableDataSource(this.data);
  }

  dataSource = new MatTableDataSource([]);
}
