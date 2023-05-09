import { LiveAnnouncer } from '@angular/cdk/a11y';
import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CURRENCY_FORMAT, DATE_FORMAT } from 'src/app/shared/constants/constants';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-transactionledger',
  templateUrl: './transactionledger.component.html',
  styleUrls: ['./transactionledger.component.scss']
})

export class TransactionLedgerComponent implements OnInit {

  currency_format = CURRENCY_FORMAT;

  date_format = DATE_FORMAT;

  redirect!: string;

  selection = "";

  user_type!: string

  maxDate!: Date;

  as_no_date!: any;


  displayedColumns: string[] = [
    "account",
    "counter_party",
    "record_type",
    "invoice_id",
    "createdAt",
    "transaction_type",
    "transaction_amount",
    "balance"
  ];

  dataSource = new MatTableDataSource([]);
  
  company_Name!: any[];
  anchor_id: any;
  dealer_id: any;
  filterInvoiceByDate: any;
  durationInSeconds = 2;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private snackBar : MatSnackBar
  ) { }

  anchorSelect = new FormControl();

  dealer = new FormControl();

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });
    this.snackBar.open("Please select user to view the report", "Close", {
      duration: this.durationInSeconds * 3000,
      panelClass: ["error-dialog"],
    });
    this.maxDate = new Date();
    this.getTransactionLedger();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  @ViewChild(MatSort) sort!: MatSort;

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  selectUser(){
    this.anchor_clear();
    this.user_type = this.selection;
    if ((this.user_type !== undefined || this.user_type !=="")
    && (this.anchor_id !== undefined || this.anchor_id !==""))
    {
      this.getTransactionLedger();
    }else{
      this.snackBar.open("Please select partner type", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
  }


  getTransactionLedger(){
    let filter:any = {}

    if (this.user_type !== undefined || this.user_type !==""){
      filter.user_type =  this.user_type;
    }

    if (this.filterInvoiceByDate !=undefined && this.filterInvoiceByDate !="") {
       filter.as_on_date =  this.filterInvoiceByDate;
    }
   
    if ((this.anchor_id !== undefined || this.anchor_id !=="")){
       filter._id = this.anchor_id;
    }

    if(filter.user_type && filter.user_type !== null && filter.user_type !== undefined &&
      filter._id && filter._id !== null && filter._id !== undefined){
      this.apiService.getTransactionLedger(filter).subscribe((res:any)=>{
        if (res.status == true) {
          this.dataSource = new MatTableDataSource(res.transaction);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          const sortState: Sort = { active: "createdAt", direction: "asc" };
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
        }
        else{
          this.dataSource = new MatTableDataSource([]);
        }
      })
    }else{
      this.dataSource = new MatTableDataSource([]);

      this.snackBar.open("Please select partner ", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
  }

  getTransactionType(element: any){
    const type = element && element.record_type ? element.record_type : ''
    if(type == 'SALESINVOICE'){
      return 'Sales Invoice';
    }else if(type == 'BPAYMENT'){
      return 'Buyer Payment';
    }else if(type == 'DISCOUNT'){
      return 'Discount'
    }else if(type == 'INTERST'){
      return 'Interest'
    }else if(type == 'SPAYMENT'){
      return 'Supplier Payment'
    }else if(type == 'CREDIT NOTE'){
      return 'Credit Note'
    }
    else{
      return type;
    }
  }

  // ========= dropdwon and auto suggetion =======
  companySuggetion(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2) {
      let companyName = filterValue.toUpperCase();
      if(this.user_type == 'nbfc'){
        // this.company_Name = [];
        this.apiService
        .nbfcAutoSuggestion(companyName)
        .subscribe((res) => {
          this.company_Name = [...res.get_nbfc];
        });
      }else if(this.user_type == 'seller' || this.user_type == 'buyer'){
        // this.company_Name = [];
        this.apiService
        .companynameAutoSuggestion(companyName)
        .subscribe((res) => {
          this.company_Name = [...res.companies];
        });
      }
    }
  }
  
  displayFn(company: any): string {
    if(company && company.nbfc_name){
     return company && company.nbfc_name ? company.nbfc_name : "";
    }
    else
    {
     return company && company.company_name ? company.company_name : "";
    }
  }

   // get Anchor Id (Seller)
   getAnchorId(companyid: any) {
    this.anchor_id = companyid._id;
    if ((this.anchor_id !== undefined || this.anchor_id !=="")){
      this.getTransactionLedger();
    }
  }
 
  // As On Date
  as_On_Date() {
    this.filterInvoiceByDate = formatDate(
      this.as_no_date,
      "yyyy-MM-dd",
      "en-US"
    );
    this.getTransactionLedger();
  }

   // clear input boxes
  anchor_clear(){
    this.anchorSelect = new FormControl;
    this.company_Name = [];
    this.anchor_id = "";
    this.getTransactionLedger();
  }

  date_cancle(date : any){
    if (date == "as_on_date") {
      this.filterInvoiceByDate = "";
      this.as_no_date = "";
      this.getTransactionLedger();
    } 
 }
}
