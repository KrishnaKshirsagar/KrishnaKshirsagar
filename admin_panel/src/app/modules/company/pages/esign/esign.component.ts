import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CURRENCY_FORMAT, DATE_FORMAT } from 'src/app/shared/constants/constants';
import { ToWords } from 'to-words';
import { PaymentSummeryComponent } from '../components/payment-summery/payment-summery.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-esign',
  templateUrl: 'esign.component.html',
  styleUrls: ['./esign.component.scss'],
})
export class EsignComponent implements OnInit {

  esign_form! : FormGroup;

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  //NBFC autosuggetion
  nbfc_select: FormControl = new FormControl();

  seller_select: FormControl = new FormControl();

  NBFC_Name: any = [];

  company_Name: any = [];

  durationInSeconds = 2;

  amount_inWords!: string;

  company_name!: string;

  sellerid!: string;

  nbfc_id!: string;

  seller_list: any = [];

  buyer_list: any = [];

  buyerid!: string;

  payment_receipt!: File;
  
  buyer_gst:any;

  error_flag = false;

  max_date: Date = new Date();  

  myControl = new FormControl("");

  pdf_link: any;

  esign_link_flag: boolean = false;

  esign_link: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private apiservice: ApiService,
    private dialogueRef: MatDialogRef<PaymentSummeryComponent>,
    private dialogue: MatDialog
  ) {}

  ngOnInit() {
    this.copyEsignLink();
    this.esign_form = this.fb.group({
      buyer_name: ["", [Validators.required, Validators.pattern]],
      document:["", [Validators.required]]
    });

    this.route.queryParams.subscribe((params) => {
      this.buyerid = JSON.parse(params["id"]);
    });
    
    if(this.buyerid && this.buyerid != null && this.buyerid != undefined){
      this.apiservice.getCompany(this.buyerid).subscribe((respo: any) => {
        if(respo && respo.status == true){
          this.buyer_gst=respo.company.gstin;
          this.esign_form.patchValue({
            buyer_name: respo.company && respo.company.company_name ? respo.company.company_name : '',
          });
        }
      })
    }
  }

  // ======================== NBFC =========================
  NBFCSuggetion(event: any) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue.length > 2) {
      let NBFC_Name = filterValue.toUpperCase();
      this.apiservice
        .autosuggetionNBFC(NBFC_Name)
        .subscribe((res: any) => {
          this.NBFC_Name = [...res.get_nbfc];
        });
    }
  }

  getNBFCId(company: any) { //to select the NBFC id
    this.nbfc_id = company._id;
  }

  displayNBFCFn(nbfc: any) : string{
    const nbfc_name = nbfc && nbfc.nbfc_name ? nbfc.nbfc_name : ''
    return nbfc_name;
  }

  nbfcNameClear() {
    this.nbfc_select = new FormControl();
    this.NBFC_Name = [];
    this.nbfc_id = '';
  }


  // ======================== Seller =======================
  companySuggetion(event: any) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue.length > 2) {
      let companyName = filterValue.toUpperCase();
      this.apiservice
        .companynameAutoSuggestion(companyName)
        .subscribe((res) => {
          this.company_Name = [...res.companies];
        });
    }
  }
  getSellerId(company: any) { //to select the seller id
    this.sellerid = company._id;
  }

  displaySellerFn(company: any): string {
    return company && company.company_name ? company.company_name : "";
  }

  onChange(comp: any) {
    const sellerid = comp._id;
    if (sellerid && sellerid != undefined) {
      this.sellerid = sellerid;
    }
  }  

  clearSellerName() {
    this.seller_select = new FormControl();
    this.company_Name = [];
    this.sellerid = '';
  }

  onSubmit() {
    if (this.esign_form.valid && this.sellerid && this.sellerid != undefined && this.sellerid != null && this.nbfc_id && this.nbfc_id != null && this.nbfc_id != undefined) {
      const body = {
        buyer_gstin : this.buyer_gst,
        anchor : this.sellerid,
        nbfc : this.nbfc_id,
        document: this.esign_form.value.document
      }

      this.apiservice.esign_link(body).subscribe((resp: any) => {
        if(resp && resp.status == true){
          this.esign_link_flag = true;
          this.esign_link = resp.esign_link;
          this.pdf_link = resp.pdf_link;

          this.snackBar.open('Link generated successfully.', "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }else{
          this.esign_link_flag = false;
          this.esign_link = '';
          this.pdf_link = '';
          this.snackBar.open(resp.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
        this.nbfcNameClear();
        this.clearSellerName();
        this.esign_form.patchValue({
          document: ''
        });
      });
    }
  }

  @ViewChild('txtConfigFile') txtConfigFile!: ElementRef;
  copyEsignLink(){
    if (this.txtConfigFile) {
      // Select textarea text
      this.txtConfigFile.nativeElement.select();

      // Copy to the clipboard
      document.execCommand("copy");

      // Deselect selected textarea
      this.txtConfigFile.nativeElement.setSelectionRange(0, 0);
  }
  }

  download_pdf(){
    window.location = this.pdf_link;
  }
}
