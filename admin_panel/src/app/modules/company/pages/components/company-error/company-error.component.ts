import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-company-error',
  templateUrl: './company-error.component.html',
  styleUrls: ['./company-error.component.scss'],
})
export class CompanyErrorComponent implements OnInit {

  statuschangflag = false;

  creditApproval_form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CompanyErrorComponent>
  ) {}

  ngOnInit(): void {
    this.creditApproval_form = this.fb.group({
      comment: ["", [Validators.required]],
    });
  }

  onSubmit() {
    let data: any = {};
    data.flag = this.statuschangflag = true;
    data.comment = this.creditApproval_form.value.comment;
    this.dialogRef.close(data);
  }
  cancel() {
    this.dialogRef.close(this.statuschangflag);
  }
}
