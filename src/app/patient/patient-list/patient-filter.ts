import { PaginatorModel } from "src/app/core/models/PaginatorModel";

export class PatientFilter extends PaginatorModel{
  User?:any[] = [];
  FullName?:string;
  Cnic?:string;
  MobileNo?:string;
  MrNo?:string;
}