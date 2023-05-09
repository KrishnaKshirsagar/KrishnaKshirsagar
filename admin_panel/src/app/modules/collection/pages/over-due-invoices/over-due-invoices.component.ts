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
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
  LOCAL_STORAGE_AUTH_DETAILS_KEY,
} from "src/app/shared/constants/constants";
import { NavigationExtras, Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { CollectionErrorComponent } from "../components/collection-error/collection-error.component";

@Component({
  selector: "app-over-due-invoices",
  templateUrl: "./over-due-invoices.component.html",
  styleUrls: ["./over-due-invoices.component.scss"],
  providers: [],
})
export class OverDueInvoicesComponent implements AfterViewInit {
  Date_Format = DATE_FORMAT;

  currency_format = CURRENCY_FORMAT;

  invoiceControl = new FormControl;
  buyerControl  = new FormControl;
  sellerControl = new FormControl;
  filter:any = {};
  user_role!: string | null;
  dataSource1_flag: boolean = false;
  

  clearInvoice(ctrl: FormControl) {
    ctrl.setValue("");
    this.filter.invoice_number = "";
    // this.getOverdueInvoices();
  }

  clearBuyerName(ctrl: FormControl) {
    ctrl.setValue("");
    this.filter.buyer = "";
    // this.getOverdueInvoices();
  }

  clearSellerName(ctrl: FormControl) {
    ctrl.setValue("");
    this.filter.seller = "";
    // this.getOverdueInvoices();
  }

  filterInvoiceNumer(invoice_number:any){
    const filterValue = (invoice_number.target as HTMLInputElement).value
    .trim()
    .toLocaleLowerCase();
      this.filter.invoice_number = filterValue.toLocaleUpperCase();
      // this.getOverdueInvoices();
  }

  filterBuyerName(buyer_name:any){
    const filterValue = (buyer_name.target as HTMLInputElement).value
    .trim()
    .toLocaleLowerCase();
     this.filter.buyer = filterValue.toLocaleUpperCase();
     this.retailerOverdueInvoices();
  }

  filterSellerName(buyer_name:any){
    const filterValue = (buyer_name.target as HTMLInputElement).value
    .trim()
    .toLocaleLowerCase();
    this.filter.seller = filterValue.toLocaleUpperCase();
    // this.getOverdueInvoices();
  }

  invoiceByStatus(status:any){
     this.filter.invoice_status = status;
    //  this.getOverdueInvoices();
  }

  filterByCollectionStatus(collection_status : any){
    this.filter.collection_status = collection_status;
    //  this.getOverdueInvoices();
  }

  displayedColumns: string[] = [
    "retailer_name",
    "retailer_gstin",
    "retailer_email",
    "retailer_mobile",
    "company_status",
    "overdue_invoices",
    "assigned_to",
    "action",
  ];

  dataSource = new MatTableDataSource([]);

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<CommentsHistoryDialog>,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.getOverdueInvoices();
    this.user_role = sessionStorage.getItem('Role')
    this.retailerOverdueInvoices();
  }

  retailerOverdueInvoices() {
    this.apiService.retailerOverdueInvoices(this.filter).subscribe((res : any) => 
    {
          if (res.status == true) 
          {
            this.dataSource = new MatTableDataSource(res.companies); 
            this.dataSource.paginator = this.paginator;

            this.dataSource.sort = this.sort;
            const sortState: Sort = { active: " ", direction: "desc" };
            this.sort.active = sortState.active;
            this.sort.direction = sortState.direction;
            this.sort.sortChange.emit(sortState);         
          }
          else 
          {
            this.dataSource = new MatTableDataSource([]);
          }   
    })
  }

  // getOverdueInvoices() {
  //   this.apiService.getOverdueInvoices(this.filter).subscribe((response: any) => {
  //     if (response && response.status == true) {
  //       this.dataSource = new MatTableDataSource(response.overdue_invoices);
  //       this.dataSource.paginator = this.paginator;

  //        this.dataSource.sort = this.sort;
  //        const sortState: Sort = { active: " ", direction: "desc" };
  //        this.sort.active = sortState.active;
  //        this.sort.direction = sortState.direction;
  //        this.sort.sortChange.emit(sortState);
  //     }
  //     else 
  //     {
  //       this.dataSource = new MatTableDataSource([]);
  //     }
  //   });
  // }

  autidtrail(autidtrail:any){
    this.dialog.open(CollectionErrorComponent, {
      data: autidtrail,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

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

  openManageInvoice(id: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: JSON.stringify(id),
      },
    };
    this.router.navigate(
      ["admin/collection/managecollection"],
      navigationExtras
    );
  }

  openCommentsDialog(comment:any) {
    const dialogRef = this.dialog.open(CommentsHistoryDialog , {
      data: {
        comment_history : comment.comments
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  openDialog(user: any) {
    // this.dialog.open(StaffinviteDialog);
  }

  // compny_mapping dailog

  company_Mapping(staffid: string) {
    const id = staffid != undefined && staffid != null ? staffid : "";
    let navigationExtras: NavigationExtras = {
      queryParams: {
        staffId: JSON.stringify(staffid),
      },
    };
    this.router.navigate(["over-due-invoices/mapping"], navigationExtras);
  }
}

@Component({
  selector: "comments-history-dialog",
  templateUrl: "comments-history-dialog.html",
  styleUrls: ["./over-due-invoices.component.scss"],
})
export class CommentsHistoryDialog implements OnInit {

  Date_Format = DATE_FORMAT + ' h:mm:ss a';

  constructor( 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogueRef: MatDialogRef<CommentsHistoryDialog>,
    private _liveAnnouncer: LiveAnnouncer,
    ) 
  {}

  dataSource1 = new MatTableDataSource([]);
 
  displayedColumns1: string[] = [
    "comment_category",
    "comment",
    "commented_by",
    "createdAt",
  ];

  ngOnInit() {
    this.dataSource1 = new MatTableDataSource(this.data.comment_history);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource1.paginator = this.paginator;
    this.dataSource1.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }
}
