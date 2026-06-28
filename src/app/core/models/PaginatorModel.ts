import { Injectable, OnInit } from "@angular/core";
import { EncryptionService } from "src/app/_services/encryption.service";
import { LocalService } from "src/app/_services/local.service";
import { AuthService } from "../auth/auth.service";

export class DateFilter extends EncryptionService{
    StartDate: string = '';
    EndDate: string = '';
}

export class UserLevelFiltersModel extends DateFilter {
    ProvinceId: number = 0; //parseInt(JSON.parse(localStorage.getItem("user") ?? "").ProvinceId ?? "0");
    DivisionId: number = 0; // parseInt(JSON.parse(localStorage.getItem("user") ?? "").DivisionId ?? "0");
    DistrictId: number = 0; //parseInt(JSON.parse(localStorage.getItem("user") ?? "").DistrictId ?? "0");
    TehsilId: number = 0; // parseInt(JSON.parse(localStorage.getItem("user") ?? "").TehsilId ?? "0");
    HealthFacilityId: number = 0; // parseInt(JSON.parse(localStorage.getItem("user") ?? "").HealthFacilityId ?? "0");
    DepartmentId: number = 0; // parseInt(JSON.parse(localStorage.getItem("user") ?? "").DepartmentId ?? "0");
    SectionId: number = 0; // parseInt(JSON.parse(localStorage.getItem("user") ?? "").SectionId ?? "0");
    HealthFacilityTypeId: number = 0;
    HealthFacilityCode:string = "";
    DivisionCode:string = "";
    DistrictCode:string = "";
    TehsilCode:string = "";
    isPaginate:boolean=true;
    logginUser : any;
    HealthFacilityTypeCode: string = "";
    constructor(
    
    ) 
    {
        super();

        // if (!this.logginUser) {
        //     this.logginUser = JSON.parse(this.decrypt(localStorage.getItem("user")?? ""));    
        // }


        // this.ProvinceId = parseInt(this.logginUser.ProvinceId ?? "0");
        // this.DivisionId = parseInt(this.logginUser.DivisionId ?? "0");
        // this.DistrictId = parseInt(this.logginUser.DistrictId ?? "0");
        // this.TehsilId = parseInt(this.logginUser.TehsilId ?? "0");
        // this.HealthFacilityId = parseInt(this.logginUser.HealthFacilityId ?? "0");
        // this.HealthFacilityTypeId = parseInt(this.logginUser.HealthFacilityTypeId ?? "0");
        // this.DepartmentId = parseInt(this.logginUser.DepartmentId ?? "0");
        // this.SectionId = parseInt(this.logginUser.SectionId ?? "0");
        // this.HealthFacilityCode = this.logginUser.HealthFacilityCode;
            

        // Object.assign(this, new UserLevelFiltersModel ({
            // ProvinceId : parseIntJSON.parse((this.decrypt(localStorage.getItem("user")?? "").ProvinceId ?? "0"),
        // this.DivisionId = parseInt(this._localService.getValue("user").DivisionId ?? "0");
        // this.DistrictId = parseInt(this._localService.getValue("user").DistrictId ?? "0");
        // this.TehsilId = parseInt(this._localService.getValue("user").TehsilId ?? "0");
        // this.HealthFacilityId = parseInt(this._localService.getValue("user").HealthFacilityId ?? "0");
        // this.DepartmentId = parseInt(this._localService.getValue("user").DepartmentId ?? "0");
        // this.SectionId = parseInt(this._localService.getValue("user").SectionId ?? "0");
        // }));
    }

    // ngOnInit() {
    //     this.ProvinceId = parseInt(this._localService.getValue("user").ProvinceId ?? "0");
    //     this.DivisionId = parseInt(this._localService.getValue("user").DivisionId ?? "0");
    //     this.DistrictId = parseInt(this._localService.getValue("user").DistrictId ?? "0");
    //     this.TehsilId = parseInt(this._localService.getValue("user").TehsilId ?? "0");
    //     this.HealthFacilityId = parseInt(this._localService.getValue("user").HealthFacilityId ?? "0");
    //     this.DepartmentId = parseInt(this._localService.getValue("user").DepartmentId ?? "0");
    //     this.SectionId = parseInt(this._localService.getValue("user").SectionId ?? "0");
    // }
    // ProvinceId: number = parseInt(JSON.parse(localStorage.getItem("user") ?? "").ProvinceId ?? "0");
    // DivisionId: number = parseInt(JSON.parse(localStorage.getItem("user") ?? "").DivisionId ?? "0");
    // DistrictId: number = parseInt(JSON.parse(localStorage.getItem("user") ?? "").DistrictId ?? "0");
    // TehsilId: number = parseInt(JSON.parse(localStorage.getItem("user") ?? "").TehsilId ?? "0");
    // HealthFacilityId: number = parseInt(JSON.parse(localStorage.getItem("user") ?? "").HealthFacilityId ?? "0");
    // DepartmentId: number = parseInt(JSON.parse(localStorage.getItem("user") ?? "").DepartmentId ?? "0");
    // SectionId: number = parseInt(JSON.parse(localStorage.getItem("user") ?? "").SectionId ?? "0");
}

export class PaginatorModel extends UserLevelFiltersModel{

    TotalRecords: number = 0;
    PageNumber: number = 1;
    PageSize: number = 10;
    SearchString?:any;
}

