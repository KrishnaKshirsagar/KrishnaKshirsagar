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
import { User } from "src/app/shared/interfaces/entities/user.interface";
import { ApiService } from "../../services/api/api.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DeleteDailogComponent } from "../components/delete-dailog/delete-dailog.component";
import {
  DATE_FORMAT,
  LOCAL_STORAGE_AUTH_DETAILS_KEY,
} from "src/app/shared/constants/constants";
import { MappingComponent } from "../mapping/mapping.component";
import { NavigationExtras, Router } from "@angular/router";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-stafflist",
  templateUrl: "./stafflist.component.html",
  styleUrls: ["./stafflist.component.scss"],
  providers: [],
})
export class StafflistComponent implements AfterViewInit {

  Date_Format = DATE_FORMAT;

  NameControl = new FormControl();

  EmailControl = new FormControl();

  MobileControl = new FormControl();

  displayedColumns: string[] = [
    "username",
    "email",
    "mobile_number",
    "usertype",
    "createdAt",
    "registeredby",
    "status",
    "actions",
  ];
  users: User | undefined;

  userDetails!: any;

  userid!: string;

  durationInSeconds = 2;

  dataSource = new MatTableDataSource<User>([]);

  user_status: any;

  user_name!: string;

  user_email!: string;

  user_mobile!: string;

