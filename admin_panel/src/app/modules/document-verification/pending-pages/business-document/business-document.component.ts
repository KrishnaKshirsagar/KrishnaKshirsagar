import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FilesDialogComponent } from '../../components/files-dialog/files-dialog.component';
import { ApiService } from '../../service/api/api.service';
import { DATE_FORMAT } from 'src/app/shared/constants/constants';


@Component({
  selector: 'app-business-document',
  templateUrl: './business-document.component.html',
  styleUrls: ['./business-document.component.scss']
})
export class BusinessDocumentComponent implements OnInit {


  @Input() indicators = true;
  selectedIndex = 0;

  BuzDetails:any
  companyId:any;
  companyDetails:any;

  edwin:any ='';
  date_format= DATE_FORMAT + ' h:mm:ss a';

  

  editable: boolean = false;

  //face proof flag
  faceFlagDone = false;
  faceFlagCancel = false;

  //business proof flag
  businessFlagDone = false;
  businessFlagCancel = false;

  //ownership proof flag
  ownershipFlagDone = false
  ownershipFlagCancel = false

  //Vintage proof flag
  vintageFlagDone = false
  vintageFlagCancel = false

  //Patnership proof flag
  FirmFlagDone = false
  FirmFlagCancel = false

  //Banking Details flag
  bankingFlagDone = false
  bankingFlagCancel = false

  // Financials flag

  financialFlagCancel=false;
  financialFlagDone=false;

   //  GST Returns flag
  gstFlagCancel = false;
  gstFlagDone = false;

  // Upload flag

  imagesFlagDone = false;
  imagesFlagCancel = false;

  //Cheque Proof Flag
  chequeFlagDone =false;
  chequeFlagCancel= false;


  //dynamic comments array list

  faceCommentsList: any = [];
  businessCommentsList: any = [];
  ownershipCommentsList: any = [];
  vintageCommentsList: any = [];
  firmCommentsList: any = [];
  bankingCommentsList: any = [];
  financialCommentList:any=[]
  gstCommentsList: any = [];
  imagesCommentsList: any = [];
  chequeCommentsList: any = [];


  form!: FormGroup;




  constructor(private router: Router,
    private fb: FormBuilder,
    private apiservice: ApiService,
    private route: ActivatedRoute,
    private dialog: MatDialog ,
    private snackbar: MatSnackBar) { }

  ngOnInit() {

    this.route.params.subscribe((params) => {
      this.companyId = params['id']
    });
    this.reset();

    this.getspecifiedcompanydetails();
    this. getBuzdocument();



    this.form = this.fb.group({
      face_match:[""],
      business_proof: [""],
      ownership_proof: [""],
      vintage_proof: [""],
      firm_details: [""],
      banking_details: [""],
      financial_details: [""],
      gst_details: [""],
      images: [""],
      cheque:[""]
    })
  }

  getspecifiedcompanydetails(){
    this.apiservice.getSpecifiedCompanyDetails(this.companyId).subscribe((response:any)=>{
      if(response.status==true)
      {
       this.companyDetails= response.company;
       console.log(this.companyDetails)
      }
    })
  }

  getBuzdocument(){
    this.apiservice.getKycDocument(this.companyId).subscribe((response:any)=>{
      if(response.status==true){
        const buzDetails = response.data? response.data : [];

        this.BuzDetails=buzDetails;
        console.log(this.BuzDetails)
      }
    })
  }

  openDialog(files:any ):void{
     this.dialog.open(FilesDialogComponent,{height: '500px',
     width: '900px',
     data:{files:files}});
   
  }



  doneFlagFace() {
    //business proof done flag
    if (this.faceFlagCancel) {
      this.faceFlagCancel = !this.faceFlagCancel;
      this.faceFlagDone = !this.faceFlagDone;
    } else {
      this.faceFlagDone = !this.faceFlagDone;
    }
    if (this.faceFlagDone) {
      this.form.get('face_match')?.setValidators([Validators.required]);
      this.form.controls['face_match'].setValue("");
      this.faceCommentsList = ["Matching", "Slighty Matching", "Need More Clarity", "Other"];
    } else {
      this.form.get('face_match')?.clearValidators();
      this.form.controls['face_match'].setValue("");
      this.faceCommentsList = []
    }

  }

