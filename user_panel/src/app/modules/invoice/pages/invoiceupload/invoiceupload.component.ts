import { AfterViewInit, Component, Inject, Input, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { InvoiceErrorComponent } from "../components/invoice-error/invoice-error.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { environment } from "src/environments/environment";
import { HttpHeaders, HttpParams } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiService } from "../../services/api/api.service";
import { MatTableDataSource } from "@angular/material/table";
import { ShowUploadHistoryComponent } from "../components/show-upload-history/show-upload-history.component";

// import { MatFileUploadQueue } from 'angular-material-fileupload';
@Component({
  selector: "app-invoiceupload",
  templateUrl: "./invoiceupload.component.html",
  styleUrls: ["./invoiceupload.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class InvoiceuploadComponent implements AfterViewInit {

  filetype_flag: string = 'excel';

  durationInSeconds = 2;

  seller_id: string;

  @Input()
  httpRequestHeaders:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      } = new HttpHeaders()
    // .set("sampleHeader", "headerValue")
    // .set("sampleHeader1", "headerValue1");

  @Input()
  httpRequestParams:
    | HttpParams
    | {
        [param: string]: string | string[];
      } = new HttpParams()
    // .set("sampleRequestParam", "requestValue")
    // .set("sampleRequestParam1", "requestValue1");

  openDialog1() {
    const dialogRef = this.dialog.open(InvoiceuploadDialog);
  }

  ngAfterViewInit() {}

  redirect!: string;

  constructor(
    private apiservice: ApiService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<InvoiceuploadDialog>,
    public dialogRef1: MatDialogRef<ShowUploadHistoryComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });

    this.seller_id = sessionStorage.getItem('companyid');
  }

  selectFileType(){
    // console.log("File : ", this.filetype_flag);
  }

  show_uploaded_history(){
    this.dialogRef = this.dialog.open(ShowUploadHistoryComponent, {
      data: this.seller_id
    });
  }

  onFileChange(event :any) { //To upload the excel file
    if (event.target.files.length > 0 && event.target.files[0].size <= '3145728') { //3MB
      const file = event.target.files[0];
      this.apiservice.uploadExcelFile(file).subscribe((response:any) => {

        (<HTMLInputElement>document.getElementById('excel_file')).value = "";
        if(response && response.status == true){
          this.dialogRef = this.dialog.open(InvoiceuploadDialog, {
            data:response.message.data
          });
        }else if(response.errorCode == '406'){
          this.snackBar.open(
            response.message,
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
        }
        else {
          this.dialogRef = this.dialog.open(InvoiceuploadDialog, {
            data:response.message.data
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

    //invoice format download option
    invoiceFormat(){
      this.apiservice.invoiceFormat().subscribe((res: any) => {
        if (res.status == true) {
          window.open(res.url);
        }
        if (res.status == false) {
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      });
    }

  public uploadEvent($event: any) {
    const response = $event.event.body;
    if (response && response.status == true) {
      this.snackBar.open(
        "Invoice uploaded successfully, we are processing on it. It will reflect in your account after sometime.",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    } else if (response && response.status == false) {
      this.snackBar.open(
        "Invoice uploaded, unable to process please check your invoice or try again after sometime.",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
  }

  openDialog() {
    this.dialog.open(InvoiceErrorComponent);
  }
}

// ============Dialogue box ===========================================

@Component({
  selector: "invoiceupload-dialog",
  templateUrl: "invoiceupload-dialog.html",
  styleUrls: ["./invoiceupload.component.scss"],
})
export class InvoiceuploadDialog {

  displayedColumns: string[] = [
    "invoice_no",
    "company_name",
    "invoice_date",
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
