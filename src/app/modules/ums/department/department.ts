import { ResourceModel } from "src/app/Repository/models/resource.model";

export class Department extends ResourceModel<Department> {
   
    DepartmentLookupId?: number;
    Name?: string;
    DisplayName?: string;
    Description?: string; 
    IsActive?: boolean;

  constructor(model?: Partial<Department>) {
    super(model);
  }
}