  staff_type!: string;
  registrationDateFormat: any;
  registrationDate!: any;
  maxDate!: Date;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<AddEditStaffDialog>,
    private dialogRef1: MatDialogRef<DeleteDailogComponent>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchUser();
    this.maxDate = new Date();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.user_name = filterValue;
    this.fetchUser();
  }

  filterEmail(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.user_email = filterValue;
    this.fetchUser();
  }

  filterMobile(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.user_mobile = filterValue;
    this.fetchUser();
  }

  name_clear(ctrl: any){
    ctrl.setValue("");
    this.user_name = "";
    this.fetchUser();
  }
  email_clear(ctrl: any){
    ctrl.setValue("");
    this.user_email = "";
    this.fetchUser();
  }
  mobile_clear(ctrl: any){
    ctrl.setValue("");
    this.user_mobile = "";
    this.fetchUser();
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

  fetchUser() {
    let data: any = {};
    data.status = this.user_status;
    data.user_name = this.user_name;
    data.user_email = this.user_email;
    data.user_mobile = this.user_mobile;
    data.staff_type = this.staff_type;
    data.register_date = this.registrationDateFormat;
    data.user_role = "xuriti";
    this.apiService.fetchUser(data).subscribe((resp: any) => {
      if (resp && resp.status == true) {
        this.userDetails = resp.result ? resp.result : [];
        this.dataSource = new MatTableDataSource(this.userDetails);
        this.dataSource.paginator = this.paginator;

        // this.sort.sort(({ id: 'createdAt', start: 'desc'}) as MatSortable);
        // this.dataSource.sort = this.sort;
        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "createdAt", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    });
  }

  // get user status
  staffStatus(status: any) {
    this.user_status = status;
    this.fetchUser();
  }

  // get staff by staff type
  StaffType(type: any) {
    this.staff_type = type;
    this.fetchUser();
  }
  // get staff by registration date
  registrationDateFilter() {
    this.registrationDateFormat = formatDate(
      this.registrationDate,
      "yyyy-MM-dd",
      "en-US"
    );
    this.fetchUser();
  }

  deleteUser($event: any, userid: string) {
    this.dialogRef1 = this.dialog.open(DeleteDailogComponent);
    this.dialogRef1.afterClosed().subscribe((flag) => {
      if (flag == true) {
        this.apiService.deleteUser(userid).subscribe((res: any) => {
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
          this.fetchUser();
        });
      }
    });
  }

  openDialog(user: any) {
    // this.dialog.open(StaffinviteDialog);
  }

  resendInvite(user: any) {
    const data = {
      userid: user._id,
      email: user.email,
      registeredBy: sessionStorage.getItem("LoginId"),
      reset_invite: true,
    };
    this.apiService.resendInvite(data).subscribe((resp: any) => {
      if (resp.status == true) {
        this.snackBar.open(
          "A link has been sent, Please Set password by clicking link send on your email id",
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
    });
  }

  getstaffRole(role: string): any {
    if (role == "xuritiAdmin") {
      return (role = "Xuriti Admin");
    }
    if (role == "xuritiStaff") {
      return (role = "Xuriti Staff");
    }
    if (role == "xuritiCreditMgr") {
      return (role = "Xuriti Credit Manager");
    }
    if (role == "xuritiCollectionMgr") {
      return (role = "Xuriti Collection Manager")
    }
    if (role == "xuritiCollectionStaff") {
      return (role = "Xuriti Collection Staff")
    }
    if (role == "xuritiSalesAgent") {
      return (role = "Xuriti Sales Agent")
    }
    if (role == "xuritiCollectionAgent") {
      return (role = "Xuriti Collection Agent")
    }
    if (role == "xuritiKycAgent") {
      return (role = "Xuriti KYC Agent")
    }
  }

  openDialog2(userid: string) {
    this.userid = userid;
    this.dialogRef = this.dialog.open(AddEditStaffDialog, {
      data: {
        userid: this.userid,
      },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.fetchUser();
    });
  }
  // compny_mapping dailog

  company_Mapping(staffid: string) {
    const id = staffid != undefined && staffid != null ? staffid : "";
    let navigationExtras: NavigationExtras = {
      queryParams: {
        staffId: JSON.stringify(staffid),
      },
    };
    this.router.navigate(["staffmanagement/mapping"], navigationExtras);
  }

  date_cancle(date : any){
    if (date == "register_date") {
      this.registrationDateFormat = "";
      this.registrationDate = "";
      this.fetchUser();
    } 
 }
}

@Component({
  selector: "staffinvite-dialog",
  templateUrl: "staffinvite-dialog.html",
  styleUrls: ["./stafflist.component.scss"],
})
export class StaffinviteDialog implements OnInit {
  constructor() { }

  ngOnInit() { }
}

@Component({
  selector: "add-edit-staff-dialog",
  templateUrl: "add-edit-staff-dialog.html",
  styleUrls: ["./stafflist.component.scss"],
})
export class AddEditStaffDialog implements OnInit {

  addUser_form!: FormGroup;
  editUser_form!: FormGroup;
  editUserflag: boolean = false;
  durationInSeconds = 2;
  loggedInUserId: any;
  valueChangeFlag = false;

  staff_verified_flag: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddEditStaffDialog>
  ) { }

  ngOnInit() {
    if (
      this.data.userid &&
      this.data.userid != "" &&
      this.data.userid != undefined
    ) {
      this.editUserflag = true;
      this.userdetailByUserid();
    } else {
      this.editUserflag = false;
    }

    this.addUser_form = this.fb.group({
      first_name: ["", [Validators.pattern, Validators.required]],
      last_name: ["", [Validators.pattern, Validators.required]],
      email: ["", [Validators.pattern, Validators.required]],
      mobile_number: ["", [Validators.pattern, Validators.required]],
      user_role: ["", [Validators.required]],
      // status: ["", [Validators.required]],
    });

    this.editUser_form = this.fb.group({
      firstName: ["", [Validators.pattern, Validators.required]],
      lastName: ["", [Validators.pattern, Validators.required]],
      email: ["", [Validators.required, Validators.pattern]],
      mobileNumber: ["", [Validators.pattern, Validators.required]],
      userRole: ["", [Validators.required]],
      status: ["", [Validators.required]],
    });
  }

  userdetailByUserid() {
    if (this.data.userid == undefined || this.data.userid == "") {
      this.editUser_form.patchValue({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        userRole: "",
        status: "",
      });
      return;
    }
    this.apiService
      .getUserByUserid(this.data.userid)
      .subscribe((response: any) => {
        if (response && response.user) {
          if (response.user.flag == true && response.user.active == true) {
            this.staff_verified_flag = true;
          } else {
            this.staff_verified_flag = false;
          }
          this.editUser_form.patchValue({
            firstName: response.user.first_name,
            lastName: response.user.last_name,
            email: response.user.email,
            mobileNumber: response.user.mobile_number,
            userRole: response.user.user_role,
            status: response.user.status,
          });
        }
      });
  }
  
  onSubmit() {
    const detailsStr = sessionStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      this.loggedInUserId = userDetails._id;
    }

    if (this.addUser_form.valid) {
      const userData = {
        firstName: this.addUser_form.value.first_name,
        lastName: this.addUser_form.value.last_name,
        email: this.addUser_form.value.email,
        mobileNumber: this.addUser_form.value.mobile_number,
        userRole: this.addUser_form.value.user_role,
        status: this.addUser_form.value.status,
        registeredBy: this.loggedInUserId,
      };
      this.apiService.addUser(userData).subscribe((res: any) => {
        if (res.status == true) {
          this.snackBar.open(
            "Staff added successfully, please set password by clicking link send on email.",
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
          const dialogRef = this.dialog.closeAll();
        } else {
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
          // const dialogRef = this.dialog.closeAll();
        }
      });
    }
  }

  onchange() {
    this.valueChangeFlag = true;
  }

  editUser() {
    if (this.editUser_form.valid && this.valueChangeFlag == true) {
      this.apiService
        .editUser(this.data.userid, this.editUser_form.value)
        .subscribe((res: any) => {
          if (res.status == true) {
            this.snackBar.open("Staff edited successfully.", "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
            const dialogRef = this.dialog.closeAll();
          } else {
            this.snackBar.open(res.message, "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
    } else {
      this.snackBar.open(
        "Please enter valid fields and make changes to edit.",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
