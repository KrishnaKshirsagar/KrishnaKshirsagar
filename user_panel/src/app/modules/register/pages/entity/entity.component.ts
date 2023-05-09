import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { RegisterErrorComponent } from "../components/register-error/register-error.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { LOCAL_STORAGE_AUTH_DETAILS_KEY } from "src/app/shared/constants/constants";
import { MatSnackBar } from "@angular/material/snack-bar";
import { VerifyCaptchaComponent } from "../components/verify-captcha/verify-captcha.component";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-entity",
  templateUrl: "./entity.component.html",
  styleUrls: ["./entity.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class EntityComponent implements OnInit {

  BaseUrl = environment.baseUrl;
  
  inputvalue = "";

  redirect!: string;

  userid!: string;

  manualMode!: boolean;
  
  title!: string;

  msg!: string;

  admin_email!: string;

  admin_mobile!: number;

  gstin!: string;

  gst_form!: FormGroup;

  companyDetail_form!: FormGroup;

  private token!: string;

  durationInSeconds = 2;

  companyname!: string;

  address!: string;

  district = "";

  consentflag = true;

  seller_flag = false;

  state = "";

  pinCode = "";

  pan = "";

  industry_type: any;

  companyflag = false;

  companySelect: FormControl = new FormControl();

  companyList = [];

  associated_seller: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<VerifyCaptchaComponent>
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });
    const detailsStr = sessionStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      if (userDetails && userDetails != undefined && userDetails != null) {
        this.admin_email = userDetails.email;
        this.admin_mobile = userDetails.mobile_number;
        this.userid = userDetails._id;
      }
    }
    this.gst_form = this.fb.group({
      gstin: ["", [Validators.pattern, Validators.required]],
    });

    this.companyDetail_form = this.fb.group({
      cin: [""],
      tan: [""],
      company_name: [""],
      admin_email: ["", [Validators.required]],
      admin_mobile: ["", [Validators.required]],
      consent: [this.consentflag, [Validators.requiredTrue]],
      associated_seller: ['']
    });
    this.companyDetail_form.controls['cin'].disable();
    this.companyDetail_form.controls['tan'].disable();

    this.getSellerList();
  }

  getSellerList(){
    this.apiService.getSellerList().subscribe((respon: any) => {
      if(respon?.status == true){
        this.companyList = respon?.seller_list;
      }
    })
  }

