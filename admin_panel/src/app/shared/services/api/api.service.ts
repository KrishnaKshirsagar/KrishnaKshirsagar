import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyRoleRes } from '../../interfaces/results/companyRole.interface';
import { DashboardRoleRes } from '../../interfaces/results/dashboardRole.interface';
import { GlobalRoleRes } from '../../interfaces/results/globalRole.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getGlobalRoles() {
    return this.http.get<GlobalRoleRes[]>('/globalRole');
  }

  getCompanyRoles() {
    return this.http.get<CompanyRoleRes[]>('/companyRole');
  }

  getDashboardRoles() {
    return this.http.get<DashboardRoleRes[]>('/dashboardRole');
  }
}