  cancelFlagFace() {
    //business proof cancel flag

    if (this.faceFlagDone) {
      this.faceFlagDone = !this.faceFlagDone;
      this.faceFlagCancel = !this.faceFlagCancel;
    } else {
      this.faceFlagCancel = !this.faceFlagCancel;
    }
    if (this.faceFlagCancel) {
      this.form.get('face_match')?.setValidators([Validators.required]);
      this.form.controls['face_match'].setValue("");
      this.faceCommentsList = ["Not Matching", "Duplicate", "Completely Blur", "Other"];
    } else {
      this.form.get('face_match')?.clearValidators();
      this.form.controls['face_match'].setValue("");
      this.faceCommentsList = []
    }

  }

  doneFlagBusiness() {
    //business proof done flag
   
    if (this.businessFlagCancel) {
      this.businessFlagCancel = !this.businessFlagCancel;
      this.businessFlagDone = !this.businessFlagDone;
    } else {
      this.businessFlagDone = !this.businessFlagDone;
    }
    if (this.businessFlagDone) {
      this.form.get('business_proof')?.setValidators([Validators.required]);
      this.form.controls['business_proof'].setValue("");
      this.businessCommentsList = ["Matching", "Slighty Matching", "Need More Clarity", "Other"];
    } else {
      this.form.get('business_proof')?.clearValidators();
      this.form.controls['business_proof'].setValue("");
      this.businessCommentsList = []
    }

  }

  cancelFlagBusiness() {
    //business proof cancel flag
    if (this.businessFlagDone) {
      this.businessFlagDone = !this.businessFlagDone;
      this.businessFlagCancel = !this.businessFlagCancel;
    } else {
      this.businessFlagCancel = !this.businessFlagCancel;
    }
    if (this.businessFlagCancel) {
      this.form.get('business_proof')?.setValidators([Validators.required]);
      this.form.controls['business_proof'].setValue("");
      this.businessCommentsList = ["Not Matching", "Duplicate", "Completely Blur", "Other"];
    } else {
      this.form.get('business_proof')?.clearValidators();
      this.form.controls['business_proof'].setValue("");
      this.businessCommentsList = []
    }

  }

  doneFlagOwnership() {
    //ownership Proof done flag
    if (this.ownershipFlagCancel) {
      this.ownershipFlagCancel = !this.ownershipFlagCancel;
      this.ownershipFlagDone = !this.ownershipFlagDone;
    } else {
      this.ownershipFlagDone = !this.ownershipFlagDone;
    }
    if (this.ownershipFlagDone) {
      this.form.get('ownership_proof')?.setValidators([Validators.required]);
      this.form.controls['ownership_proof'].setValue("");
      this.ownershipCommentsList = ["Matching", "Slighty Matching", "Need More Clarity", "Other"];
    } else {
      this.form.get('ownership_proof')?.clearValidators();
      this.form.controls['ownership_proof'].setValue("");
      this.ownershipCommentsList = []
    }

  }

  cancelFlagOwnership() {
    //ownership Proof cancel flag
    this.form.controls['ownership_proof'].setValue("");
    if (this.ownershipFlagDone) {
      this.ownershipFlagDone = !this.ownershipFlagDone;
      this.ownershipFlagCancel = !this.ownershipFlagCancel;
    } else {
      this.ownershipFlagCancel = !this.ownershipFlagCancel;
    }
    if (this.ownershipFlagCancel) {
      this.form.get('ownership_proof')?.setValidators([Validators.required]);
      this.form.controls['ownership_proof'].setValue("");
      this.ownershipCommentsList = ["Not Matching", "Duplicate", "Completely Blur", "Other"];
    } else {
      this.form.get('ownership_proof')?.clearValidators();
      this.form.controls['ownership_proof'].setValue("");
      this.ownershipCommentsList = []
    }
  }


