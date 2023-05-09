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
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit {
  resetToken!: string;

  userid!: string;

  form!: FormGroup;

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
      if (queryParams["uid"] && queryParams["token"]) {
        this.userid = queryParams["uid"];
        this.resetToken = queryParams["token"];
        this.validateLink();
      }
    });

    const validatePasswordStrength = () => {
      return this.pwdStrength > 2
        ? null
        : {
            validatePasswordStrength: {
              valid: false,
            },
          };
    };

    const validateConfirmPassword = (c: FormControl) => {
      return !this.form || this.form.value.password === c.value
        ? null
        : {
            validateConfirmPassword: {
              valid: false,
            },
          };
    };

    this.form = this.fb.group({
      password: ["", [Validators.pattern, Validators.required]],
      cpassword: ["", [Validators.pattern, Validators.required]],
    });
  }

  validateLink() {
    this.apiService
      .resetpasswordLinkValidation(this.userid, this.resetToken)
      .subscribe((resp: any) => {
        if (resp.status == true) {
          this.snackBar.open(
            "Please enter password and confirm password to update the password",
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
        } else {
          this.snackBar.open("Reset password link has been expired.", "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
        }
      });
  }

  onSubmit() {
    if (this.form.valid) {
      const body = {
        ...this.form.value,
      };
      this.apiService
        .resetPassword(this.userid, this.resetToken, body)
        .subscribe((resp: any) => {
          if (resp.status == true) {
            this.snackBar.open("Password set successfully !", "Close", {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            });
            setTimeout(() => {
              this.router.navigate(["/auth/login"]);
            }, 3000);
          } else {
            this.snackBar.open(
              resp.message,
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
        });
    } else {
      this.form.patchValue({
        password: "",
        cpassword: "",
      });
    }
  }

  pwdStrengthChange(strength: number) {
    this.pwdStrength = strength;
  }
}
