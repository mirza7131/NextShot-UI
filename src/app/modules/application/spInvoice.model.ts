export class SpInvoice {
    invoiceId?: number;
    invoiceNumber?: string;
    spId?: string;
    hfId?: number;
    serviceTypeId?: string;
    month?: string;
    dueDate?: Date;
    isActive?: boolean;
    issuedBy?: string;
    issuedOn?: Date;
    isReIssued?: boolean;
    reIssuedBy?: string;
    reIssuedOn?: Date;
  }
  export class EmployeeListForInvoice{
    hfId?: number;
  //  spId?: string;
    serviceTypeId?: string;
  }
  export class SaveEmployeeDTO
  {
      HfSpEmployeeId?: string;
      SpId? :string;
      ServiceTypeId? :string;
      HfId? :number;
      Name? :string;
      DesignationId? :string;
      EmploymentTypeId? :number;
      ShiftId? :number;
      EmployeeId?:string;
      ReplacementOf?:string;
      IsActive? :boolean;
      CreatedBy? :string;
      CreatedOn? :Date;
      UpdatedBy? :Date;
      UpdatedOn?:Date;
  }
  export class InsertComments{
    invoiceNumber?: string;
    comment?: string;
  }