  doneFlagVintage() {
    //vintage Proof done flag
    if (this.vintageFlagCancel) {
      this.vintageFlagCancel = !this.vintageFlagCancel;
      this.vintageFlagDone = !this.vintageFlagDone;
    } else {
      this.vintageFlagDone = !this.vintageFlagDone;
    }
    if (this.vintageFlagDone) {
      this.form.get('vintage_proof')?.setValidators([Validators.required]);
      this.form.controls['vintage_proof'].setValue("");
      this.vintageCommentsList = ["Matching", "Slighty Matching", "Need More Clarity", "Other"];
    } else {
      this.form.get('vintage_proof')?.clearValidators();
      this.form.controls['vintage_proof'].setValue("");
      this.vintageCommentsList = [];
    }

  }

  cancelFlagVintage() {
    //vintage Proof cancel flag
    if (this.vintageFlagDone) {
      this.vintageFlagDone = !this.vintageFlagDone;
      this.vintageFlagCancel = !this.vintageFlagCancel;
    } else {
      this.vintageFlagCancel = !this.vintageFlagCancel;
    }
    if (this.vintageFlagCancel) {
      this.form.get('vintage_proof')?.setValidators([Validators.required]);
      this.form.controls['vintage_proof'].setValue("");
      this.vintageCommentsList = ["Not Matching", "Duplicate", "Completely Blur", "Other"];
    } else {
      this.form.get('vintage_proof')?.clearValidators();
      this.form.controls['vintage_proof'].setValue("");
      this.vintageCommentsList = []
    }

  }


  doneFlagPatnership() {
    //Patnership proof done flag
    if (this.FirmFlagCancel) {
      this.FirmFlagCancel = !this.FirmFlagCancel;
      this.FirmFlagDone = !this.FirmFlagDone;
    } else {
      this.FirmFlagDone = !this.FirmFlagDone;
    }
    if (this.FirmFlagDone) {
      this.form.get('firm_details')?.setValidators([Validators.required]);
      this.form.controls['firm_details'].setValue("");
      this.firmCommentsList = ["Matching", "Slighty Matching", "Need More Clarity", "Other"];
    } else {
      this.form.get('firm_details')?.clearValidators();
      this.form.controls['firm_details'].setValue("");
      this.firmCommentsList = []
    }

  }

  cancelFlagPatnership() {
    //Patnership proof cancel flag
    if (this.FirmFlagDone) {
      this.FirmFlagDone = !this.FirmFlagDone;
      this.FirmFlagCancel = !this.FirmFlagCancel;
    } else {
      this.FirmFlagCancel = !this.FirmFlagCancel;
    }
    if (this.FirmFlagCancel) {
      this.form.get('firm_details')?.setValidators([Validators.required]);
    this.form.controls['firm_details'].setValue("");
      this.firmCommentsList = ["Not Matching", "Duplicate", "Completely Blur", "Other"];
    } else {
      this.form.get('firm_details')?.clearValidators();
      this.form.controls['firm_details'].setValue("");
      this.firmCommentsList = []
    }
  }


  doneFlagBanking() {
    // Banking Details done flag
    if (this.bankingFlagCancel) {
      this.bankingFlagCancel = !this.bankingFlagCancel;
      this.bankingFlagDone = !this.bankingFlagDone;
    } else {
      this.bankingFlagDone = !this.bankingFlagDone;
    }
    if (this.bankingFlagDone) {
      this.form.get('banking_details')?.setValidators([Validators.required]);
      this.form.controls['banking_details'].setValue("");
      this.bankingCommentsList = ["Matching", "Slighty Matching", "Need More Clarity", "Other"];
    } else {
      this.form.get('banking_details')?.clearValidators();
      this.form.controls['banking_details'].setValue("");
      this.bankingCommentsList = []
    }
  }

