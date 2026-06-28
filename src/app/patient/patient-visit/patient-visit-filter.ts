import { PaginatorModel } from "src/app/core/models/PaginatorModel";
import { HealthFacility } from "src/app/modules/ums/health-facility/health-facility";


export class PatientVisitFilter extends PaginatorModel {
  // User?:any[] = [JSON.parse(localStorage.getItem("user") ?? "").UserId];
  User?:any = [];
  FullName?:string;
  Cnic?:string;
  MobileNo?:string;
  MrNo?:string;
  PatientProvinceId:number = 0;
  MaxAge:number = 0;
  MinAge:number = 0;
  VisitNo:number = 0;
  Relation?:string;
}
