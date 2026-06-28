import { ResourceModel } from "src/app/Repository/models/resource.model";

export class HealthFacility extends ResourceModel<HealthFacility> {
    HealthFacilityId?: number;
    Name?: string;
    Code?: string;
    IsActive?: boolean;

  constructor(model?: Partial<HealthFacility>) {
    super(model);
  }
}