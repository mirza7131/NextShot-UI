import { ResourceModel } from "src/app/Repository/models/resource.model";

export class HealthFacilityDepartment extends ResourceModel<HealthFacilityDepartment> {
    HfDepartmentId?: number;
    HealthFacilityId?: number;
    DepartmentLookupId?: number;
    SectionIds?: number[];
    IsActive?: boolean;
    DepartmentName?: string;
    HealthFacilityName?: string;

  constructor(model?: Partial<HealthFacilityDepartment>) {
    super(model);
  }
}