// consent method
  consent_cheack(val:any){
    this.consentflag = val.checked;
  }

  sellerFlagCheack(eve: any){
    this.seller_flag = eve?.checked;
    if(this.seller_flag == true){
      this.associated_seller = '';
      this.companyDetail_form.patchValue({
        associated_seller: ''
      })
    }
  }

  openTermsCondition(){
    this.apiService.openTermsConditionsLink().subscribe((respon: any) => {
      if(respon && respon.status == true){
        window.location.href = respon.url;
      }
    })
  }

  getCompanyDetailsByGST() {
    if (this.gst_form.valid) {
      this.gstin = this.gst_form.value.gstin;
      const gstin_data = {
        gstin: this.gstin,
        // captcha: this.gst_form.value.captcha,
      };
      this.apiService
        .getCompanyDetailsByGST(gstin_data)
        .subscribe((resp: any) => {
          if (resp && resp.status == true) {
            this.companyflag = true;
            this.manualMode = false;
            this.companyDetail_form.controls['cin'].enable();
            this.companyDetail_form.controls['tan'].enable();
            const cdata = resp.company;
            this.pan = this.gstin.substring(2, 12);
            this.companyname = cdata.companyName;
            this.address = cdata.address;
            this.district = cdata.district;
            this.industry_type = cdata.industry_type;
            this.pinCode = cdata.pinCode;
            this.state = cdata.state;

            this.companyDetail_form.patchValue({
              cin: cdata.cin,
              tan: cdata.tan,
            });
            if (this.admin_email && this.admin_mobile) {
              this.companyDetail_form.patchValue({
                admin_email: this.admin_email,
                admin_mobile: this.admin_mobile,
              });
            }
          }
          else if (resp && resp.signzy && resp.status == false){
            this.snackBar.open('Please enter your company name', "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
            this.manualMode = true;
            this.companyflag = false;
            this.companyDetail_form.controls['cin'].enable();
            this.companyDetail_form.controls['tan'].enable();
            this.pan = this.gstin.substring(2, 12);
            if (this.admin_email && this.admin_mobile) {
              this.companyDetail_form.patchValue({
                admin_email: this.admin_email,
                admin_mobile: this.admin_mobile,
              });
            }

          }  
          else {
            this.companyflag = false;
            this.companyDetail_form.controls['cin'].disable();
            this.companyDetail_form.controls['tan'].disable();
            this.title = "Invalid GST number";
            this.msg =
              "No company details found against this GST number, Please enter the valid GST number.";
            this.companyDetail_form.patchValue({
              cin: "",
              tan: "",
              companyMobileNumber: "",
              companyEmail: "",
            });

            this.snackBar.open(resp.message, "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
    } else if (this.consentflag == false) {
      this.snackBar.open("Please accept the terms and condition.", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    } else {
      this.companyDetail_form.controls['cin'].disable();
      this.companyDetail_form.controls['tan'].disable();
      this.companyflag = false;
      this.pan = "";
      this.companyname = "";
      this.address = "";
      this.district = "";
      this.industry_type = "";
      this.pinCode = "";
      this.state = "";

      this.companyDetail_form.patchValue({
        cin: "",
        tan: "",
      });
    }
  }

  openDialog(title: string, msg: string) {
    this.dialog.open(RegisterErrorComponent, {
      data: {
        title: title,
        msg: msg,
      },
    });
  }

  selectedSeller(event: any){
    this.associated_seller = event?.value;
  }

  onSubmit() {
    console.log(this.gst_form.value,this.companyDetail_form.value,this.companyDetail_form.valid, this.consentflag, this.manualMode,this.companyname)
    if (
      this.gst_form.valid &&
      this.companyDetail_form.valid &&
      this.consentflag == true &&
      this.companyname
    ) {
      const company_details = {
        userID: this.userid,
        gstin: this.gstin,
        seller_flag: this.seller_flag,
        associated_seller: this.associated_seller,
        companyName: this.companyname,
        address: this.address,
        district: this.district,
        state: this.state,
        pincode: this.pinCode,
        pan: this.pan,
        cin: this.companyDetail_form.value.cin,
        tan: this.companyDetail_form.value.tan,
        industry_type: this.industry_type,
        admin_email: this.admin_email,
        admin_mobile: this.admin_mobile,
        consent_gst_defaultFlag: this.companyDetail_form.value.consent,
      };
      if(this.manualMode){
        company_details.companyName = this.companyDetail_form.value.company_name;
      }
      this.apiService
        .saveCompanyDetails(this.userid, company_details)
        .subscribe((resp: any) => {
          if (resp.status) {
            this.snackBar.open(
              "Thank you for registering with Xuriti. Our team will verify the details and confirm your registration",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
            setTimeout(() => {
              this.router.navigate(["/companies"]);
            }, 3000);
          } else {
            this.companyDetail_form.controls['cin'].disable();
            this.companyDetail_form.controls['tan'].disable();
            this.companyflag = false;
            this.pan = "";
            this.companyname = "";
            this.address = "";
            this.district = "";
            this.industry_type = "";
            this.pinCode = "";
            this.state = "";

            this.gst_form.patchValue({
              gstin: "",
            });

            this.companyDetail_form.patchValue({
              cin: "",
              tan: "",
            });
            this.snackBar.open(resp.message, "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
    } 
    else {
      this.companyDetail_form.controls['cin'].disable();
      this.companyDetail_form.controls['tan'].disable();
      this.companyflag = false;
      this.pan = "";
      this.companyname = "";
      this.address = "";
      this.district = "";
      this.industry_type = "";
      this.pinCode = "";
      this.state = "";

      if(!this.manualMode){
        this.gst_form.patchValue({
          gstin: "",
        });
      }

      this.companyDetail_form.patchValue({
        cin: "",
        tan: "",
      });
      this.snackBar.open(
        "Please fill all the fields",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
  }
}
