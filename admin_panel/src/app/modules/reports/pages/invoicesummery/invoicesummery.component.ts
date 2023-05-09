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
import { FormControl, FormGroup } from "@angular/forms";
import { formatDate } from "@angular/common";
import { _isNumberValue } from "@angular/cdk/coercion";


@Component({
  selector: "app-invoicesummery",
  templateUrl: "./invoicesummery.component.html",
  styleUrls: ["./invoicesummery.component.scss"],
  providers: [],
})
export class InvoiceSummeryComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  Date_Format = DATE_FORMAT;

  invoiceStatus:any;

  company_select: FormControl = new FormControl();

  gstControl:FormControl = new FormControl();

  companyNameControl = new FormControl("");

  nbfcNameControl = new FormControl;

  filterInvoiceByDueDate: any;

  StatusControl = new FormControl;

  userType:any = "";

  company_Name!: any;

  invoice_status!: any;

  invoiceDate!: any;

  invoiceDueDate!: any;

  lastPaymentDate!: any;

  uploadedAt!: any;

  selectedCompanyId: string = '';

  invoiceNumberControl = new FormControl();

  invoice_number!: string;

  toDate: any;

  fromDate: any;

  maxDate!: Date;

  filter_data: any = {};

  displayedColumns: string[] = [
    'invoice_number',
    "company_name", //seller name
    "seller_gst",
    'buyer',
    "buyer_gst",
    "buyerregisteredon",
    "buyerstatus",
    "nbfc_name",
    "nbfcmappingdate",
    'invoice_date',
    'total_tax',
    'invoice_amount',
    'total_invoice_amount',
    'paid_discount',
    'paid_interest',
    'already_paid_amount',
    'outstanding_amount',
    'discount',
    'interest',
    'payable_amount',
    'disbursementdate',
    'disbursementamount',
    'invoice_due_date',
    'invoice_status',    
    'createdAt',
    // 'invoice_confirm_date',
    'last_payment_date',
  ];

  dataSource = new MatTableDataSource([]);

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    public dialog: MatDialog,
    private apiservice: ApiService
  ) {}

  ngOnInit(): void {
    this.maxDate = new Date();
    this.getInvoiceSummary();
  }

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
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getInvoiceSummary() {
    this.apiservice.getInvoiceSummary(this.filter_data).subscribe((res) => {
      if (res && res.status == true) {
        let invoice_details = res && res.invoice_details ? res.invoice_details : [];
        this.dataSource = new MatTableDataSource(invoice_details);
        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "createdAt", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    })
  }

  invoicedate() {
    const filterInvoiceByDate = formatDate(
      this.invoiceDate,
      "yyyy-MM-dd",
      "en-US"
    );
    this.filter_data.invoice_date = filterInvoiceByDate
    this.getInvoiceSummary();
  }

  invoiceDuedate() {
    const filterInvoiceByDueDate = formatDate(
      this.invoiceDueDate,
      "yyyy-MM-dd",
      "en-US"
    );
    this.filter_data.inv_due_date = filterInvoiceByDueDate
    this.getInvoiceSummary();
  }

  lastPaymentdate() {
    const filterPaymentDate = formatDate(
      this.lastPaymentDate,
      "yyyy-MM-dd",
      "en-US"
    );
    this.filter_data.payment_date = filterPaymentDate
    this.getInvoiceSummary();
  }

  uploadedat() {
    const uploadedAt = formatDate(
      this.uploadedAt,
      "yyyy-MM-dd",
      "en-US"
    );
    this.filter_data.uploadedAt = uploadedAt
    this.getInvoiceSummary();
  }

  applyFilterInvoiceNo(invoiceno: any) {
    const filterValue = (invoiceno.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.invoice_number = filterValue.toLocaleUpperCase();
    if(this.invoice_number && this.invoice_number != undefined && this.invoice_number != null){
      this.filter_data.invoice_number = this.invoice_number
      this.getInvoiceSummary();
    }
  }

  cancel(){
    
  }

  datefilter() {
    const start = this.dateRange.value.start;
    const end = this.dateRange.value.end;
    this.fromDate = formatDate(start, "yyyy-MM-dd", "en-US");
    this.toDate = formatDate(end, "yyyy-MM-dd", "en-US");
    if(this.fromDate && this.fromDate != undefined && this.fromDate != null &&
      this.toDate && this.toDate != undefined && this.toDate != null){
        this.filter_data.from_date = this.fromDate;
        this.filter_data.to_date = this.toDate
        this.getInvoiceSummary();
      }
  }

  clearInvoiceNumber(){
    this.invoiceNumberControl = new FormControl();
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
    this.selectedCompanyId = companyid._id;
    if ((this.selectedCompanyId !== undefined && this.selectedCompanyId !=="")) {
      this.filter_data.companyid = this.selectedCompanyId;
      this.getInvoiceSummary();
    }
  }

  company_name_clear(ctrl: FormControl) {
    this.company_Name = [];
    ctrl.setValue("");
    this.selectedCompanyId = "";
    this.filter_data.companyid = '';
    this.getInvoiceSummary();
  }

  status_clear(ctrl: FormControl) {
    this.invoice_status = [];
    ctrl.setValue("");
    this.selectedCompanyId = "";
    this.filter_data.companyid = '';
    this.getInvoiceSummary();
  }

  // =================================================

  filterCompanyName(company_name: any) {
    const filterValue = (company_name.target as HTMLInputElement).value
      .trim()
    this.filter_data.company_Name = filterValue
    this.getInvoiceSummary();
  }

  filterGst(gst:any){
      const filterValue = (gst.target as HTMLInputElement).value
      .trim()
       this.filter_data.gst = filterValue
       this.filter_data.user_type = this.userType;
       if ( this.filter_data.gst && this.filter_data.user_type) {
        this.getInvoiceSummary();
       }
  }

  filterNbfcName(nbfc_name:any){
    const filterValue = (nbfc_name.target as HTMLInputElement).value
      .trim()
    this.filter_data.nbfc_name = filterValue
    this.getInvoiceSummary();
  }

  filterStatus(status_invoice:any){
    const filterValue = (status_invoice.target as HTMLInputElement).value
      .trim()
    this.filter_data.status_invoice = filterValue
    this.getInvoiceSummary();
  }

  clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.filter_data.company_Name = "";
    this.getInvoiceSummary();
  }
  
  clearNbfc(ctrl: FormControl) {
    ctrl.setValue("");
    this.filter_data.nbfc_name = "";
    this.getInvoiceSummary();
  }

  clearGst(ctrl:FormControl){
    ctrl.setValue("");
    this.filter_data.gst = "";
    this.userType = "";
    this.getInvoiceSummary();
  }

  clearStatus(ctrl:FormControl){
    ctrl.setValue("");
    this.filter_data.status_invoice = "";
    this.userType = "";
    this.getInvoiceSummary();
  }

  getGstUser(){
    this.filter_data.user_type = this.userType;
    if (this.filter_data.gst !== "" && this.filter_data.gst !== undefined) {
      this.getInvoiceSummary();
    }  
  }  

  getPayableAmount(element:any){
    const outstanding_amount = +(this.getOutstandingAmount(element));
    const interest = +(element && element.invoice_data && element.invoice_data.interest ? element.invoice_data.interest : 0);
    const discount = +(element && element.invoice_data && element.invoice_data.discount ? element.invoice_data.discount : 0);
    return (outstanding_amount + interest - discount).toFixed(2);
  }

  getDate(date: any){
    return date && date != '' ? date : '';
  }

  getTotalAmount(element: any){
    const invoice_amount = element && element.invoice_data && element.invoice_data.invoice_amount ? element.invoice_data.invoice_amount : 0;
    const gst = element && element.invoice_data && element.invoice_data.bill_details && element.invoice_data.bill_details.gst_summary && element.invoice_data.bill_details.gst_summary.total_tax ? element.invoice_data.bill_details.gst_summary.total_tax : 0;
    const total = (+invoice_amount) + (+gst)
    return total.toFixed(2);
  }

  getOutstandingAmount(element: any){
    const outstanding_amount = element && element.invoice_data && element.invoice_data.outstanding_amount ? element.invoice_data.outstanding_amount : 0;
    return outstanding_amount.toFixed(2);
  }

  numberformat(no: any) {
    return thousandsSeprator(no)
 }

 invoicesStatus(invoiceStatus:any){
  // this.invoiceStatus =invoiceStatus;
  this.filter_data.invoiceStatus=invoiceStatus;
  this.getInvoiceSummary();
 }

 clearDateRange(){
  this.dateRange.reset()
  this.filter_data.from_date =undefined;
  this.filter_data.to_date=undefined;
  this.getInvoiceSummary();
 }

 clearInvoiceDate(){
  this.invoiceDate=undefined;
  this.filter_data.invoice_date=undefined;
  this.getInvoiceSummary();

 }
 clearInvoiveDueDate(){
  this.invoiceDueDate=undefined;
  this.filter_data.inv_due_date=undefined;
  this.getInvoiceSummary();
 }
 clearLastPaymentDate(){
  this.lastPaymentDate = undefined
  this.filter_data.payment_date=undefined;
  this.getInvoiceSummary();
 }

 clearUploadedAt(){
  this.uploadedAt = undefined
  this.filter_data.uploadedAt=undefined;
  this.getInvoiceSummary();
 }
}

