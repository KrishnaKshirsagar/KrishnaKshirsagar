import { CompanyRes } from "./company.interface";

export interface DashboardResFull {
  id: string;
  name: string;
  company: CompanyRes;
  active: boolean;
}
