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
  selector: 'app-receivablesstatement',
  templateUrl: './receivablesstatement.component.html',
  styleUrls: ['./receivablesstatement.component.scss']
})
export class ReceivablesstatementComponent implements OnInit {
  redirect!: string;

  date_format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  displayedColumns: string[] = [
    "dealer_name",
    "anchor",
    "financing_partner",
    "loan_date",
    // "invoice_amount",
    "due_on",
    "document_id",
    "invoice_value",
    "gst",
    "discount",
    "credit_note",
    "interest",
    "penalty",
    "already_paid",
    "balance_payable",
  ];

  dataSource = new MatTableDataSource([]);
  durationInSeconds = 2;
  company_Name!: any[];
  anchor_id: any;
  userType: any;
  dealer_id: any;

  filterInvoiceByDate: any;
  
  invoiceDate!: any;

  maxDate!: Date;

  anchorSelect = new FormControl();

  dealer = new FormControl();

  nbfcSelect = new FormControl();

  nbfc_name!: any[];
  
  nbfc_id!: string;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private snackBar : MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });

    //this.dataSource = new MatTableDataSource(this.data);
    this.getReceivableStatement();
    this.maxDate = new Date();

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

  getReceivableStatement(){
    let filter:any = {}
    if ((this.anchor_id != undefined && this.anchor_id !="")) 
    {
        filter.anchor = this.anchor_id;  
    }   
    if (this.dealer_id != undefined && this.dealer_id !="") {
       filter.dealer = this.dealer_id;
    }
    if (this.nbfc_id != undefined && this.nbfc_id !="") {
      filter.nbfc = this.nbfc_id;
    }
    if (this.filterInvoiceByDate !=undefined && this.filterInvoiceByDate !="") {
       filter.inv_date =  this.filterInvoiceByDate;
    }
    this.apiService.getReceivableStatement(filter).subscribe((res:any)=>{ 
        if (res.status == true) 
        {
          this.dataSource = new MatTableDataSource(res.receivables_statements);
          this.dataSource.paginator = this.paginator;
        }
        else {
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
    })
  }
  
  // ========= dropdwon and auto suggetion =======
  companySuggetion(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2) {
      let companyName = filterValue.toUpperCase();
      this.apiService
        .companynameAutoSuggestion(companyName)
        .subscribe((res) => {
          this.company_Name = [...res.companies];
        });
    }
  }
  
  // nbfc auto suggestion
  nbfcAutoSuggestion(event : any){
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2) {
      let companyName = filterValue.toUpperCase();
      this.apiService
        .nbfcAutoSuggestion(companyName)
        .subscribe((res) => {
          this.nbfc_name = [...res.get_nbfc];
       });
    }
  }

  displayFn(company: any): string {
    return company && company.company_name ? company.company_name : "";
  }

  displayNbfc(nbfc: any): string { 
    return nbfc && nbfc.nbfc_name ? nbfc.nbfc_name : "";
  }

  // get Anchor Id
  getAnchorId(companyid: any) {
    this.anchor_id = companyid._id;
    if ((this.anchor_id !== undefined || this.anchor_id !=="")){
      this.userType = "anchor";
      this.getReceivableStatement();
    }
  }
  
  // get dealer id
  getDealerId(companyid: any) {
    this.dealer_id = companyid._id;
    if ((this.dealer_id !== undefined || this.dealer_id !=="")){
      this.userType = "dealer";
      this.getReceivableStatement();
    }
  }

  // nbfc id
  nbfcId(nbfcid:any){
      this.nbfc_id = nbfcid._id;
      this.getReceivableStatement();
  }

  //

  invoicedate() {
    this.filterInvoiceByDate = formatDate(
      this.invoiceDate,
      "yyyy-MM-dd",
      "en-US"
    );
    this.getReceivableStatement();
  }

  // clear input boxes
  anchor_clear(ctrl : FormControl){
    this.company_Name = [];
    ctrl.setValue("");
    this.anchor_id = "";
    this.getReceivableStatement();
  }

  dealer_clear(ctrl : FormControl){
    this.company_Name = [];
    ctrl.setValue("");
    this.dealer_id = "";
    this.getReceivableStatement();
  }

  nbfc_clear(ctrl : FormControl){
    this.nbfc_name = [];
    ctrl.setValue("");
    this.nbfc_id = "";
    this.getReceivableStatement();
  }

  date_cancle(date : any){
    if (date == "as_on_date") {
      this.filterInvoiceByDate = "";
      this.invoiceDate = "";
      this.getReceivableStatement();
    } 
 }
}
