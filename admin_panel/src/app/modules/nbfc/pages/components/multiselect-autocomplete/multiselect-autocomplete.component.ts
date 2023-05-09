import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
// import { ItemData } from './multi-select-item-data';

@Component({
  selector: "multiselect-autocomplete",
  templateUrl: "./multiselect-autocomplete.component.html",
  styleUrls: ["./multiselect-autocomplete.component.scss"],
})
export class MultiselectAutocompleteComponent implements OnInit {
  @Output() result = new EventEmitter<{ key: string; data: any[] }>();
  @Input() placeholder: string = "Select Buyer";
  @Input() data1: any[] = [];
  @Input() key: string = "";

  selectControl = new FormControl();

  rawData: any = [];
  selectData: any = [];

  filteredData: any;
  filterObj: any[] = [];

  constructor() { // @Inject(MAT_DIALOG_DATA) public data: any,
    this.filteredData = this.selectControl.valueChanges.pipe(
      startWith<string>(""),
      map((value) => (typeof value === "object" ? value : this.filterObj)),
      map((filter) => this.filter(filter))
    );
  }

  ngOnInit(): void {
    this.data1.forEach((comany_name: any) => {
      this.rawData.push({ comany_name, selected: false });
    });
    console.log("Data1 from page 2: ", this.data1);

    console.log("rawData from page 2: ", this.rawData);
  }

  filter = (filter: any) => {
    this.filterObj = filter;
    if (filter.length > 0) {
      return this.rawData.filter((option: any) => {
        return option.item.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      });
    } else {
      return this.rawData.slice();
    }
  };
  displayFn = (): any => "";

  optionClicked = (event: Event, data: any): void => {
    event.stopPropagation();
    this.toggleSelection(data);
  };

  toggleSelection = (data: any): void => {
    data.selected = !data.selected;
    if (data.selected === true) {
      this.selectData.push(data);
    } else {
      const i = this.selectData.findIndex(
        (value: any) => value.item === data.item
      );
      this.selectData.splice(i, 1);
    }
    this.selectControl.setValue(this.selectData);
    this.emitAdjustedData();
  };

  emitAdjustedData = (): void => {
    const results: any[] = [];
    this.selectData.forEach((data: any) => {
      results.push(data.item);
    });
    this.result.emit({ key: this.key, data: results });
  };

  removeChip = (data: any): void => {
    this.toggleSelection(data);
  };
}
