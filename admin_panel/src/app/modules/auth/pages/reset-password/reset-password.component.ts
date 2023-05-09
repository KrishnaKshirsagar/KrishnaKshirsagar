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
      if (queryParams["i"]) {
        this.resetToken = queryParams["i"];
      }
    });

    this.form = this.fb.group({
      password: ["", [Validators.pattern, Validators.required]],
      confirmPassword: ["", [Validators.pattern, Validators.required]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const body = {
        ...this.form.value,
        token: this.resetToken,
      };
      this.apiService.resetPassword(body).subscribe((resp: any) => {
        if (resp.status == true) {
          this.snackBar.open("Password set successfully !", "Close", {
            duration: this.durationInSeconds * 3000,
            panelClass: ["error-dialog"],
          });
          setTimeout(() => {
            this.router.navigate(["admin/auth/login"]);
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
        confirmPassword: "",
      });
      this.snackBar.open(
        "Password and Confirm Password does not match !",
        "Close",
        {
          duration: this.durationInSeconds * 3000,
          panelClass: ["error-dialog"],
        }
      );
    }
  }

  pwdStrengthChange(strength: number) {
    this.pwdStrength = strength;
  }
}
