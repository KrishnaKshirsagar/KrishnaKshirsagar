import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormArray, FormBuilder } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatFormField } from "@angular/material/form-field";
import { MatLabel } from "@angular/material/form-field";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { DATE_FORMAT } from "src/app/shared/constants/constants";
import { ApiService } from "../../services/api/api.service";
import { KycDocDailoagComponent } from "../components/kyc-doc-dailoag/kyc-doc-dailoag.component";

@Component({
  selector: "app-new-screen",
  templateUrl: "./kyc-screen.component.html",
  styleUrls: ["./kyc-screen.component.scss"],
})
export class KycDetails implements OnInit {
 
  urls = new Array<string>(); 

  KYCDetails : any ;

  editable: boolean = false;

  srcResult: any;
  panDetailsLink: any;
  addressProofLink: any;
  businessProofLink: any;
  ownershipProofLink: any;
  VintageProofLink: any;
  PartnershipLink: any;
  BankStatementDetailsLink: any;
  FinancialDetailsLink: any;
  GstDetailsLink: any;
  durationInSeconds = 2;
  pandetails: any = {};
  aadhar_details: any = {};
  business_proof_details: any = {};
  ownership_proof_details: any = {};
  vintage_proof_details: any = {};
  firm_partnership_details: any = {};
  banking_details: any = {};
  Financial_and_gst_returns: any = {};
  store_images: any = {};
  cheque_images: any = {};
  faceMatch: any = {};
  pan_verified_flag: any;
  aadhar_verified_flag: any;
  mobile_verified_flag: any;
  business_verify_flag: boolean = false;
  ownership_verify_flag: boolean = false;
  vintage_verify_flag: boolean = false;
  partnership_verify_flag: boolean = false;
  banking_verify_flag: boolean = false;
  financial_verify_flag: boolean = false;
  shop_imp_flag: boolean = false;
  storeDetails: any = {};
  pan_details: any ={};
  Aadhar_details: any ={};
  mobile_details: any = {};

  other_documents:any ;

  // second step flag
  public data: any;
  companyDetail: any;
  addOnBlur = true;
  company_data: any = {};
  personal_discussion: any;
  personal_discussion_flag: boolean = false;

  ckyc_details:any;

  ckyc_details_flag:boolean =false;

  bankstatement_status: string = '';

