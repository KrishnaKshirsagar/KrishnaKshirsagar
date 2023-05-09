import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiService } from "../../../services/api/api.service";

@Component({
  selector: "app-verify-captcha",
  templateUrl: "./verify-captcha.component.html",
  styleUrls: ["./verify-captcha.component.scss"],
})
export class VerifyCaptchaComponent implements OnInit {
  constructor(
    private apiservice: ApiService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<VerifyCaptchaComponent>
  ) {}

  ngOnInit(): void {
    // this.generateCaptcha();
  }

  generateCaptcha() {
    this.apiservice.generateCaptcha().subscribe((resp: any) => {
      console.log("Captcha resp ", resp);
    });
  }

  onKeyValue(event: any) {
    console.log(event.target.value);
    if (event.target.value.length == 6) {
      console.log("Maja aaya");
    }
  }
}