  cancelFlagBanking() {
    //Banking Details cancel flag
    if (this.bankingFlagDone) {
      this.bankingFlagDone = !this.bankingFlagDone;
      this.bankingFlagCancel = !this.bankingFlagCancel;
    } else {
      this.bankingFlagCancel = !this.bankingFlagCancel;
    }
    if (this.bankingFlagCancel) {
      this.form.get('banking_details')?.setValidators([Validators.required]);
      this.form.controls['banking_details'].setValue("");
      this.bankingCommentsList = ["Not Matching", "Duplicate", "Completely Blur", "Other"];
    } else {
      this.form.get('banking_details')?.clearValidators();
      this.form.controls['banking_details'].setValue("");
      this.bankingCommentsList = []
    }
  }

  doneFlagFinancial() {
    //Financial done flag
    if (this.financialFlagCancel) {
      this.financialFlagCancel = !this.financialFlagCancel;
      this.financialFlagDone = !this.financialFlagDone;
    } else {
      this.financialFlagDone = !this.financialFlagDone;
    }
    if (this.financialFlagDone) {
      this.form.get('financial_details')?.setValidators([Validators.required]);
      this.form.controls['financial_details'].setValue("");
      this.financialCommentList = ["Matching", "Slighty Matching", "Need More Clarity", "Other"];
    } else {
      this.form.get('financial_details')?.clearValidators();
      this.form.controls['financial_details'].setValue("");
      this.financialCommentList = []
    }
  }

  cancelFlagFinancial() {
    //Financial cancel flag
    if (this.financialFlagDone) {
      this.financialFlagDone = !this.financialFlagDone;
      this.financialFlagCancel = !this.financialFlagCancel;
    } else {
      this.financialFlagCancel = !this.financialFlagCancel;
    }
    if (this.financialFlagCancel) {
      this.form.get('financial_details')?.setValidators([Validators.required]);
      this.form.controls['financial_details'].setValue("");
      this.financialCommentList = ["Not Matching", "Duplicate", "Completely Blur", "Other"];
    } else {
      this.form.get('financial_details')?.clearValidators();
      this.form.controls['financial_details'].setValue("");
      this.financialCommentList = []
    }
  }



  doneFlagGST() {
    //Financial & GST Returns done flag
    if (this.gstFlagCancel) {
      this.gstFlagCancel = !this.gstFlagCancel;
      this.gstFlagDone = !this.gstFlagDone;
    } else {
      this.gstFlagDone = !this.gstFlagDone;
    }
    if (this.gstFlagDone) {
      this.form.get('gst_details')?.setValidators([Validators.required]);
      this.form.controls['gst_details'].setValue("");
      this.gstCommentsList = ["Matching", "Slighty Matching", "Need More Clarity", "Other"];
    } else {
      this.form.get('gst_details')?.clearValidators();
      this.form.controls['gst_details'].setValue("");
      this.gstCommentsList = []
    }
  }

  cancelFlagGST() {
    //Financial & GST Returns cancel flag
    if (this.gstFlagDone) {
      this.gstFlagDone = !this.gstFlagDone;
      this.gstFlagCancel = !this.gstFlagCancel;
    } else {
      this.gstFlagCancel = !this.gstFlagCancel;
    }
    if (this.gstFlagCancel) {
      this.form.get('gst_details')?.setValidators([Validators.required]);
      this.form.controls['gst_details'].setValue("");
      this.gstCommentsList = ["Not Matching", "Duplicate", "Completely Blur", "Other"];
    } else {
      this.form.get('gst_details')?.clearValidators();
      this.form.controls['gst_details'].setValue("");
      this.gstCommentsList = []
    }
  }

  doneFlagImage() {
    //Upload done flag
    if (this.imagesFlagCancel) {
      this.imagesFlagCancel = !this.imagesFlagCancel;
      this.imagesFlagDone = !this.imagesFlagDone;
    } else {
      this.imagesFlagDone = !this.imagesFlagDone;
    }
    if (this.imagesFlagDone) {
      this.form.get('images')?.setValidators([Validators.required]);
      this.form.controls['images'].setValue("");
      this.imagesCommentsList = ["Matching", "Slighty Matching", "Need More Clarity", "Other"];
    } else {
      this.form.get('images')?.clearValidators();
      this.form.controls['images'].setValue("");
      this.imagesCommentsList = []
    }
  }

