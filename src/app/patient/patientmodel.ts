import { ResourceModel } from "src/app/Repository/models/resource.model";

export class Patient extends ResourceModel<Patient> {
        PatientId?:string;
        Mrno?: string;
        FirstName?: string;
        LastName?:string;
        FullName?: string;
        GuardianName?: string;
        Cnic?:string;
        Age?: Number;
        Dob?: string;
        NationalityProfileId?: string;
        PassportNo?: string;
        MotherLandProfileId?: string;
        CasteProfileId?:string
        GenderProfileId?:string;
        BloodGroupProfileId?: string;
        MobileNo?:string;
        Emai?: string;
        Ntn?: string;
        ProvinceId?: Number;
        DivisionId?: Number;
        DistrictId?: Number;
        TehsilId?: Number;
        UnionCouncilId?: Number;
        Hfmiscode?: string;
        ParmanentAddress?: string;
        TemporaryAddress?: string;
        ReligionProfileId?: string;
        MaritialStatusProfileId?: string;
        Domicile?: string;
        IsActive?: boolean;


  constructor(model?: Partial<Patient>) {
    super(model);
  }
}
  