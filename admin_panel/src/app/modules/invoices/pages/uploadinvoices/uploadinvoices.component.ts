import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormControl } from "@angular/forms";
@Component({
  selector: "app-uploadinvoices",
  templateUrl: "./uploadinvoices.component.html",
  styleUrls: ["./uploadinvoices.component.scss"],
  providers: [],
})
export class UploadinvoicesComponent implements AfterViewInit {
  displayedColumns: string[] = [
    "companyname",
    "companyaddress",
    "gstnumber",
    "companyphone",
    "actions",
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  uploadinvoicesdeleteDialog() {
    this.dialog.open(UploadinvoicesdeleteDialog);
  }
}

@Component({
  selector: "uploadinvoicesdelete-dialog",
  templateUrl: "uploadinvoicesdelete-dialog.html",
  styleUrls: ["./uploadinvoices.component.scss"],
})
export class UploadinvoicesdeleteDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}

export interface PeriodicElement {
  companyname: string;
  companyaddress: string;
  gstnumber: string;
  companyphone: string;
  actions: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    companyname: "ABC Pvt. Ltd",
    companyaddress:
      "address of dummy, location map, directions to dummy Bangalore",
    gstnumber: "18AABCU9603R1ZM",
    companyphone: "+919876543210",
    actions: "Active",
  },

  {
    companyname: "BAC Pvt. Ltd",
    companyaddress:
      "address of dummy, location map, directions to dummy Bangalore",
    gstnumber: "18AABCU9603R1ZM",
    companyphone: "+919876543210",
    actions: "Active",
  },

  {
    companyname: "CABC Pvt. Ltd",
    companyaddress:
      "address of dummy, location map, directions to dummy Bangalore",
    gstnumber: "18AABCU9603R1ZM",
    companyphone: "+919876543210",
    actions: "Active",
  },

  {
    companyname: "DABC Pvt. Ltd",
    companyaddress:
      "address of dummy, location map, directions to dummy Bangalore",
    gstnumber: "18AABCU9603R1ZM",
    companyphone: "+919876543210",
    actions: "Active",
  },

  {
    companyname: "EABC Pvt. Ltd",
    companyaddress:
      "address of dummy, location map, directions to dummy Bangalore",
    gstnumber: "18AABCU9603R1ZM",
    companyphone: "+919876543210",
    actions: "Active",
  },

  {
    companyname: "FABC Pvt. Ltd",
    companyaddress:
      "address of dummy, location map, directions to dummy Bangalore",
    gstnumber: "18AABCU9603R1ZM",
    companyphone: "+919876543210",
    actions: "Active",
  },

  {
    companyname: "GABC Pvt. Ltd",
    companyaddress:
      "address of dummy, location map, directions to dummy Bangalore",
    gstnumber: "18AABCU9603R1ZM",
    companyphone: "+919876543210",
    actions: "Active",
  },

  {
    companyname: "HABC Pvt. Ltd",
    companyaddress:
      "address of dummy, location map, directions to dummy Bangalore",
    gstnumber: "18AABCU9603R1ZM",
    companyphone: "+919876543210",
    actions: "Active",
  },

  {
    companyname: "IABC Pvt. Ltd",
    companyaddress:
      "address of dummy, location map, directions to dummy Bangalore",
    gstnumber: "18AABCU9603R1ZM",
    companyphone: "+919876543210",
    actions: "Active",
  },

  {
    companyname: "JABC Pvt. Ltd",
    companyaddress:
      "address of dummy, location map, directions to dummy Bangalore",
    gstnumber: "18AABCU9603R1ZM",
    companyphone: "+919876543210",
    actions: "Active",
  },

  {
    companyname: "KABC Pvt. Ltd",
    companyaddress:
      "address of dummy, location map, directions to dummy Bangalore",
    gstnumber: "18AABCU9603R1ZM",
    companyphone: "+919876543210",
    actions: "Active",
  },

  {
    companyname: "LABC Pvt. Ltd",
    companyaddress:
      "address of dummy, location map, directions to dummy Bangalore",
    gstnumber: "18AABCU9603R1ZM",
    companyphone: "+919876543210",
    actions: "Active",
  },
  {
    companyname: "MABC Pvt. Ltd",
    companyaddress:
      "address of dummy, location map, directions to dummy Bangalore",
    gstnumber: "18AABCU9603R1ZM",
    companyphone: "+919876543210",
    actions: "Active",
  },
];
