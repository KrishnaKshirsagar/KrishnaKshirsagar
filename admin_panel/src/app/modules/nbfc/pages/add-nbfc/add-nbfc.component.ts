import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, MatSortable, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../services/api/api.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Location } from "@angular/common";

export interface State {
  name: string;
}

@Component({
  selector: "app-add-nbfc",
  templateUrl: "./add-nbfc.component.html",
  styleUrls: ["./add-nbfc.component.scss"],
  providers: [],
})
export class AddNbfcComponent implements AfterViewInit {

  NBFC_form!: FormGroup;

  nbfcid!: string;

  title: string = "Add NBFC";

  durationInSeconds = 2;

  edited_flag = false;

  edit_mode = false;

  stateCtrl = new FormControl();

  filteredStates: Observable<State[]>;

  states: State[] = [
    {
      name: "Arkansas",
    },
    {
      name: "California",
    },
    {
      name: "Florida",
    },
    {
      name: "Texas",
    },

    {
      name: "zrkansas",
    },
    {
      name: "ealifornia",
    },
    {
      name: "dlorida",
    },
    {
      name: "sexas",
    },

    {
      name: "srkansas",
    },
    {
      name: "rralifornia",
    },
    {
      name: "frlorida",
    },
    {
      name: "dsexas",
    },
  ];

  clear(ctrl: FormControl) {
    ctrl.setValue(null);
  }

  showdaterange: any;

  public showreport = "irr";

  ngAfterViewInit() {}

  constructor(
    private fb: FormBuilder,
    private apiservice: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private _location: Location
  ) {
    this.filteredStates = this.stateCtrl.valueChanges.pipe(
      startWith(""),
      map((state) => (state ? this._filterStates(state) : this.states.slice()))
    );
  }

  ngOnInit(): void {
    this.NBFC_form = this.fb.group({
      nbfc_name: ["", [Validators.required, Validators.pattern]],
      nbfc_status: ["", [Validators.required]],
      nbfc_email: ["", [Validators.required, Validators.pattern]],
      nbfc_mobile: ["", [Validators.pattern, Validators.required]],
      nbfc_address: ["", [Validators.required]],
      nbfc_district: ["", [Validators.required, Validators.pattern]],
      nbfc_state: ["", [Validators.required, Validators.pattern]],
      nbfc_pincode: ["", [Validators.required, Validators.pattern]],
      nbfc_interest: ["", [Validators.required, Validators.pattern]],
      payout_discount: ["", [Validators.required, Validators.pattern]],
      nbfc_bankname: ["", [Validators.required, Validators.pattern]],
      nbfc_branchname: ["", [Validators.required, Validators.pattern]],
      nbfc_accountnumber: ["", [Validators.required, Validators.pattern]],
      nbfc_accountholder: ["", [Validators.required]],
      nbfc_escrow:[""],
      //NBFC USER ADMIN
      nbfc_ifsc_code: ["", [Validators.required, Validators.pattern]],
      first_name: ["", [Validators.required, Validators.pattern]],
      last_name: ["", [Validators.required, Validators.pattern]],
      email: ["", [Validators.required, Validators.pattern]],
      mobile_number: ["", [Validators.required, Validators.pattern]],
      user_role: 'nbfcUser'
    });

    this.route.queryParams.subscribe((params) => {
      this.nbfcid = JSON.parse(params["nbfcid"]);
    });

    if (
      this.nbfcid != undefined &&
      this.nbfcid != null &&
      this.nbfcid != "" &&
      this.nbfcid != ""
    ) {
      this.edit_mode = true;
      this.title = "Edit NBFC";
      this.getNBFCDetailsByNBFCid(this.nbfcid);
    } else {
      this.edit_mode = false;
      this.title = "ADD NBFC";
    }
  }

