import { ResourceModel } from "src/app/Repository/models/resource.model";

export class Menu extends ResourceModel<Menu> {
    MenuId?: string;
    ModuleId?: string;
    Name?: string;
    DisplayName?: string;
    Url?: string;
    Icon?: string;
    ParentId?: string;
    IsApi?: boolean;
    IsLabel?: boolean;
    IsModule?: boolean;
    IsDisplayMenu?: boolean;
    IsActive?: boolean;
    ImageUrl?: string;

  constructor(model?: Partial<Menu>) {
    super(model);
  }
}
