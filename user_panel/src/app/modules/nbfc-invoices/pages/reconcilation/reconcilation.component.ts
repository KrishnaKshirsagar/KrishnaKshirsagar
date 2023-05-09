import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormControlName } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-reconcilation',
  templateUrl: './reconcilation.component.html',
  styleUrls: ['./reconcilation.component.scss']
})
export class ReconcilationComponent implements OnInit {

  value = '';
  reconcilation_form!: FormGroup;
  nbfc_id: string;
  disbursedInvoiceList !: any;
  InvoiceList !: any;
  disRedio: string = 'reconcilation_form';
  durationInSeconds = 2;
  maxDate: Date;

  

  constructor
  (
    private apiService : ApiService,
    private fb: FormBuilder,
    private snackBar : MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<ReconcilationDialog>,
  )
  { }
 
  ngOnInit(): void {
    this.reconcilation_form = this.fb.group({
      lan_id: ["", [ Validators.required ]],
      invoice_number: ["", [ Validators.required ]],
      transaction_id: ["", [Validators.required]],

      seller_gst : ["",[Validators.required,Validators.pattern]],
      buyer_gst : ["", [Validators.required,Validators.pattern]],
      
      gst_amount : ["",[Validators.required, Validators.pattern]],
      invoice_amount : ["",[Validators.required, Validators.pattern]],

      utr_id : ["", [Validators.required]],
      batch_id: ["",[Validators.required]],
     
      invoice_date: ["", [Validators.required]],
      transaction_date :["",[Validators.required]],

      amount_paid: ["",[Validators.required,Validators.pattern]],
      payable_amount: ["",[Validators.required]],
      status: ["", [Validators.required]],
      // file: [""],
     
      remarks : [ "", [Validators.required,Validators.pattern]]
    });

    const nbfc_id = sessionStorage.getItem("nbfc_id");

    if (nbfc_id && nbfc_id != undefined && nbfc_id != null) {
      this.nbfc_id = nbfc_id;
    }
    this.apiService.getDisbursedInvoices(this.nbfc_id).subscribe((response)=>{
      if(response.status){
        this.disbursedInvoiceList = [...response.data];
        this.InvoiceList = [...response.data];
      }else{
        this.snackBar.open(
          response.message,
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }
    })
    this.maxDate = new Date();
  }

  ngAfterViewInit() {
    
  }

  getPosts(data:any){
    if(data){
      this.apiService.getDisbursedInvoices(this.nbfc_id,data).subscribe((response)=>{
        if(response.status){
          this.reconcilation_form.setValue({
            seller_gst: response.data?.seller_gst,
            buyer_gst: response.data?.buyer_gst,
            lan_id: "",
            transaction_id:"",
            utr_id:"",
            batch_id:response.data?.batchId||`XUR_${Math.floor(Math.random()*9000)}`,
            transaction_date: response.data?.invoice_date, 
            invoice_date:new Date(response.data?.invoice_date),
            invoice_number: response.data?.invoice_number,
            invoice_amount: response.data?.invoice_amount,
            payable_amount: response.data?.payable_amount,
            status:response.data?.payment_status,
            remarks:"",
            amount_paid:"",
            gst_amount: response.data?.gst_amount
          })
        }
      })
    }
  }

  clearInvoice(ctrl: FormControlName){
    this.reconcilation_form.reset();
    this.disbursedInvoiceList = this.InvoiceList;    
  }

  invoiceSuggetion(event:any){
    let filterValue = (event.target as HTMLInputElement).value;
    if(filterValue.length > 0){
      const regex = new RegExp(`.*${filterValue}*.`);
      let change = this.InvoiceList.filter((str:string) => regex.test(str));
      this.disbursedInvoiceList = change;
    }else{
      this.disbursedInvoiceList = this.InvoiceList
    }

  }

  add_reconcilation(data:any){
    if (this.reconcilation_form.valid) {
       const userData:any = {}
       userData.lan_id = data.lan_id,
       userData.invoice_number = data.invoice_number,
       userData.transaction_id = data.transaction_id,
 
       userData.seller_gst     = data.seller_gst,
       userData.buyer_gst      = data.buyer_gst,
       
       userData.gst_amount = data.gst_amount,
       userData.invoice_amount = data.invoice_amount,
 
       userData.utr_id   = data.utr_id,
       userData.batch_id = data.batch_id,
       
      userData.invoice_date = data.invoice_date = formatDate(
        data.invoice_date,
        "yyyy-MM-dd",
        "en-US"
      ),
      userData.transaction_date = data.transaction_date = formatDate(
        data.transaction_date,
        "yyyy-MM-dd",
        "en-US"
      ),

       userData.payable_amount = data.payable_amount,
 
       userData.status  = data.status,  
       userData.remarks = data.remarks

      this.apiService.add_reconcilation(this.nbfc_id,userData).subscribe((res:any)=>{
          if (res.status == true) 
          {
            this.snackBar.open(
              res.message,
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );

            this.reconcilation_form.patchValue({
              invoice_number : " ",
              transaction_id : " ",
              seller_gst     : " ",
              buyer_gst      : " ",
              gst_amount     : 0,
              invoice_amount : 0,
              utr_id   : " ",
              batch_id : " ",
              invoice_date : " ",
              transaction_date :" ",
              payable_amount : 0,
              status  : " ",  
              remarks : " "
           });

          } 
          else 
          {
            this.snackBar.open(
              res.message,
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
      })
    }
  }

  onFileChange(event :any) { //To upload the excel file
    if (event.target.files.length > 0 && event.target.files[0].size <= '3145728') { //3MB
      let formData : any
      const file = event.target.files[0];
      formData = new FormData();
      formData.append ("file",file);
      this.apiService.add_reconcilation(this.nbfc_id,formData).subscribe((res:any)=>{
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
          this.dialogRef = this.dialog.open(ReconcilationDialog, {
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

  onchange(){
    this.ngOnInit()
  }

  backpage(){
    this.disRedio = "reconcilation_form"
  }
}


@Component({
  selector: "reconcilation-dailog",
  templateUrl: "reconcilation-dailog.html",
  styleUrls: ["./reconcilation.component.scss"],
})

export class ReconcilationDialog {

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
