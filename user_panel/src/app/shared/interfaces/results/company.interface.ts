import { Location } from "src/app/shared/interfaces/entities/location.interface";

export interface CompanyRes {
  companyid: string;
  gst_no: string;
  dealer_name: string;
  company_name: string;
  address1: string;
  district: string;
  state: string;
  pincode: string;
  pan: string;
  cin: string;
  tan: string;
  typeOf_business: string;
  annual_turnover: string;
  company_mobile: string;
  company_email: string;

  active: boolean;
}
