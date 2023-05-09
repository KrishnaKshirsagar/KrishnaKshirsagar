import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SidenavService {
  public sideNavState$: Subject<boolean> = new Subject();

  BaseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getCompanyByCompanyid(companyid: string) {
    return this.http.get(this.BaseUrl + `entity/entity/${companyid}`);
  }
}
