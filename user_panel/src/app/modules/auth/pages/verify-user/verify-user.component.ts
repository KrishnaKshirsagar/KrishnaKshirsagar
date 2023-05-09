import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";

@Component({
  selector: "app-verify-user",
  templateUrl: "./verify-user.component.html",
  styleUrls: ["./verify-user.component.scss"],
})
export class VerifyUserComponent implements OnInit {
  resetToken!: string;

  verification_form!: FormGroup;

  durationInSeconds = 2;

  pwdVisibleA = false;

  pwdVisibleB = false;

  pwdStrength!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["i"]) {
        this.resetToken = queryParams["i"];
        this.userMobileVerification();
      }
    });

    this.verification_form = this.fb.group({
      otp: ["", [Validators.pattern, Validators.required]],
      password: ["", [Validators.pattern, Validators.required]],
      confirmPassword: ["", [Validators.pattern, Validators.required]],
    });
  }

  userMobileVerification() {
    this.apiService
      .userMobileVerification(this.resetToken)
      .subscribe((resp: any) => {
        if (resp.status == true) {
          this.snackBar.open(
            "An OTP has been sent to your registered mobile number !",
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
        } else {
          this.snackBar.open(
            "An error occurred, Please try again or contact to support team",
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
    if (this.verification_form.valid) {
      const body = {
        otp: this.verification_form.value.otp,
        password: this.verification_form.value.password,
        confirmPassword: this.verification_form.value.confirmPassword,
        token: this.resetToken,
      };
      this.apiService.verifyUser(body).subscribe((resp: any) => {
        if (resp.status == true) {
          this.snackBar.open("Password set successfully !", "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
          setTimeout(() => {
            this.router.navigate(["/auth/login"]);
          }, 3000);
        } else {
          this.snackBar.open(resp.message, "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      });
    } else {
      this.verification_form.patchValue({
        password: "",
        confirmPassword: "",
      });
    }
  }

  pwdStrengthChange(strength: number) {
    this.pwdStrength = strength;
  }
}
