import { ResourceModel } from "src/app/Repository/models/resource.model";
import { Role } from "../role/role";
// import { symbolTriangle } from "d3";



export class User extends ResourceModel<User> {
  UserId?: string;
  Dob?: Date;
  ProvinceId?: number;
  Username?: string;
  FullName?: string;
  FatherName?: string;
  Email?: string;
  GenderProfileId?: string;
  DivisionId?: number;
  DistrictId?: number;
  TehsilId?: number;
  UcId?: string;
  Password?: string;
  ContactNo?: string;
  ProfilePic?: string;
  Cnic?: string;
  IsActive?: boolean;
  DesignationProfileId?: string;
  UserTypeProfileId?: string;
  UserRoles?: UserRole[];
  HrId?: number;
  HealthFacilityId?: number;

  constructor(model?: Partial<User>) {
    super(model);
  }
}

export class UserRole extends ResourceModel<UserRole> {
  MenuId?: string;
  RoleId?: string;
  UserId?: string;
  UserRoleId?: boolean;
  IsActive?: boolean;


  constructor(model?: Partial<UserRole>) {
    super(model);
  }
}



export class AssignableUserRole extends ResourceModel<AssignableUserRole> {
  UserId?: string;
  UserAssignableRoles?: UserRole[];
}