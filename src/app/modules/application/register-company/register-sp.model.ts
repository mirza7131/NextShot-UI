export class SpServiceDto {

    serviceTypeId?: string | null;
   
  
    constructor(init?: Partial<SpServiceDto>) {
      Object.assign(this, init);
    }
  }
  
  export class RegisterSPDTO {
    id: string;
    stakeHolderTypeId?: string | null;
    name?: string | null;
    logo?: string | null;
    banner?: string | null;
    ownerName?: string | null;
    owneCnic?: string | null;
    ownerMob?: string | null;
    divisionCde?: string | null;
    districtCode?: string | null;
    address?: string | null;

    spServices: SpServiceDto[] = [];
  
    constructor(init?: Partial<RegisterSPDTO>) {
      Object.assign(this, init);
    }
  }