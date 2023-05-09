import { formatDate } from '@angular/common';
import { Component, Inject, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CURRENCY_FORMAT, DATE_FORMAT } from 'src/app/shared/constants/constants';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-disbursement',
  templateUrl: './disbursement.component.html',
  styleUrls: ['./disbursement.component.scss']
})
export class DisbursementComponent implements OnInit {
  
  nbfc_id: string;
  durationInSeconds = 2;

  date_format = DATE_FORMAT

  currency_format = CURRENCY_FORMAT

  displayedColumns: string[] = [
    "invoice_number",
    "buyer_gst",
    "seller_gst",
    "invoice_amount",
    "gst_amount",
    "payable_amount",
    "invoice_date",
    "status",
    "credit_number",
    "settel_amount",
    "payment_due_date"
  ];

  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private _liveAnnouncer: any;
  invoiceNumber: string;
  gstin: string;
  gstuserselect = "";
  payment_status = "";
  minRange: number;
  maxRange: number;

  constructor
  (
    private apiService : ApiService,
    private fb: FormBuilder,
    private snackBar : MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
  )
  { }
 
  ngOnInit(): void {
    const nbfc_id = sessionStorage.getItem("nbfc_id");
    if (nbfc_id && nbfc_id != undefined && nbfc_id != null) {
      this.nbfc_id = nbfc_id;
    }

    this.get_disburesment();
  }

  ngAfterViewInit() {
    
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }


  get_disburesment()
  {
    let filterdata:any = {};
    if (this.invoiceNumber) 
    {
       filterdata.invoice_number = this.invoiceNumber;
    }

    if (this.gstin) 
    {
      filterdata.gstin = this.gstin;
    }

    if (this.gstuserselect) {
      filterdata.gstuser = this.gstuserselect;
    }

    if (this.payment_status) {
      filterdata.payment_status =  this.payment_status;
    }

    if (this.minRange != undefined && this.minRange) {
      filterdata.min = this.minRange;
    }
    if (this.maxRange != undefined && this.maxRange) {
      filterdata.max = this.maxRange;
    }

    this.apiService.get_disbursement(this.nbfc_id,filterdata).subscribe((res:any)=>{
      if (res.status == true) { 
         let data = res && res.disbursement ? res.disbursement : "";
         this.dataSource = new MatTableDataSource(data);
         this.dataSource.paginator = this.paginator;
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
    this.get_disburesment();
  }
   // get payment_status
    
   get_payment_status(){
    if(this.payment_status !== undefined || this.payment_status !==""){
      this.get_disburesment();
    }
   }
   // user tye
   GstUserType(){
    if ((this.gstin !== undefined || this.gstin !=="") 
    &&  (this.gstuserselect !== undefined || this.gstuserselect !=="")) {
      this.get_disburesment();
    }
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
      default:
      this.minRange = undefined
      this.maxRange = undefined 
      break;
  } 
  this.get_disburesment();
}


  // filter gst
  getGstNo(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.gstin = filterValue.toLocaleUpperCase();
    if ((this.gstuserselect !== undefined || this.gstuserselect !=="")
    && (this.gstin !== undefined || this.gstin !=="")) {
      this.get_disburesment();
    }  
  }

  // clear
  invoiceNumberControl = new FormControl();
  gstControl = new FormControl();

  invoice_clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.invoiceNumber = "";
    this.get_disburesment();
  }

  gst_clear(ctrl: FormControl) {
    ctrl.setValue("");
    this.gstuserselect = "";
    this.gstin = "";
    this.get_disburesment();
  }
}

