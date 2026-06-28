import { ResourceModel } from "src/app/Repository/models/resource.model";

export class HfLabTestConfig extends ResourceModel<HfLabTestConfig> {
    HFLabTestConfigId?: string;
    HealthFacilityId?: string;
    LabTestId?: string;
    IsPerformedPrivately?: string;
    LabDepartmentProfileId?: string;
    IsActive?: boolean;
    

  constructor(model?: Partial<HfLabTestConfig>) {
    super(model);
  }
}