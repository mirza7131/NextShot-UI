import { ResourceModel } from "src/app/Repository/models/resource.model";

export class UserComplianceCoverage extends ResourceModel<UserComplianceCoverage> {
    UserId?:string;
    FullName?: string;
    Username?: string;
    DistrictName?:string;
    ZoneName?: string;
    DaysWorked?: Number;
    Compliance?: Number;
    Coverage?: Number;
      

  constructor(model?: Partial<UserComplianceCoverage>) {
    super(model);
  }
}