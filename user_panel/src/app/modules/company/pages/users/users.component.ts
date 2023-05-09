import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { User } from "src/app/shared/interfaces/entities/user.interface";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { ConformDailogComponent } from "../components/conform-dailog/conform-dailog.component";
import {
  DATE_FORMAT,
  LOCAL_STORAGE_AUTH_DETAILS_KEY,
} from "src/app/shared/constants/constants";
@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class UsersComponent implements AfterViewInit {
  displayedColumns: string[] = [
    "username",
    "email",
    "userRole",
    "status",
    "registered_at",
    "actions",
  ];

  Date_Format = DATE_FORMAT;

  users: User | undefined;

  userDetails!: any;

  userid!: string;

  durationInSeconds = 2;

  companyid!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  redirect!: string;

  dataSource = new MatTableDataSource<User>([]);

  private token!: string;
  user_name: string;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    public dialogRef: MatDialogRef<AddUsersDialog>,
    public dialogRef1: MatDialogRef<ConformDailogComponent>
  ) {}

  ngOnInit(): void {
    const cid = sessionStorage.getItem("companyid");
    if (cid && cid != undefined && cid != null) {
      this.companyid = cid;
    }

    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });
    this.fetchUserByCompanyId();
  }

  fetchUserByCompanyId() {
    let data = {
      user_name: this.user_name,
    };
    this.apiService
      .getUsersByCompanyId(this.companyid, data)
      .subscribe((response: any) => {
        if (response.status == true) {
          this.dataSource = new MatTableDataSource(response.users);
          this.dataSource.paginator = this.paginator;
        } else {
          this.dataSource = new MatTableDataSource([]);
        }
      });
  }

  getUsername(user: any) {
    const username =
      (user.firstName ? user.firstName : "") +
      " " +
      (user.lastName ? user.lastName : "");
    return username;
  }

  resendInvite(user: any) {
    const data = {
      userid: user._id,
      companyid: this.companyid,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      userRole: user.userRole,
    };
    this.apiService.resendInvite(data).subscribe((resp: any) => {
      if (resp.status == true) {
        this.snackBar.open(
          "An email has been sent to the user to accept the invite from Xuriti",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      } else {
        this.snackBar.open(
          "An error occured, Please try again later",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }
    });
  }

  addUserDialog(userid: string) {
    this.userid = userid;
    this.dialogRef = this.dialog.open(AddUsersDialog, {
      data: {
        userid: this.userid,
        companyid: this.companyid,
      },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.fetchUserByCompanyId();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  deleteUser($event: any, user: any) {
    const userid = user._id;
    const detailsStr = sessionStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      if (user.email == userDetails.email) {
        this.snackBar.open(
          "You are not allowed to delete this entry.",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      } else {
        this.dialogRef1 = this.dialog.open(ConformDailogComponent);
        this.dialogRef1.afterClosed().subscribe((flag) => {
          if (flag == true) {
            this.apiService.deleteUser(userid, this.companyid).subscribe(() => {
              this.fetchUserByCompanyId();
            });
          }
        });
      }
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  applyFilter(user_name: string) {
    this.user_name = user_name.trim().toLocaleLowerCase();
    this.fetchUserByCompanyId();
  }
}

// Dialog box class
@Component({
  selector: "add-users-dialog",
  templateUrl: "add-users-dialog.html",
  styleUrls: ["./users.component.scss"],
})
export class AddUsersDialog implements OnInit {
  newUser_form!: FormGroup;

  existingUser_form!: FormGroup;

  editUser_form!: FormGroup;

  seller_flag: string = "";

  user_role_obj!: any;

  loggedInUserId!: string;

  usertype: any;

  editUserflag: boolean = false;

  valueChangeFlag = false;

  companyid!: string;

  durationInSeconds = 2;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.seller_flag = sessionStorage.getItem("seller_flag");
    this.user_role_obj = [
      {
        name: "Admin",
        value: "Admin",
      },
      {
        name: "Standard",
        value: "Standard",
      },
    ];

    if (this.seller_flag == "true") {
      this.user_role_obj.push({
        name: "Head Office User",
        value: "HO_user",
      });
    }

    const detailsStr = sessionStorage.getItem(LOCAL_STORAGE_AUTH_DETAILS_KEY);
    if (detailsStr) {
      const details = JSON.parse(detailsStr);
      const userDetails = details.user;
      this.loggedInUserId = userDetails._id;
    }
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

    const cid = sessionStorage.getItem("companyid");
    if (cid && cid != undefined && cid != null) {
      this.companyid = cid;
    }

    this.newUser_form = this.fb.group({
      firstName: ["", [Validators.pattern, Validators.required]],
      lastName: ["", [Validators.pattern, Validators.required]],
      email: ["", [Validators.required]],
      mobileNumber: ["", [Validators.pattern, Validators.required]],
      userRole: ["", [Validators.required]],
    });

    this.editUser_form = this.fb.group({
      firstName: ["", [Validators.pattern, Validators.required]],
      lastName: ["", [Validators.pattern, Validators.required]],
      email: ["", [Validators.required]],
      mobileNumber: ["", [Validators.pattern, Validators.required]],
      userRole: ["", [Validators.required]],
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
      });
      return;
    }
    this.apiService
      .getUserByUserid(this.data.userid, this.data.companyid)
      .subscribe((response: any) => {
        if (response.user) {
          this.editUser_form.patchValue({
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            email: response.user.email,
            mobileNumber: response.user.mobileNumber,
            userRole: response.user.userRole,
          });
        }
      });
  }

  onchange() {
    this.valueChangeFlag = true;
  }

  onSubmit() {
    if (this.newUser_form.valid) {
      const userData = {
        firstName: this.newUser_form.value.firstName,
        lastName: this.newUser_form.value.lastName,
        email: this.newUser_form.value.email,
        mobileNumber: this.newUser_form.value.mobileNumber,
        userRole: this.newUser_form.value.userRole,
        registeredBy: this.loggedInUserId,
      };
      this.apiService
        .addUser(this.companyid, userData)
        .subscribe((res: any) => {
          if (res.status == true) {
            // if (res.errorCode == 100) {
            this.snackBar.open(
              "User added successfully, please set password by clicking link send on email.",
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
          }
        });
    }
  }

  editUser() {
    if (this.editUser_form.valid && this.valueChangeFlag == true) {
      this.apiService
        .editUser(this.data.userid, this.companyid, this.editUser_form.value)
        .subscribe((res: any) => {
          if (res.status == true) {
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
    }
    if (this.valueChangeFlag == false) {
      this.snackBar.open(
        "Please change the value to update the user details",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
  }
}