  cancelFlagImage() {
    //Upload cancel flag
    if (this.imagesFlagDone) {
      this.imagesFlagDone = !this.imagesFlagDone;
      this.imagesFlagCancel = !this.imagesFlagCancel;
    } else {
      this.imagesFlagCancel = !this.imagesFlagCancel;
    }
    if (this.imagesFlagCancel) {
      this.form.get('images')?.setValidators([Validators.required]);
      this.form.controls['images'].setValue("");
      this.imagesCommentsList = ["Not Matching", "Duplicate", "Completely Blur", "Other"];
    } else {
      this.form.get('images')?.clearValidators();
      this.form.controls['images'].setValue("");
      this.imagesCommentsList = []
    }
  }

  doneFlagCheque() {
    //business proof done flag
    if (this.chequeFlagCancel) {
      this.chequeFlagCancel = !this.chequeFlagCancel;
      this.chequeFlagDone = !this.chequeFlagDone;
    } else {
      this.chequeFlagDone = !this.chequeFlagDone;
    }
    if (this.chequeFlagDone) {
      this.form.get('cheque')?.setValidators([Validators.required]);
      this.form.controls['cheque'].setValue("");
      this.chequeCommentsList = ["Matching", "Slighty Matching", "Need More Clarity", "Other"];
    } else {
      this.form.get('cheque')?.clearValidators();
      this.form.controls['cheque'].setValue("");
      this.chequeCommentsList = []
    }

  }

  cancelFlagCheque() {
    //business proof cancel flag

    if (this.chequeFlagDone) {
      this.chequeFlagDone = !this.chequeFlagDone;
      this.chequeFlagCancel = !this.chequeFlagCancel;
    } else {
      this.chequeFlagCancel = !this.chequeFlagCancel;
    }
    if (this.chequeFlagCancel) {
      this.form.get('cheque')?.setValidators([Validators.required]);
      this.form.controls['cheque'].setValue("");
      this.chequeCommentsList = ["Not Matching", "Duplicate", "Completely Blur", "Other"];
    } else {
      this.form.get('cheque')?.clearValidators();
      this.form.controls['cheque'].setValue("");
      this.chequeCommentsList = []
    }

  }

  

  selectImage(index: number): void {
    this.selectedIndex = index;
  }
  goback() {
    if (this.businessFlagDone || this.businessFlagCancel ||
      this.ownershipFlagDone || this.ownershipFlagCancel ||
      this.vintageFlagDone || this.vintageFlagCancel ||
      this.FirmFlagDone || this.FirmFlagCancel ||
      this.bankingFlagDone || this.bankingFlagCancel ||
      this.financialFlagCancel || this.financialFlagDone ||
      this.gstFlagCancel || this.gstFlagDone ||
      this.imagesFlagDone || this.imagesFlagCancel ||
      this.chequeFlagDone || this.chequeFlagCancel
    ){
      this.snackbar.open("Please submit the document","Close", {
        duration: 3000
      })
    }else{
      this.router.navigate([`admin/document-verification/pending`]);
    }
     
  }

  previous() {
    if (this.businessFlagDone || this.businessFlagCancel ||
      this.ownershipFlagDone || this.ownershipFlagCancel ||
      this.vintageFlagDone || this.vintageFlagCancel ||
      this.FirmFlagDone || this.FirmFlagCancel ||
      this.bankingFlagDone || this.bankingFlagCancel ||
      this.financialFlagCancel || this.financialFlagDone ||
      this.gstFlagCancel || this.gstFlagDone ||
      this.imagesFlagDone || this.imagesFlagCancel ||
      this.chequeFlagDone || this.chequeFlagCancel
    ){
      this.snackbar.open("Please submit the document","Close", {
        duration: 3000
      })
    }else{
      this.router.navigate([`admin/document-verification/kyc_document/${this.companyId}`]);
    }
     
  }
  download_documents(){
    this.apiservice.getAllKycDocuments(this.companyId).subscribe((res:any)=>{
      console.log(this.companyId)
      if (res.status == true) {
        this.snackbar.open(
          "Documents downloaded Successfully",
          "Close",
          {
            duration: 3000,
            panelClass: ["error-dialog"],
          }
        );
        window.open(res.url);
      }
    })
  }

