import { ResourceModel } from "src/app/Repository/models/resource.model";

export class HealthFacilityStation extends ResourceModel<HealthFacilityStation> {
    HealthFacilityStationId?: string;
    
    StationProfileId?: string;
    StationProfileName?: string;
    
    HealthFacilityId?: number;
    HealthFacilityName?: string;
    
    SequenceNo?: number;
    IsActive?: boolean;

  constructor(model?: Partial<HealthFacilityStation>) {
    super(model);
  }
}