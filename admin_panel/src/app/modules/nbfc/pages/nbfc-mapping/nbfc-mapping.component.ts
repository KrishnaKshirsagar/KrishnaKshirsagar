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
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ApiService } from "../../services/api/api.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DATE_FORMAT } from "src/app/shared/constants/constants";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { DataSource } from "@angular/cdk/collections";

export interface State {
  name: string;
}

@Component({
  selector: "app-nbfc-mapping",
  templateUrl: "./nbfc-mapping.component.html",
  styleUrls: ["./nbfc-mapping.component.scss"],
  providers: [],
})
export class NbfcMappingComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  Date_Format = DATE_FORMAT;

  displayedColumns: string[] = [
    "seller",
    "seller_gstin",
    "buyer",
    "buyer_gstin",
    "creditLimit",
    "payout_fee",
    "buyer_van",
    "action",
  ];

  nbfcid!: string;

  nbfc_name: string = "";

  buyer_name: string = "";

  seller_name: String = "";

  durationInSeconds = 2;

  dataSource = new MatTableDataSource();

  buyerCompanyName = new FormControl();

  stateCtrl = new FormControl();

  companyNameControl = new FormControl();

  companySellerNameControl = new FormControl();

  filter: any = {};

  // Variable to store shortLink from api response
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  file!: File; // Variable to store file

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialogRef: MatDialogRef<NbfcMappingDialog>,
    public dialog: MatDialog,
    private apiservice: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
  }
 
  filterBuyerCompanyName(buyer_name: any) {
    const filterValue = (buyer_name.target as HTMLInputElement).value.trim();
    this.filter.buyer_name = filterValue;
    this.getNBFCCompanyMapping();
  }

  filterSellerCompanyName(seller_name: any) {
    const filterValue = (seller_name.target as HTMLInputElement).value.trim();
    this.filter.seller_name = filterValue;
    this.getNBFCCompanyMapping();
  }

  clearSeller(ctrl: any) {
    ctrl.setValue("");
    this.filter.seller_name = "";
    this.getNBFCCompanyMapping();
  }

  clearBuyer(ctrl: FormControl) {
    ctrl.setValue("");
    this.filter.buyer_name = "";
    this.getNBFCCompanyMapping();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.nbfcid = JSON.parse(params["nbfcid"]);
    });
    if (this.nbfcid && this.nbfcid != undefined) {
      this.getNBFCDetailsByNBFCid(this.nbfcid);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  buyerSelect = new FormControl();
  sellerSelect = new FormControl();

  buyer_name_clear(ctrl: any) {
    ctrl.setValue("");
    this.buyer_name = "";
    this.getNBFCCompanyMapping();
  }

  // OnClick of button Upload
  onUpload() {
    this.loading = !this.loading;
  }

  getNBFCDetailsByNBFCid(nbfcid: string) {
    this.apiservice.getNBFCDetailsByNBFCid(nbfcid).subscribe((resp: any) => {
      if (resp.status == true) {
        this.nbfc_name =
          resp &&
          resp.nbfc &&
          resp.nbfc[0].company &&
          resp.nbfc[0].company.nbfc_name
            ? resp.nbfc[0].company.nbfc_name
            : "";
        this.getNBFCCompanyMapping();
      }
    });
  }

  getNBFCCompanyMapping() {
    //Mapped buyer list
    this.apiservice
      .getNBFCCompanyMapping(this.nbfcid, this.filter)
      .subscribe((respo: any) => {
        if (respo.status == true) {
          const data =
            respo.nbfc_mapped_company && respo.nbfc_mapped_company.companies
              ? respo.nbfc_mapped_company.companies
              : [];
          this.dataSource = new MatTableDataSource(data);

          this.dataSource.paginator = this.paginator;

          this.dataSource.sort = this.sort;
          const sortState: Sort = { active: "created_at", direction: "desc" };
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
        }
      });
  }

  applyFilter1(filterValue: Event) {
    this.dataSource.filter = (filterValue.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
  }

  openDialog() {
    //Mapping Dialogue
    this.dialogRef = this.dialog.open(NbfcMappingDialog, {
      data: {
        nbfcid: this.nbfcid,
      },
    });
    this.dialogRef.afterClosed().subscribe((result) => {
      this.getNBFCCompanyMapping();
    });
  }

  unmapCompany(element: any) {
    //Un-Map
    const nbfcid = this.nbfcid;
    const buyerid =
      element && element.buyer_id && element.buyer_id._id
        ? element.buyer_id._id
        : "";
    const sellerid =
      element && element.seller_id && element.seller_id._id
        ? element.seller_id._id
        : "";
    if (
      nbfcid &&
      nbfcid != undefined &&
      nbfcid != null &&
      buyerid &&
      buyerid != undefined &&
      buyerid != null
    ) {
      this.apiservice
        .NBFCCompanyUnMapping(nbfcid, buyerid, sellerid)
        .subscribe((res: any) => {
          if (res.status == true) {
            this.snackBar.open("Company un-mapped successfully.", "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          } else {
            this.snackBar.open(res.message, "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }
          this.getNBFCCompanyMapping();
        });
    } else {
      this.snackBar.open(
        "Unable to un-mapped, please contact Xuriti team",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
  }
}

// ================= MAPPing Dialogue =========================
@Component({
  selector: "nbfc-mapping-dialog",
  templateUrl: "nbfc-mapping-dialog.html",
  styleUrls: ["./nbfc-mapping.component.scss"],
})
export class NbfcMappingDialog implements OnInit {

  company_Name: any;

  userid: any;

  seller_company_Name: any;

  companyid!: string;

  cardValue: any = {
    options: [],
  };

  selectOptions: any = [];

  selectChange = (event: any) => {
    const key: string = event.key;
    this.cardValue[key] = [...event.data];
  };

  nbfc_companyMap_form!: FormGroup;

  buyersList: any[] = [];

  buyers: any = [];

  nbfcid!: string;

  durationInSeconds = 2;

  seller_id!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NbfcMappingDialog>,
    private apiservice: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // get userid
    this.userid = sessionStorage.getItem("LoginId")
      ? sessionStorage.getItem("LoginId")
      : "";
    this.nbfc_companyMap_form = this.fb.group({
      buyers: new FormControl(),
      payout_fees: ["", [Validators.required, Validators.pattern]],
    });
    this.nbfcid = this.data && this.data.nbfcid ? this.data.nbfcid : "";
  }

  getBuyerCompanies(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2) {
      let companyName = filterValue.toUpperCase();
      this.apiservice
        .companylistForAutoSuggestion(companyName)
        .subscribe((res) => {
          this.company_Name = [...res.companies];
        });
    }
  }

  getSellerCompanies(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 2) {
      let sellerCompanyName = filterValue.toUpperCase();
      this.apiservice
        .sellerCompanylistForAutoSuggestion(sellerCompanyName)
        .subscribe((respon) => {
          this.seller_company_Name = [...respon.companies];
        });
    }
  }

  onChange(comp: any) {
    //For buyer
    this.companyid = comp._id;
  }

  onChange1(comp: any) {
    //For seller
    this.seller_id = comp._id;
  }

  displayFn(company: any) {
    const company_name =
      company && company.company_name
        ? company.company_name + "(" + company.gstin + ")"
        : "";
    return company_name;
  }

  displayFn1(company: any) {
    const company_name =
      company && company.company_name
        ? company.company_name + "(" + company.gstin + ")"
        : "";
    return company_name;
  }

  onMapCompanies() {
    const body = {
      companies: [
        {
          buyer_id: this.companyid,
          seller_id: this.seller_id,
          payout_fees: this.nbfc_companyMap_form?.value?.payout_fees ?? 0,
        },
      ],
    };
    if (
      this.nbfc_companyMap_form.valid &&
      body.companies &&
      body.companies[0].buyer_id &&
      body.companies[0].buyer_id != undefined &&
      body.companies[0].buyer_id != null &&
      body.companies[0].seller_id &&
      body.companies[0].seller_id != undefined &&
      body.companies[0].seller_id != null
    ) {
      this.apiservice
        .NBFCCompanyMapping(this.nbfcid, this.userid, body)
        .subscribe((resp: any) => {
          if (resp.status == true) {
            this.snackBar.open(
              "Company is mapped with NBFC successfully.",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          } else {
            this.snackBar.open(resp.message, "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }
          this.dialogRef.close(resp);
        });
    } else {
      this.snackBar.open("Please fill all the details", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
  }
}
