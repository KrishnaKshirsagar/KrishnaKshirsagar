import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
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
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { CURRENCY_FORMAT, DATE_FORMAT } from 'src/app/shared/constants/constants';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-companydetails',
  templateUrl: './companydetails.component.html',
  styleUrls: ['./companydetails.component.scss'],
  providers: [],
})
export class CompanydetailsComponent implements OnInit {
  @Input() 
  url: string = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCe-et0QqaJyXuwIvcfdAfSG97sVVTxNVA&q=18.5197°N,73.7784°E";
  urlSafe: SafeResourceUrl;

  durationInSeconds = 2;

  inputvalue="";

  companyDetail: any;

  companyid!: string;

  companyName!: string;

  companyDetail_form!: FormGroup;

  gstinflag = false;

  panfalg = false;

  company_nameflag = false;

  cinflag = false;

  tanflag = false;

  creditlimitflag = false;

  valueChangeFlag = false;
  
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    // public dialogRef: MatDialogRef<CompanydetailsapproveDialog>,
    private location: Location,
    public sanitizer: DomSanitizer

  ) {}

  ngOnInit(): void {
    // this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    
    this.companyDetail_form = this.fb.group({
      company_name: ["", [Validators.required]],
      gstin: ["", [Validators.pattern, Validators.required]],
      district: ["", [Validators.required, Validators.pattern]],
      state: ["", [Validators.pattern, Validators.required]],
      pinCode: ["", [Validators.required]],
      address: ["", [Validators.required]],
      industry_type: ["", [Validators.pattern]],
      cin: "",
      tan: "",
      pan: ["", [Validators.required]],
      annual_turnover: ["", [Validators.required]],
      xuriti_score: ["", [Validators.required]],

      admin_email: ["", [Validators.required]],
      admin_mobile: ["", [Validators.pattern, Validators.required]],
      creditLimit: ["", [Validators.required]],
      interest: ["", [Validators.required]],
      status: "",
      eNachMandate: false,
      // address: ['', [Validators.required]],
      // ==========================================
      company_email: ["", [Validators.pattern, Validators.required]],
      company_mobileNumber: ["", [Validators.pattern, Validators.required]],
      admin_name: ["", [Validators.required]],
      updated_by: sessionStorage.getItem("LoginId"),
    });

    this.companyid = sessionStorage.getItem('companyid');
    if (this.companyid && this.companyid != "" && this.companyid != undefined) {
      this.companyDetailsByCid();
    }
  }

  openEsignPage(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(this.companyid),
      },
    };
    this.router.navigate(
      [`admin/companies/${this.companyid}/e-sign`], navigationExtras
    );
  }

  cancel() {
    this.location.back();
  }

  companyDetailsByCid() {
    this.apiService.getCompanyDetailsById(this.companyid).subscribe((response: any) => {
      if (response && response.status == true) {
        this.companyName = response.company && response.company.company_name ? response.company.company_name : '';
        this.companyDetail_form.patchValue({
          company_name: response.company && response.company.company_name ? response.company.company_name : '',
          gstin: response.company && response.company.gstin ? response.company.gstin : '',
          district: response.company && response.company.district ? response.company.district : '',
          state: response.company && response.company.state ? response.company.state: '',
          pinCode: response.company && response.company.pincode ? response.company.pincode : '',
          industry_type: response.company && response.company.industry_type ? response.company.industry_type : '',
          cin: response.company && response.company.cin ? response.company.cin : '',
          tan: response.company && response.company.tan ? response.company.tan : '',
          pan: response.company && response.company.pan ? response.company.pan : '',
          annual_turnover: response.company && response.company.annual_turnover ? response.company.annual_turnover : '',
          xuriti_score: response.company && response.company.xuriti_score ? response.company.xuriti_score : 0,
          admin_name:
            response.company && response.company.createdBy && response.company.createdBy.first_name ? response.company.createdBy.first_name : '' +
            " " +
            response.company && response.company.createdBy && response.company.createdBy.last_name ? response.company.createdBy.last_name : '',
          status: response.company && response.company.status ? response.company.status : '',
          admin_email: response.company && response.company.createdBy && response.company.createdBy.email ? response.company.createdBy.email : '',
          admin_mobile: response.company && response.company.createdBy && response.company.createdBy.mobile_number ? response.company.createdBy.mobile_number : '',
          creditLimit: response.company && response.company.creditLimit ? response.company.creditLimit : 0,
          address: response.company && response.company.address ? response.company.address : '',
          company_email: response.company && response.company.company_email ? response.company.company_email : '',
          company_mobileNumber: response.company && response.company.company_mobile ? response.company.company_mobile : '',
          eNachMandate: response.company && response.company.eNachMandate ? response.company.eNachMandate : false,
          interest: response.company && response.company.interest ? response.company.interest : 0,
        });
      }
    });
  }

  onchange() {
    this.valueChangeFlag = true;
  }

  // ======= company updated releted flag change ======

  gstinchange() {
    this.gstinflag = true;
  }
  tanchange() {
    this.tanflag = true;
  }
  companychange() {
    this.company_nameflag = true;
  }
  cinchange() {
    this.cinflag = true;
  }
  panchange() {
    this.panfalg = true;
  }
  creditlimichange() {
    this.creditlimitflag = true;
  }

  updateCompanyDetail() {
  }

  openCompanyEditDialog() {
    this.dialog.open(CompanydetailseditDialog);
  }

}

// ==============================================================

@Component({
  selector: 'companydetailsedit-dialog',
  templateUrl: 'companydetailsedit-dialog.html',
  styleUrls: ['./companydetails.component.scss'],
})
export class CompanydetailseditDialog implements OnInit {

  verify_form!: FormGroup;

  durationInSeconds = 2;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    // public dialogRef: MatDialogRef<CompanydetailsapproveDialog>,
    private apiService: ApiService,
    private location: Location
  ) {}

  ngOnInit() {
    let formValidators: any = {};
    if (this.data.gstinflag) {
      formValidators.gstin = [false, Validators.requiredTrue];
    }

    if (this.data.panflag) {
      formValidators.pan = [false, Validators.requiredTrue];
    }

    if (this.data.companynameflag) {
      formValidators.company_name = [false, Validators.requiredTrue];
    }

    if (this.data.cinflag) {
      formValidators.cin = [false, Validators.requiredTrue];
    }

    if (this.data.tanflag) {
      formValidators.tan = [false, Validators.requiredTrue];
    }

    this.verify_form = this.fb.group(formValidators);
  }

  verifyCompany() {
  }

  cancel() {
    // this.dialogRef.close();
  }
}