  date_format = DATE_FORMAT + ' h:mm:ss a';
  personal_discussion_verification_data: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute, 
    private router:Router,
    private apiservice: ApiService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<KycDocDailoagComponent>,
    private sanitizer: DomSanitizer
     ) {}

  updateProfile() {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.companyDetail = JSON.parse(params["companyid"]);
    });

    if (this.companyDetail) {
      this.companyDetailsByCid();
      this.get_kyc_details();
      this.get_Personal_discussion()
      this.get_Personal_discussion_verification()
      this.getckycDetails();
    }
  }

  gstdetailspage(){
    const gst = this.company_data.gst_number;
    const companyId =  this.companyDetail
    let navigationExtras: NavigationExtras = {
      queryParams: {
        gst: JSON.stringify(gst),
      },
    };
    this.router.navigate(
      [`admin/companies/${companyId}/gstdetails`],
      navigationExtras
    );
  }

  get_Personal_discussion(){
       this.apiservice.get_personal_discussion(this.companyDetail).subscribe((res:any)=>{
  
        if (res.status == true) {   
          if (res.data.length > 0) {
            let length = res.data.length - 1;
            this.personal_discussion = res.data[length]
            this.personal_discussion_flag = true;
          }
          else{
            this.personal_discussion_flag = false; 
          }
        }
      })
  }
  
  get_Personal_discussion_verification(){
    this.apiservice.get_personal_discussion_verfication(this.companyDetail).subscribe((res:any)=>{

     if (res.status == true) { 
       if (res.data.length > 0) {
         let length = res.data.length - 1;
         this.personal_discussion_verification_data = res.data[length]

        //  this.personal_discussion_flag = true;
       }
       else{
        //  this.personal_discussion_flag = false; 
       }
     }
   })
}
  getckycDetails(){
    this.apiservice.getckycDetails(this.companyDetail).subscribe((res:any)=>{
      this.ckyc_details =res.data
    })
  }

  companyDetailsByCid() {
    this.apiservice.getCompany(this.companyDetail).subscribe((response: any) => {
      this.company_data.company_name = response?.company?.company_name
      this.company_data.gst_number = response?.company?.gstin 

      this.other_documents = response.company; 
    })
  }
  

  // document dailog

  open_Doc_Dialog(url:any){
    this.dialogRef = this.dialog.open(KycDocDailoagComponent, {
      data: {
        url: url,
      },
    });
    this.dialogRef.afterClosed().subscribe(() => {
    });
  }

  download_documents(){
    this.apiservice.getAllKycDocuments(this.companyDetail).subscribe((res:any)=>{
      if (res.status == true) {
        this.snackBar.open(
          "Documents downloaded Successfully",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
        window.open(res.url);
      }
    })
  }

  downloadPersonalDiscussion(){
    this.apiservice.downloadPersonalDiscussion(this.companyDetail).subscribe((res:any)=>{
      if (res.status == true) {
        window.open(res.url);
      }else{
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

  onClickBack() {
    this.router.navigate([`admin/companies`]);
  }
  
  // get kyc details 
  get_kyc_details(){
    this.apiservice.getkyc( this.companyDetail).subscribe((r: any) => {
      if (r && r.status == true) {
        this.KYCDetails = r.data;   
        this.pan_verified_flag = r.data.pan.verified;
        this.aadhar_verified_flag = r.data.aadhar.verified;
        this.mobile_verified_flag = r.data.mobile.verified;

        this.business_verify_flag = r && r.data && r.data.business && r.data.business.files ? true : false
        this.ownership_verify_flag = r && r.data && r.data.ownership && r.data.ownership.files ? true : false
        this.vintage_verify_flag = r && r.data && r.data.vintage && r.data.vintage.files ? true : false
        this.partnership_verify_flag = r && r.data && r.data.partnership && r.data.partnership.files ? true : false
        this.banking_verify_flag = r && r.data && r.data.bankStatement && r.data.bankStatement.files ? true : false
        this.bankstatement_status = r?.data?.bankStatement?.status;

        this.financial_verify_flag = (r && r.data && r.data.financial && r.data.financial.files) 
                                      && (r && r.data && r.data.gst && r.data.gst.files) ? true : false
        this.shop_imp_flag = r && r.data && r.data.storeImages && r.data.storeImages.files ? true : false
        
        this.pandetails.panurl = r.data && r.data.pan && r.data.pan.files ? r.data.pan.files : false;
        this.Aadhar_details.aadharlink = r.data && r.data.aadhar && r.data.aadhar.files ? r.data.aadhar.files : false;
        this.vintage_proof_details.VintageProofLink = r.data && r.data.vintage && r.data.vintage.files ? r.data.vintage.files : false;
        this.firm_partnership_details.PartnershipLink = r.data && r.data.partnership && r.data.partnership.files ? r.data.partnership.files : false;
        this.banking_details.BankStatementDetailsLink = r.data && r.data.bankStatement && r.data.bankStatement.files ? r.data.bankStatement.files : false;
        this.Financial_and_gst_returns.FinancialDetailsLink = r.data && r.data.financial && r.data.financial.files ? r.data.financial.files : false;
        this.Financial_and_gst_returns.GstDetailsLink = r.data && r.data.gst && r.data.gst.files ? r.data.gst.files : false;
        this.storeDetails.images = r.data && r.data.storeImages && r.data.storeImages.files ? r.data.storeImages.files : false;
        
        
        this.data = r.data
          this.pandetails.panNumber   = this.data && this.data.pan && this.data.pan.number;
          this.pandetails.holder      = this.data && this.data.pan && this.data.pan.holder;
          // this.pandetails.panurl      = this.data && this.data.pan && this.data.pan.files;
          this.pandetails.verify      = this.data && this.data.pan && this.data.pan.verified;

          this.aadhar_details.address = this.data && this.data.aadhar && this.data.aadhar.address;
          this.aadhar_details.dob     = this.data && this.data.aadhar && this.data.aadhar.dob; 
          this.aadhar_details.gender  = this.data && this.data.aadhar && this.data.aadhar.gender;
          this.aadhar_details.holder  = this.data && this.data.aadhar && this.data.aadhar.holder;
          this.aadhar_details.number  = this.data && this.data.aadhar && this.data.aadhar.number;
          this.aadhar_details.verified  = this.data && this.data.aadhar && this.data.aadhar.verified; 
          
          // mobile details
          this.mobile_details.number   = this?.data?.mobile?.number;
          this.mobile_details.holder   = this?.data?.mobile?.holder;
          this.mobile_details.verified = this?.data?.mobile?.verified;
          // business details
          this.business_proof_details.business_proof_link = this.data.business.files;
          this.business_proof_details.documentType = this.data.business.documentType;
          this.business_proof_details.documentNumber = this.data.business.documentNumber;

          // ownership details
        this.ownership_proof_details.ownershipProofLink = r.data && r.data.ownership && r.data.ownership.files ? r.data.ownership.files : false;
        this.ownership_proof_details.documentType  = this.data && this.data.ownership && this.data.ownership.documentType ? this.data.ownership.documentType : "";
        this.ownership_proof_details.documentNumber = this.data && this.data.ownership && this.data.ownership.documentNumber ? this.data.ownership.documentNumber : ""
         
        // store images
        this.store_images.store_imageslink = this.data && this.data.storeImages && this.data.storeImages.files ? this.data.storeImages.files : false;
        
        // cheque images
        this.cheque_images.cheque_imageslink = this.data && this.data.chequeImages && this.data.chequeImages.files ? this.data.chequeImages.files : false;

        this.faceMatch.verified = this.data && this.data.faceMatch && this.data.faceMatch.verified;
        this.faceMatch.matchPercentage = this.data && this.data.faceMatch && this.data.faceMatch.matchPercentage;
        
        this.aadhar_details.front = this?.data?.aadhar?.files?.at(0)
        this.aadhar_details.back = this?.data?.aadhar?.files?.at(1)
        this.faceMatch.frist = r?.data?.faceMatch?.files?.at(0);
      }
    })
  }

  // KYC UPLOAD
  kycUpload(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        companyid: JSON.stringify(this.companyDetail),
      },
    };
    this.router.navigate(
      [`admin/companies/${this.companyDetail}/kyc_upload`],
      navigationExtras
    );
  }

  analyseBankStatement(){
    this.apiservice.analyseBankStatement(this.companyDetail).subscribe((respon: any) => {
      if(respon && respon.status == true){
        this.snackBar.open(
          respon.message,
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
        window.open(respon.url);
      }else{
        this.snackBar.open(
          respon.message,
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


