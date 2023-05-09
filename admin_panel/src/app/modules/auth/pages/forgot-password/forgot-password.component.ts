// import { error } from "@angular/compiler/src/util";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../services/api/api.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;

  pwdVisible = false;

  redirect!: string;

  durationInSeconds = 2;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["redirect"]) {
        this.redirect = queryParams["redirect"];
      }
    });

    this.form = this.fb.group({
      email: ["", [Validators.pattern, Validators.required]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.apiService.forgotPassword(this.form.value).subscribe((res: any) => {
        if (res) {
          if (res.status == true) {
            this.snackBar.open(
              "A recovery link is shared on your Email address",
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
            setTimeout(() => {
              this.router.navigate(["admin/auth/login"]);
            }, 3000);
          } else {
            this.snackBar.open(
              res.message,
              "Close",
              {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              }
            );
          }
        } else {
          this.snackBar.open(
            "An error occurred, please try again after sometime.",
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
        }
        error: (error: any) => {
          this.snackBar.open(
            "An error occurred, please try again after sometime.",
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
        };
      });
    }
  }
}
