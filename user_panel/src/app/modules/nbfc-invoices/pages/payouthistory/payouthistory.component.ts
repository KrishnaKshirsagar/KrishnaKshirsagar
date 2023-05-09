import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { ApiService } from "../../services/api/api.service";
import { MatFormField } from "@angular/material/form-field";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
} from "src/app/shared/constants/constants";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-payouthistory",
  templateUrl: "./payouthistory.component.html",
  styleUrls: ["./payouthistory.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class PayouthistoryComponent implements AfterViewInit {

  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  redirect!: string;

  nbfc_id: string;

  displayedColumns: string[] = [
    "invoice",
    "transaction_id",
    "transaction_date",
    "amount",
    // "invoice_amount",
    "payment_status",
    "UTR_id",
    "beneficiary_gst",
    "remarks"
  ];
  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  invoice_number: any;
  filterInvoiceDate: any;
  filterPaymentDate: any;
  seller_id: any;
  companyList: any[];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
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
    }
  //  this.get_payout_history();
  }
  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
 
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  get_payout_history(){
    this.apiService.get_payout_history(this.nbfc_id).subscribe((res:any)=>{
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
}