  getNBFCDetailsByNBFCid(nbfcid: string) {
    this.apiservice.getNBFCDetailsByNBFCid(nbfcid).subscribe((resp: any) => {
      if (resp.status == true) {
        this.NBFC_form.patchValue({
          // NBFC Details
          nbfc_name: resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.nbfc_name ? resp.nbfc[0].company.nbfc_name : '',
          nbfc_status: resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.nbfc_status ? resp.nbfc[0].company.nbfc_status : '',
          nbfc_email: resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.nbfc_email ? resp.nbfc[0].company.nbfc_email : '',
          nbfc_mobile: resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.nbfc_mobile ? resp.nbfc[0].company.nbfc_mobile : '',
          nbfc_address: resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.nbfc_address ? resp.nbfc[0].company.nbfc_address : '',
          nbfc_district: resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.nbfc_district ? resp.nbfc[0].company.nbfc_district : '',
          nbfc_state: resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.nbfc_state ? resp.nbfc[0].company.nbfc_state : '',
          nbfc_pincode: resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.nbfc_pincode ? resp.nbfc[0].company.nbfc_pincode : '',
          nbfc_interest: resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.nbfc_interest ? resp.nbfc[0].company.nbfc_interest : '',
          payout_discount: resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.payout_discount ? resp.nbfc[0].company.payout_discount : '',
          nbfc_bankname: resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.nbfc_bankname ? resp.nbfc[0].company.nbfc_bankname : '',
          nbfc_branchname: resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.nbfc_branchname ? resp.nbfc[0].company.nbfc_branchname : '',
          nbfc_accountnumber: resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.nbfc_accountnumber ? resp.nbfc[0].company.nbfc_accountnumber : '',
          nbfc_accountholder: resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.nbfc_accountholder ? resp.nbfc[0].company.nbfc_accountholder : '',
          nbfc_ifsc_code: resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.nbfc_ifsc_code ? resp.nbfc[0].company.nbfc_ifsc_code : '',
          nbfc_escrow: resp.nbfc[0] && resp.nbfc[0].company && resp.nbfc[0].company.nbfc_escrow ? resp.nbfc[0].company.nbfc_escrow: '',
          // NBFC user admin details
          first_name: resp.nbfc[0] && resp.nbfc[0].user && resp.nbfc[0].user.first_name ? resp.nbfc[0].user.first_name : '',
          last_name: resp.nbfc[0] && resp.nbfc[0].user && resp.nbfc[0].user.last_name ? resp.nbfc[0].user.last_name : '',
          email: resp.nbfc[0] && resp.nbfc[0].user && resp.nbfc[0].user.email ? resp.nbfc[0].user.email : '',
          mobile_number: resp.nbfc[0] && resp.nbfc[0].user && resp.nbfc[0].user.mobile_number ? resp.nbfc[0].user.mobile_number : '',
          user_role: resp.nbfc[0] && resp.nbfc[0].userRole ? resp.nbfc[0].userRole : '',
        });
      }
    });
  }

  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();
    return this.states.filter((state) =>
      state.name.toLowerCase().includes(filterValue)
    );
  }

  onchange() {
    this.edited_flag = true;
  }

  onSubmit() {
    if (this.NBFC_form.valid) {
      if (
        this.nbfcid &&
        this.nbfcid != null &&
        this.nbfcid != undefined &&
        this.nbfcid != ""
      ) {
        if (this.edited_flag == true) {
          this.apiservice
            .updateNBFC(this.nbfcid, this.NBFC_form.value)
            .subscribe((response: any) => {
              if (response.status == true) {
                this.snackBar.open(
                  "NBFC details updated successfully",
                  "Close",
                  {
                    duration: this.durationInSeconds * 3000,
                    panelClass: ["error-dialog"],
                  }
                );
                this.router.navigate(["admin/nbfc"]);
              }
              else {
                this.snackBar.open(
                  response.message,
                  "Close",
                  {
                    duration: this.durationInSeconds * 3000,
                    panelClass: ["error-dialog"],
                  }
                );
              }
            });
        } 
        else {
          this.snackBar.open(
            "Please make changes to update NBFC details",
            "Close",
            {
              duration: this.durationInSeconds * 3000,
              panelClass: ["error-dialog"],
            }
          );
        }
      } else if (
        this.nbfcid != null &&
        this.nbfcid != undefined &&
        this.nbfcid == ""
      ) {
        this.apiservice
          .addNBFC(this.NBFC_form.value)
          .subscribe((response: any) => {
            if (response && response.status == true) {
              this.snackBar.open("NBFC added successfully", "Close", {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              });
              this.router.navigate(["admin/nbfc"]);
            } else {
              this.snackBar.open(response.message, "Close", {
                duration: this.durationInSeconds * 3000,
                panelClass: ["error-dialog"],
              });
            }
          });
      }
    }
  }

  // Cancel
  cancel() {
    this._location.back();
  }
}

// ================ Add Dialogue =====================
@Component({
  selector: "add-nbfc-dialog",
  templateUrl: "add-nbfc-dialog.html",
  styleUrls: ["./add-nbfc.component.scss"],
})
export class AddNbfcDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}
