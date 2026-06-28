import { ResourceModel } from "src/app/Repository/models/resource.model";

export class Section extends ResourceModel<Section> {
    SectionLookupId?: string;
    Name?: string;
    DisplayName?: string;
    DepartmentLookupId?: string;
    IsActive?: boolean;
    Description?: string;
    DepartmentName?: string;
    FormType?: string;
    IsConsultant?: boolean;
    IsFilterClinic?: boolean;
    ConsultantSectionLookupId?: string;

  constructor(model?: Partial<Section>) {
    super(model);
  }
}