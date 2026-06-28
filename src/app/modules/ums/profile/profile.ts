import { ResourceModel } from "src/app/Repository/models/resource.model";

export class Profile extends ResourceModel<Profile> {
    ProfileId?: string;
    Name?: string;
    ShortName?: string;
    ProfileTypeId?: string;
    IsActive?: boolean;
    ProfileTypeName?: string;

  constructor(model?: Partial<Profile>) {
    super(model);
  }
}