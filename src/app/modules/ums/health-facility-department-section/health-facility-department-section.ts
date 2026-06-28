import { ResourceModel } from "src/app/Repository/models/resource.model";

export class HealthFacilityDepartmentSection extends ResourceModel<HealthFacilityDepartmentSection> {
    HfDepartmentSectionId?: number;
    DepartmentId?: number;
    HfDepartmentId?: number;
    HealthFacilityId?:number;
    DepartmentName?: string;
    SectionId?: number;
    SectionName?: string;
    IsActive?: boolean;
    HealthFacilityName?: string;

  constructor(model?: Partial<HealthFacilityDepartmentSection>) {
    super(model);
  }
  
}
