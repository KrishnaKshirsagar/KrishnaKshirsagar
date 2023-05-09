import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { ApiService } from "../../services/api/api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as CryptoJS from 'crypto-js';
import {
  SocialAuthService,
  GoogleLoginProvider,
} from "angularx-social-login";
import { MatDialog } from "@angular/material/dialog";
import { REMEBER_KEY } from "src/app/shared/constants/constants";
import { environment } from "src/environments/environment";
import { ReCaptchaV3Service } from "ng-recaptcha";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  
  verifyToken!: string;

  remeber_key = REMEBER_KEY;

  recaptcha_key = environment.recaptcha.siteKey;

  redirect!: string;

  form!: FormGroup;

  private token!: string;

  private email: string = "";

  private password: string = "";

  private userid!: string;

  private userRole!: string;

  private gid: string = "";

  userData: any;

  loginEmailerror = false;

  loginPwderror = false;

  pwdVisible = false;

  durationInSeconds = 2;

  checked: any = false;
  recaptcha: any;

  changeValue(value) {
    this.checked = value.checked;
  }
  
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private socialAuthService: SocialAuthService,
    public dialog: MatDialog,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["i"]) {
        this.verifyToken = queryParams["i"];
        this.userEmailVerify();
      }
    });

    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });

    this.form = this.fb.group({
      email: ["", [Validators.pattern, Validators.required]],
      password: ["", [Validators.pattern, Validators.required]],
      recaptcha: ["", [Validators.required]],
    });
    this.remeberpatchval();
    this.recaptcha_token();
  }

  recaptcha_token() {
    this.recaptchaV3Service
      .execute("importantAction")
      .subscribe((token: string) => {
        this.form.patchValue({
          recaptcha: token,
        });
      });
  }

  remeberpatchval() {
    const remember_password = localStorage.getItem("remember_password");
    const remember_flag = localStorage.getItem("remember_flag");
    const remember_email = localStorage.getItem("remember_email");

    if (
      remember_password !== null &&
      remember_flag !== null &&
      remember_email !== null
    ) {
      var bytes = CryptoJS.AES.decrypt(remember_password, this.remeber_key);
      var originalText = bytes.toString(CryptoJS.enc.Utf8);
      this.checked = remember_flag;

      this.form.patchValue({
        email: remember_email,
        password: originalText,
      });
    }
  }

  userEmailVerify() {
    this.apiService.userEmailVerify(this.verifyToken).subscribe((resp: any) => {
      if (resp.status == true) {
        this.snackBar.open(
          "Your email id is succussfully verified, you can login now",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      } else {
        this.snackBar.open(
          "An error occurred, Please try again or contact to xuriti support team",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.email = this.form.value.email;
      this.password = this.form.value.password;
      this.recaptcha = this.form.value.recaptcha;
      this.apiService
        .loginUser(this.email.trim(), this.password, this.recaptcha)
        .subscribe((response: any) => {
          if (response.status == true) {
            this.password = CryptoJS.AES.encrypt(
              `${this.password}`,
              this.remeber_key
            ).toString();
            if (this.checked == true) {
              localStorage.setItem("remember_email", response.user.email);
              localStorage.setItem("remember_password", this.password);
              localStorage.setItem("remember_flag", this.checked);
            }
            if (this.checked == false) {
              localStorage.clear();
            }
            this.userid = response.user._id;
            this.userRole = response.user.user_role;
            if (
              this.userRole == "xuritiAdmin" ||
              this.userRole == "XuritiStaff" ||
              this.userRole == "xuritiCreditMgr"
            ) {
              this.snackBar.open(
                "You are not allowed to access this panel",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
            } else if (this.userRole == "nbfcUser") { // When NBFC user
              sessionStorage.setItem("email", response.user.email);
              sessionStorage.setItem("name", response.user.name);
              sessionStorage.setItem("Role",this.userRole);
              this.authService.setAuthStatus(response);
              this.apiService
                .fetchCompanyByUserid(this.userid)
                .subscribe((_resp: any) => {
                  if (_resp.status == true) {
                    let companies: any = _resp.Companies;
                    let companyid = companies[0].company._id;
                    sessionStorage.setItem("nbfc_id", companyid);
                    this.router.navigate([`/nbfcs/${companyid}/dashboard`]);
                  } else {
                    // this.router.navigate(["/home"]);
                  }
                });
            } else {
              if (
                this.redirect &&
                this.redirect != "/" &&
                this.userid != undefined
              ) {
                sessionStorage.setItem("email", response.user.email);
                sessionStorage.setItem("name", response.user.name);
                sessionStorage.setItem("userid", response.user._id);
                this.authService.setAuthStatus(response);
                this.router.navigate([this.redirect]);
              } else if (this.userid != undefined) {
                sessionStorage.setItem("email", response.user.email);
                sessionStorage.setItem("name", response.user.name);
                sessionStorage.setItem("userid", response.user._id);

                this.authService.setAuthStatus(response);
                this.apiService
                  .fetchCompanyByUserid(this.userid)
                  .subscribe((_resp: any) => {
                    if (
                      _resp &&
                      _resp.status == true &&
                      _resp.company != undefined &&
                      _resp.company.length > 0
                    ) {
                      this.router.navigate(["/companies"]);
                    } else {
                      this.router.navigate(["/home"]);
                    }
                  });
              }
            }
          } else {
            if (response.errorCode == 404) {
              this.snackBar.open(
                "Email Id is not registered with Xuriti.",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
              this.recaptcha_token();
            } else if (response.errorCode == 406) {
              this.snackBar.open("Please enter correct password.", "Close", {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              });
              this.recaptcha_token();
            } else if (response.errorCode == 403) {
              this.snackBar.open(
                "Your account status is inactive, please verify your account or contact to xuriti team.",
                "Close",
                {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                }
              );
              this.recaptcha_token();
            } else {
              this.snackBar.open(response.message, "Close", {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              });
              this.recaptcha_token();
            }
          }
        });
    }
  }

  onGoogleSignin() {
    this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((response) => {
        this.userData = {
          email: response.email,
          gid: response.id,
          id_token: response.idToken,
        };
        this.apiService
          .signInWithGoogle(this.userData)
          .subscribe((res: any) => {
            // USER DOESN'T EXIST
            if (res.status == false) {
              if (res.errorCode == 403) {
                this.snackBar.open(res.message, "Close", {
                  duration: this.durationInSeconds * 3000,
                  panelClass: ["error-dialog"],
                });
              } else {
                this.snackBar.open(
                  "Email Id is not registered with Xuriti.",
                  "Close",
                  {
                    duration: this.durationInSeconds * 3000,
                    panelClass: ["error-dialog"],
                  }
                );
                //Mobile verification
                setTimeout(() => {
                  const navigationExtras: NavigationExtras = {
                    queryParams: {
                      firstName: response.firstName,
                      lastName: response.lastName,
                      email: this.userData.email,
                      gid: this.userData.gid,
                      id_token: response.idToken,
                    },
                  };
                  this.router.navigate(["/auth/register"], navigationExtras);
                }, 3000);
              }
            } else {
              //user exists
              //After successfull signin, store everything in session storage for that user.
              sessionStorage.setItem("email", res.user.email);
              sessionStorage.setItem("name", res.user.name);
              this.userid = res.user._id;
              this.authService.setAuthStatus(res);
              if (this.redirect) {
                this.router.navigate([this.redirect]);
              } else {
                this.apiService
                  .fetchCompanyByUserid(this.userid)
                  .subscribe((_resp: any) => {
                    if (_resp.status == true) {
                      this.router.navigate(["/companies"]);
                    } else {
                      this.router.navigate(["/home"]);
                    }
                  });
                this.router.navigate(["/home"]);
              }
            }
          });
      });
  }
}
