import { ResourceModel } from "src/app/Repository/models/resource.model";

export class PatientVisit extends ResourceModel<PatientVisit> {
  PatientOpenVisitId?:string;
  TokenNo?:string;
  FullName?:string;
  

  constructor(model?: Partial<PatientVisit>) {
    super(model);
  }
}
  