import { ResourceModel } from "src/app/Repository/models/resource.model";

export class Role extends ResourceModel<Role> {
    RoleId?: string;
    Name?: string;
    ShortName?: string;
    IsActive?: boolean;
    RoleMenus?:RoleMenu[]

  constructor(model?: Partial<Role>) {
    super(model);
  }
}

export class RoleMenu extends ResourceModel<RoleMenu> {
    Name?: string;
    RoleMenuId?: string;
    MenuId?: string;
    RoleId?: string;
    CanRead?: boolean;
    CanWrite?: boolean;
    CanEdit?: boolean;
    CanDelete?: boolean;
    ChildMenu?:RoleMenu[];
    HasAccess?: boolean;
    IsOpened?: boolean;
    
  constructor(model?: Partial<RoleMenu>) {
    super(model);
  }
}