import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
import { FormControl, FormGroup } from "@angular/forms";
import { ApiService } from "../../services/api/api.service";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-nbfc-buyerlist",
  templateUrl: "./nbfc-buyerlist.component.html",
  styleUrls: ["./nbfc-buyerlist.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class NBFCBuyerlistComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  Date_Format = DATE_FORMAT;

  currency_Format = CURRENCY_FORMAT;

  nbfcId = sessionStorage.getItem("nbfc_id");

  selection = "";

  displayedColumns: string[] = [
    // "seller",
    // "seller_gstin",
    "buyer",
    "buyer_gstin",
    "creditLimit",
    "created_at",
    "kyc_document_upload",
    "actions"
  ];

  nbfc_name: string = "";

  userRole = sessionStorage.getItem("Role");

  dataSource = new MatTableDataSource([]);

  @ViewChild(MatSort) sort!: MatSort;

  redirect!: string;

  private durationInSeconds = 2;

  nbfc_id!: string;

  maxDate!: Date;

  companyList!: any[];
  company_Name: any[];
  filter_data: any = {};

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });

    const nbfc_id = sessionStorage.getItem("nbfc_id");
    if (nbfc_id && nbfc_id != undefined && nbfc_id != null) {
      this.nbfc_id = nbfc_id;
      this.getNBFCDetailsByNBFCid(this.nbfc_id);
      this.nbfc_mapped_byuer(this.nbfc_id);
    }
    this.maxDate = new Date();
  }
   
  // Filter 
  companySelect: FormControl = new FormControl();

  buyerNameControl: FormControl = new FormControl();

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  datefilter() {
    const start = this.dateRange.value.start;
    const end = this.dateRange.value.end;

    this.filter_data.fromDate = formatDate(start, "yyyy-MM-dd", "en-US");
    this.filter_data.toDate = formatDate(end, "yyyy-MM-dd", "en-US");
    
    this.nbfc_mapped_byuer(this.nbfc_id);
  }

  creditlimit_range(val:any){
    switch (val) {
      case "0_to_1L":
          this.filter_data.minRange = 0;
          this.filter_data.maxRange = 100000;
          break;
      case "2L_to_5L":
          this.filter_data.minRange = 200000;
          this.filter_data.maxRange = 500000;
          break;
      case "5L_to_25L":
          this.filter_data.minRange = 500000;
          this.filter_data.maxRange = 2500000;
          break;
      case "above_25L" :
        this.filter_data.minRange = "min";
        this.filter_data.maxRange = "max";
          break;    
  }
  this.nbfc_mapped_byuer(this.nbfc_id);
  }



  filterCompanyName(company_name: any) {
    const filterValue = (company_name.target as HTMLInputElement).value
      .trim()
    this.filter_data.buyer_Name = filterValue 
    this.nbfc_mapped_byuer(this.nbfc_id)
  }

  clear(ctrl: FormControl) {
      ctrl.setValue("");
      this.filter_data.buyer_Name = "";
      this.nbfc_mapped_byuer(this.nbfc_id)
    }

  

  

  getNBFCDetailsByNBFCid(nbfc_id: string) {
    this.apiService.getNBFCDetailsByNBFCid(nbfc_id).subscribe((resp: any) => {
      if (resp.status == true) {
        this.nbfc_name =
          resp && resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.nbfc_name ? resp.nbfc[0].company.nbfc_name : "";
        this.getNBFCCompanyMapping();
      }
    });
  }
 
  getNBFCCompanyMapping(){
    
  }
 
  // get byuer mapped with nbfc
  nbfc_mapped_byuer(nbfc_id:string){
       this.apiService.nbfc_mapped_byuer(nbfc_id,this.filter_data).subscribe((res:any)=>{
           if (res && res.status == true) {
            const data =
              res.nbfc_mapped_company && res.nbfc_mapped_company.companies
                ? res.nbfc_mapped_company.companies
                : [];
            this.dataSource = new MatTableDataSource(data);
  
            this.dataSource.paginator = this.paginator;
  
            this.dataSource.sort = this.sort;
            const sortState: Sort = { active: "created_at", direction: "desc" };
            this.sort.active = sortState.active;
            this.sort.direction = sortState.direction;
            this.sort.sortChange.emit(sortState);
          }   
       }) 
  }

  openCompanyDetailsPage(element: any){
    const companyId = element.buyer_id._id;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(companyId),
      },
    };
    this.router.navigate(
      [`nbfcs/${this.nbfcId}/buyers/${companyId}/details`],
       navigationExtras
    );
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getInvoiceByNBFC_id() {
    const body = {
      type: "buyer",
      id: this.nbfc_id,
    };
    this.apiService.getInvoicesByNBFC_id(body).subscribe((response: any) => {
      if (response.status == true) {
        this.dataSource = new MatTableDataSource(response.nbfc_invoices);
        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "createdAt", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    });
  }  

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  companyKycDetails(element:any){
    const companyId = element.buyer_id._id;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        companyid: JSON.stringify(companyId),
      },
    };
    this.router.navigate(
      [`nbfcs/${this.nbfcId}/buyers/${companyId}/kycdetails`],
       navigationExtras
    );
  }

}