  reset(){
    this.businessFlagDone = false;
    this.businessFlagCancel = false;
  
    //ownership proof flag
    this.ownershipFlagDone = false
    this.ownershipFlagCancel = false
  
    //Vintage proof flag
    this.vintageFlagDone = false
    this.vintageFlagCancel = false
  
    //Patnership proof flag
    this.FirmFlagDone = false
    this.FirmFlagCancel = false
  
    //Banking Details flag
    this.bankingFlagDone = false
    this.bankingFlagCancel = false
  
    // Financials flag
  
    this.financialFlagCancel=false;
    this.financialFlagDone=false;
  
     //  GST Returns flag
    this.gstFlagCancel = false;
    this.gstFlagDone = false;
  
    // Upload flag
  
    this.imagesFlagDone = false;
    this.imagesFlagCancel = false;

    //Cheque Proof Flag
  this.chequeFlagDone =false;
  this.chequeFlagCancel= false;
  
    //dynamic comments array list
  
    this.businessCommentsList = [];
    this. ownershipCommentsList = [];
    this. vintageCommentsList = [];
    this. firmCommentsList = [];
    this. bankingCommentsList = [];
    this.financialCommentList=[]
    this. gstCommentsList = [];
    this.imagesCommentsList = [];
    this.chequeCommentsList = [];

  }

