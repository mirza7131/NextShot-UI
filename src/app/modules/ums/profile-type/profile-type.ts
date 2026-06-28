import { ResourceModel } from "src/app/Repository/models/resource.model";

export class ProfileType extends ResourceModel<ProfileType> {
    ProfileTypeId?: string;
    Name?: string;
    ShortName?: string;
    IsActive?: boolean;

  constructor(model?: Partial<ProfileType>) {
    super(model);
  }
}