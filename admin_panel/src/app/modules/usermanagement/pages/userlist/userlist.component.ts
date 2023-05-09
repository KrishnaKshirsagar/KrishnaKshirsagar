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
import { ActivatedRoute, Router } from "@angular/router";
import { DeleteDailogComponent } from "../components/delete-dailog/delete-dailog.component";
import { DATE_FORMAT } from "src/app/shared/constants/constants";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-userlist",
  templateUrl: "./userlist.component.html",
  styleUrls: ["./userlist.component.scss"],
  providers: [],
})
export class UserlistComponent implements AfterViewInit {

  Date_Format = DATE_FORMAT;

  NameControl = new FormControl();

  emailControl = new FormControl();

  mobileControl = new FormControl();

  displayedColumns: string[] = [
    "username",
    "email",
    "mobile_number",
    "register_date",
    // "registeredby",
    "status",
    "actions",
  ];
  users: User | undefined;

  userDetails!: any;

  userid!: string;

  registrationDate!: any;

  durationInSeconds = 2;
  dataSource = new MatTableDataSource<User>([]);
  user_status: any;
  user_name!: string;
  user_email!: string;
  user_mobile!: string;
  maxDate!: Date;
  registrationDateFormat!: string;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private _liveAnnouncer: LiveAnnouncer,
    public dialogRef: MatDialogRef<AddEditUserDialog>,
    public dialogRef1: MatDialogRef<DeleteDailogComponent>
  ) {}

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

  filterbyEmail(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.user_email = filterValue;
    this.fetchUser();
  }

  filterbyMobile(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
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
    data.register_date = this.registrationDateFormat;
    data.user_email = this.user_email
    data.user_mobile = this.user_mobile
    this.apiService.fetchUser(data).subscribe((resp: any) => {
      if (resp && resp.status == true) {
        this.userDetails = resp.result ? resp.result : "";
        this.dataSource = new MatTableDataSource(this.userDetails);
        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: "createdAt", direction: "desc" };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    });
  }

  resendInviteUser(user: any){
    const user_email = user.email;
    this.apiService.resendInviteUser(user_email).subscribe((respo: any) => {
      if(respo && respo.status == true){
        this.snackBar.open(respo.message, "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }else{
        this.snackBar.open(respo.message, "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
    })
  }

  userStatus(status: any) {
    this.user_status = status;
    this.fetchUser();
  }

  registrationDateFilter() {
    this.registrationDateFormat = formatDate(
      this.registrationDate,
      "yyyy-MM-dd",
      "en-US"
    );
    this.fetchUser();
  }

  openDialog(userid: string) {
    this.userid = userid;
    this.dialogRef = this.dialog.open(AddEditUserDialog, {
      data: {
        userid: this.userid,
      },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.fetchUser();
    });
  }

  deleteUser($event: any, userid: string) {
    this.dialogRef1 = this.dialog.open(DeleteDailogComponent);
    this.dialogRef1.afterClosed().subscribe((flag) => {
      if (flag == true) {
        this.apiService.deleteUser(userid).subscribe((res: any) => {
          this.snackBar.open("User deleted successfully.", "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
          this.fetchUser();
        });
      }
    });
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
  selector: "add-edit-user-dialog",
  templateUrl: "add-edit-user-dialog.html",
  styleUrls: ["./userlist.component.scss"],
})
export class AddEditUserDialog implements OnInit {
  newUser_form!: FormGroup;

  existingUser_form!: FormGroup;

  user_verified_flag: boolean = false;

  editUser_form!: FormGroup;

  usertype: any;

  editUserflag: boolean = false;

  companyid!: string;

  durationInSeconds = 2;

  valueChangeFlag = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddEditUserDialog>
  ) {}

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

    this.editUser_form = this.fb.group({
      firstName: ["", [Validators.pattern, Validators.required]],
      lastName: ["", [Validators.pattern, Validators.required]],
      email: ["", [Validators.required]],
      mobileNumber: [
        "",
        [Validators.pattern("^((\\+91?)|0)?[0-9]{10}$"), Validators.required],
      ],
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
          if (response.user.active == true && response.user.flag == true) {
            this.user_verified_flag = true;
          } else {
            this.user_verified_flag = false;
          }
          this.editUser_form.patchValue({
            firstName: response.user.first_name,
            lastName: response.user.last_name,
            email: response.user.email,
            mobileNumber: response.user.mobile_number,
            status: response.user.status,
          });
        }
      });
  }

  editUser() {
    if (this.editUser_form.valid && this.valueChangeFlag == true) {
      this.apiService
        .editUser(this.data.userid, this.editUser_form.value)
        .subscribe((res: any) => {
          if (res.status) {
            this.snackBar.open("User edited successfully.", "Close", {
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
      this.snackBar.open("Please make changes to edit.", "Close", {
        duration: this.durationInSeconds * 3000,
        panelClass: ["error-dialog"],
      });
    }
  }

  onchange() {
    this.valueChangeFlag = true;
  }

  cancel() {
    this.dialogRef.close();
  }
}
