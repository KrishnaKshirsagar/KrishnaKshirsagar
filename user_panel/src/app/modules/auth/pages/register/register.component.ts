import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  SocialAuthService,
  SocialUser,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from "angularx-social-login";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  googleUserdata: any;

  invitationToken!: string;

  firstName!: string;

  lastName!: string;

  mobile = 7879100000;

  gOTP: string | undefined;

  otp: string | undefined;

  idToken: any;

  userData: any = {};

  sharedData: any;

  section1 = true;

  section2 = false;

  section3 = false;

  otpErrorflag = false;

  form!: FormGroup;

  form2!: FormGroup;

  form3!: FormGroup;

  pwdVisible = false;

  pwdVisibleA = false;

  pwdVisibleB = false;

  pwdStrength!: number;

  durationInSeconds = 2;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    public snackBar: MatSnackBar,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.googleUserdata = params;
    });

    this.form = this.fb.group({
      firstName: ["", [Validators.pattern, Validators.required]],
      lastName: ["", [Validators.pattern, Validators.required]],
      mobile: ["", [Validators.pattern, Validators.required]],
    });

    this.form2 = this.fb.group({
      otp: ["", [Validators.pattern, Validators.required]],
    });

    this.form3 = this.fb.group({
      email: ["", [Validators.email, Validators.required]],
      password: ["", [Validators.pattern, Validators.required]],
      cpassword: ["", [Validators.pattern, Validators.required]],
    });

    if (this.googleUserdata.firstName && this.googleUserdata.lastName) {
      this.form.patchValue({
        firstName: this.googleUserdata.firstName,
        lastName: this.googleUserdata.lastName,
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.firstName = this.form.value.firstName;
      this.lastName = this.form.value.lastName;
      this.mobile = this.form.value.mobile;
      this.apiService.setMobileNumber(this.mobile).subscribe((respo: any) => {
        if (respo.status == true) {
          this.section1 = false;
          this.section2 = true;
          this.section3 = false;
          this.snackBar.open("OTP is sent on your mobile number", "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        } else {
          this.snackBar.open(respo.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      });
    }
  }

  gotoSection1() {
    this.section1 = true;
    this.section2 = false;
    this.section3 = false;
    this.form2.patchValue({
      otp: "",
    });
  }

  resendOtp() {
    this.form2.patchValue({
      otp: "",
    });
    this.apiService.setMobileNumber(this.mobile).subscribe((resp: any) => {
      if (resp.status == true) {
        this.snackBar.open("An OTP is sent on your mobile number", "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      } else {
        this.snackBar.open(resp.message, "Close", {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        });
      }
    });
  }

  onOTPVerification() {
    if (this.form2.valid) {
      const data = {
        otp: this.form2.value.otp,
        mobileNumber: this.mobile,
      };
      // this.otp = this.form2.value.otp;
      this.apiService.otpVerification(data).subscribe((res: any) => {
        if (res.status == true) {
          this.snackBar.open("OTP verified successfully", "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });

          if (
            this.googleUserdata &&
            this.googleUserdata.email &&
            this.googleUserdata.gid
          ) {
            this.userData = {
              firstName: this.googleUserdata.firstName,
              lastName: this.googleUserdata.lastName,
              gid: this.googleUserdata.gid,
              email: this.googleUserdata.email,
              id_token: this.googleUserdata.id_token,
              password: "",
              mobileNumber: this.mobile,
            };
            this.apiService.signupUser(this.userData).subscribe((res) => {
              if (res.status == true) {
                // this.authService.setAuthStatus(res);
                this.snackBar.open(
                  "You are successfully registered with Xuriti",
                  "Close",
                  {
                    duration: this.durationInSeconds * 3000,
                    panelClass: ["error-dialog"],
                  }
                );
                setTimeout(() => {
                  this.router.navigate(["/auth/login"]);
                }, 3000);
              } else {
                // if (res.errorCode == 409) {
                //   this.snackBar.open(
                //     "Email address is already registered with Xuriti.",
                //     "Close",
                //     {
                //       duration: this.durationInSeconds * 3000,
                //       panelClass: ["error-dialog"],
                //     }
                //   );
                // } else if (res.errorCode == 406) {
                //   this.snackBar.open(
                //     "Email address is registered with Xuriti but status is inactive.",
                //     "Close",
                //     {
                //       duration: this.durationInSeconds * 3000,
                //       panelClass: ["error-dialog"],
                //     }
                //   );
                // } else {
                //   this.snackBar.open(
                //     "Something went wrong, please try again after sometime.",
                //     "Close",
                //     {
                //       duration: this.durationInSeconds * 3000,
                //       panelClass: ["error-dialog"],
                //     }
                //   );
                // }
                this.snackBar.open(
                  res.message,
                  "Close",
                  {
                    duration: this.durationInSeconds * 3000,
                    panelClass: ["error-dialog"],
                  }
                );
              }
            });
          } else {
            setTimeout(() => {
              this.otpErrorflag = false;
              this.section1 = false;
              this.section2 = false;
              this.section3 = true;
            }, 3000);
          }
        } else {
          this.otpErrorflag = true;
          this.form2.patchValue({
            otp: "",
          });
          this.snackBar.open(res.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      });
    }
  }

  onSignup() {
    if (this.form3.valid) {
      if (this.form3.value.password === this.form3.value.cpassword) {
        this.userData = {
          firstName: this.firstName,
          lastName: this.lastName,
          mobileNumber: this.mobile,
          gid: "",
          email: this.form3.value.email,
          password: this.form3.value.password,
          //cpassword: this.form3.value.password,
        };
        this.apiService.signupUser(this.userData).subscribe((res) => {
          if (res.status == true) {
            this.snackBar.open(
              "A verification link has been sent on your registered email id, Please verify your email id to complete the registration process",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
            setTimeout(() => {
              this.router.navigate(["/auth/login"]);
            }, 3000);
          } else {
            this.form3.patchValue({
              email: "",
              password: "",
              cpassword: "",
            });
            this.snackBar.open(res.message, "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
          }
        });
      } else {
        this.snackBar.open(
          "Password and confirm password must be same.",
          "Close",
          {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          }
        );
      }
    }
  }

  googleSignUp() {
    this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((response) => {
        this.sharedData = {
          firstName: response.firstName,
          lastName: response.lastName,
          mobileNumber: this.mobile,
          email: response.email,
          gid: response.id,
          id_token: response.idToken,
          password: "",
        };
        this.apiService.signupUser(this.sharedData).subscribe((res: any) => {
          if (res.status == true) {
            this.snackBar.open(
              "You are successfully registered with Xuriti.",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
            setTimeout(() => {
              this.router.navigate(["/auth/login"]);
            }, 3000);
          } else {
            this.snackBar.open(res.message, "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
            // if (res.errorCode == 409) {
            //   this.snackBar.open(
            //     "Email address is already registered with Xuriti.",
            //     "Close",
            //     {
            //       duration: this.durationInSeconds * 3000,
            //       panelClass: ["error-dialog"],
            //     }
            //   );
            // } else if (res.errorCode == 406) {
            //   this.snackBar.open(
            //     "Email address is registered with Xuriti but status is inactive.",
            //     "Close",
            //     {
            //       duration: this.durationInSeconds * 3000,
            //       panelClass: ["error-dialog"],
            //     }
            //   );
            // } else {
            //   this.snackBar.open(
            //     "Something went wrong, please try again after sometime.",
            //     "Close",
            //     {
            //       duration: this.durationInSeconds * 3000,
            //       panelClass: ["error-dialog"],
            //     }
            //   );
            // }
          }
        });
      });
  }
}