  onSubmit() {

    
    let body: any = {};

    body["gstin"] = this.companyDetails.gstin;
  

    if (this.faceFlagDone || this.faceFlagCancel) {
      if (this.form.value.face_match != "" ) {
        let status = "";
        let comment="";
        comment = this.form.value.face_match;

        if (this.faceFlagDone) {
          status = "Approved"
        } else if(this.faceFlagCancel) {
          status = "Rejected"
        } else {
          status = "In-Progress"
        }

        body["faceMatch"] = {
          "comment": comment,
          "status" : status
        }
      } else {
        this.snackbar.open("Please comment on face recognition details","Close",{
          duration: 3000
        })
      }
    }



    if (this.businessFlagDone || this.businessFlagCancel) {
      if (this.form.value.business_proof != "" ) {
        let status = "";
    let comment="";
        comment = this.form.value.business_proof;

        if (this.businessFlagDone) {
          status = "Approved"
        } else if(this.businessFlagCancel) {
          status = "Rejected"
        } else {
          status = "In-Progress"
        }

        body["BusinessProof"] = {
          "comment": comment,
          "status" : status
        }
      } else {
        this.snackbar.open("Please comment on business details","Close",{
          duration: 3000
        })
      }
    }


    if (this.ownershipFlagDone || this.ownershipFlagCancel) {
      if (this.form.value.ownership_proof != "" ) {
        let status = "";
    let comment="";
        comment = this.form.value.ownership_proof
        if (this.ownershipFlagDone) {
          status = "Approved"
        } else if (this.ownershipFlagCancel) {
          status = "Rejected"
        } else {
          status = "In-Progress"
        }

        body["OwnershipProof"] = {
          "comment": comment,
          "status": status
        }
      } else {
        this.snackbar.open("Please comment on ownership details","Close",{
          duration: 3000
        })
      }
    }


    if (this.vintageFlagDone || this.vintageFlagCancel) {
      if (this.form.value.vintage_proof != "" ) {
        let status = "";
    let comment="";
        comment = this.form.value.vintage_proof;
        if (this.vintageFlagDone) {
          status = "Approved"
        } else if (this.vintageFlagCancel) {
          status = "Rejected"
        } else {
          status = "In-Progress"
        }

        body["VintageProof"] = {
          "comment": comment,
          "status": status
        }
      } else {
        this.snackbar.open("Please comment on vintage details","Close",{
          duration: 3000
        });
      }
    }


    if (this.FirmFlagDone || this.FirmFlagCancel) {
      if (this.form.value.firm_details != "" ) {
        let status = "";
    let comment="";
        comment = this.form.value.firm_details;
        if (this.FirmFlagDone) {
          status = "Approved"
        } else if (this.FirmFlagCancel) {
          status = "Rejected"
        } else {
          status = "In-Progress"
        }

        body["PartnershipDetails"] = {
          "comment": comment,
          "status": status
        }
      } else {
        this.snackbar.open("Please comment on firm and partnership details","Close",{
          duration: 3000
        });
      }
    }


    if (this.bankingFlagDone || this.bankingFlagCancel) {
      if (this.form.value.banking_details != "" ) {
        let status = "";
    let comment="";
        comment = this.form.value.banking_details
        if (this.bankingFlagDone) {
          status = "Approved"
        } else if(this.bankingFlagCancel) {
          status = "Rejected"
        } else {
          status = "Approved"
        }

        body["BankStatementDetails"] = {
          "comment": comment,
          "status": status
        }
      } else {
        this.snackbar.open("Please comment on banking details","Close",{
          duration: 3000
        });
      }
    }


    if (this.gstFlagDone || this.gstFlagCancel) {
      if (this.form.value.gst_details != "" ) {
        let status = "";
    let comment="";
        comment = this.form.value.gst_details;
        if (this.gstFlagDone) {
          status = "Approved"
        } else if (this.gstFlagCancel) {
          status = "Rejected"
        } else {
          status = "In-Progress"
        }

        body["GstDetails"] = {
          "comment": comment,
          "status": status
        }
      } else {
        this.snackbar.open("Please comment on GST details","Close",{
          duration: 3000
        });
      }
    }


    if (this.financialFlagDone || this.financialFlagCancel) {
      if (this.form.value.financial_details != "" ) {
        let status = "";
    let comment="";
        comment = this.form.value.financial_details;
        if (this.financialFlagDone) {
          status = "Approved"
        } else if (this.financialFlagCancel) {
          status = "Rejected"
        } else {
          status = "In-Progress"
        }

        body["FinancialDetails"] = {
          "comment": comment,
          "status": status
        }
      } else {
        this.snackbar.open("Please comment on financial details","Close",{
          duration: 3000
        });
      }
    }


    if (this.imagesFlagDone || this.imagesFlagCancel) {
      if (this.form.value.images != "" ) {
        let status = "";
    let comment="";
        comment = this.form.value.images;
        if (this.imagesFlagDone) {
          status = "Approved"
        } else if (this.imagesFlagCancel) {
          status = "Rejected"
        } else {
          status = "In-Progress"
        }

        body["StoreImages"] = {
          "comment": comment,
          "status": status
        }
      } else {
        this.snackbar.open("Please comment on uploaded store images ","Close",{
          duration: 3000
        });
      }
    }


    if (this.chequeFlagDone || this.chequeFlagCancel) {
      if (this.form.value.cheque != "" ) {
        let status = "";
    let comment="";
        comment = this.form.value.cheque;
        if (this.chequeFlagDone) {
          status = "Approved"
        } else if (this.chequeFlagCancel) {
          status = "Rejected"
        } else {
          status = "In-Progress"
        }

        body["ChequeImages"] = {
          "comment": comment,
          "status": status
        }
      } else {
        this.snackbar.open("Please comment on uploaded cheque images","Close",{
          duration: 3000
        });
      }
    }


    if(this.form.valid){
    this.apiservice.setStatusForDocument(this.companyId, body).subscribe((res: any) => {
      this.snackbar.open(res.message, "Close",{
        duration: 3000
      });
      this.ngOnInit();
    })
  }
    
  }
}
