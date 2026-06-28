import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserLevelFilterWidgetService } from 'src/app/common/common-widgets/user-level-filter-widget/user-level-filter-widget.service';
import { UserLevelConstant } from 'src/app/core/constants/user-level.constant';
import { EndPointConstant } from 'src/app/core/constants/endpoint.constants';
import { PatientVisitFilter } from 'src/app/patient/patient-visit/patient-visit-filter';
import { EventEmitterService } from '../../commonservices/event-emitter.service';
import { BehaviorSubject } from 'rxjs';

import { RoleConstant } from 'src/app/core/constants/Role.constant';
import { LocalService } from 'src/app/_services/local.service';
import { CommonService } from 'src/app/_services/common.service';
import { departments } from 'src/app/core/constants/department.constants';
import { SectionConstant } from 'src/app/core/constants/section.constants';


@Component({
  selector: 'app-user-level-dashboard-filters',
  templateUrl: './user-level-dashboard-filters.component.html',
  styleUrls: ['./user-level-dashboard-filters.component.scss']
})
export class UserLevelDashboardFiltersComponent implements OnInit {

  @Input() userLevelFiltersModel: any = new PatientVisitFilter(); // if Model
  @Input() userLevelFormGroup: any;  // if Formgroup
  @Input() IsDateFilter: boolean = true; // show/hide date filter Component
  @Input() IsUserFilter: boolean = false; // show/hide date filter Component
  @Input() UserRoleConst: any = '';  // if Formgroup

  @Input() IsCnicFilter: boolean = false; // show/hide date filter Component
  @Input() IsMobileNoFilter: boolean = false; // show/hide date filter Component
  @Input() IsMrnoFilter: boolean = false; // show/hide date filter Component

  //IsDashboardHmisList
  @Input() IsHmisEnabled: boolean = false; // show/hide date filter Component

  @Input() IsDepartment: boolean = false; // show/hide department Block
  @Input() IsSection: boolean = false; // show/hide Section Block
  @Input() IsUserLevel?: boolean = true; // check if Filter is User Level or Patient Level, true for User Level
  @Output() HealthFacilityId = new EventEmitter<any>();
  @Output() isSaved = new EventEmitter<any>();


  roleConstant: RoleConstant = new RoleConstant();
  isSuperAdmin: boolean = false;
  loginUser: any = {};
  roleName:any
  public hfmisCode: string;
  public hfStatus: string;
  public hfmisCodeParam: string;
  public hfTypeCodes: any[] = [];
  public hfCategoryCodes: any[] = [];
  public hfACs: any[] = [];
  bindValue = '[readonly]="true"';
  userLevelConstant: UserLevelConstant = new UserLevelConstant();

  public allLocations?: any = [];
  public provinceData: any[] = [];
  public divisionData: any[] = [];
  public districtData: any[] = [];
  public tehsilData: any[] = [];
  public healthFacilityData: any[] = [];
  public healthFacilityTypeData: any[] = [];
  public DropDowndivisionData: any[] = [];
  public DropDowndistrictData: any[] = [];
  public DropDowntehsilData: any[] = [];
  public DropDownhealthFacilityData: any[] = [];
  public DropDownhealthFacilityTypeData: any[] = [];
  public departmentData: any[] = [];
  public sectionData: any[] = [];
  public healthFacilityPlaceHolder = "Select a Health Facility"
  public healthFacilityTypePlaceHolder = "Select Health Facility Type"
  public tehsilPlaceHolder = "Select Tehsil"
  public districtPlaceHolder = "Select District"
  public divisionPlaceHolder = "Select Division"
  public provicePlaceHolder = "Select Province"

  public HfId: any = 0;

  public isProvinceLevel: boolean = false;
  public isDivisionLevel: boolean = false;
  public isDistrictLevel: boolean = false;
  public isTehsilLevel: boolean = false;
  public isHealthFacilityLevel: boolean = false;

  //public isFilterFromHf: boolean = false;

  constructor(

    private _authService: AuthService,
    private _localService: LocalService,
    private _commonService: CommonService
    // private eventEmitterService: EventEmitterService

  ) {

  }

  ngOnInit(): void {
    this.userLevelFiltersModel.DistrictId = ''
    this.userLevelFiltersModel.DivisionId = ''
    this.userLevelFiltersModel.TehsilId = ''
    this.userLevelFiltersModel.HealthFacilityTypeId = ''
    this.userLevelFiltersModel.HealthFacilityId = ''
    //console.log('console User Level filter',this.userLevelFiltersModel);
    
    //console.log('IsHmisListIsHmisList',this.IsHmisEnabled)
    this.isSuperAdmin = this._authService.isSuperAdmin();
    this.loginUser = this._authService.user;
    this.roleName =  this.loginUser.UserRoleList[0].ShortName
    this.SetDropDownValues();
    this.isProvinceLevel = true
    // this.getAllLocations();
    // // this.setAllDropdowns();
    // console.log(this.userLevelFormGroup);
  }

  ngOnChanges(changes: SimpleChanges): void{
       this.SetDropDownValues();
  }
  // firstComponentFunction(){
  //
  //   this.eventEmitterService.onFirstComponentButtonClick();
  // }


  setLocations() {
    if (this.loginUser.UserLevel == this.userLevelConstant.SuperUserLevel) {
      this.isProvinceLevel = true;
      this.provinceData = this.allLocations?.ProvinceDropdown.filter((item: any) => item.Id === this.loginUser.ProvinceId);
      this.getDivisions(this.loginUser.ProvinceId);
      this.setControls();
    }
    else if (this.loginUser.UserLevel == this.userLevelConstant.NationalLevel) {
      this.isProvinceLevel = true;
      this.provinceData = this.allLocations?.ProvinceDropdown.filter((item: any) => item.Id === this.loginUser.ProvinceId);
      this.getDivisions(this.loginUser.ProvinceId);
      this.setControls();
    }
    else if (this.loginUser.UserLevel == this.userLevelConstant.ProvincialLevel) {
      this.isProvinceLevel = true;
      this.provinceData = this.allLocations?.ProvinceDropdown.filter((item: any) => item.Id === this.loginUser.ProvinceId);
      this.getDivisions(this.loginUser.ProvinceId);

      this.setControls();

    }
    else if (this.loginUser.UserLevel == this.userLevelConstant.DivisionalLevel) {
      this.isProvinceLevel = true;
      this.isDivisionLevel = true;
      this.provinceData = this.allLocations?.ProvinceDropdown.filter((item: any) => item.Id === this.loginUser.ProvinceId);
      this.divisionData = this.allLocations?.DivisionDropdown.filter((item: any) => item.Id === this.loginUser.DivisionId);
      this.getDistricts(this.loginUser.DivisionId);

      this.setControls();
    }
    else if (this.loginUser.UserLevel == this.userLevelConstant.DistrictLevel) {
      this.isProvinceLevel = true;
      this.isDivisionLevel = true;
      this.isDistrictLevel = true;
      this.provinceData = this.allLocations?.ProvinceDropdown.filter((item: any) => item.Id === this.loginUser.ProvinceId);
      this.divisionData = this.allLocations?.DivisionDropdown.filter((item: any) => item.Id === this.loginUser.DivisionId);
      this.districtData = this.allLocations?.DistrictDropdown.filter((item: any) => item.Id === this.loginUser.DistrictId);
      this.getTehsil(this.loginUser.DistrictId);
      this.setControls();
    }
    else if (this.loginUser.UserLevel == this.userLevelConstant.TehsilLevel) {
      this.isProvinceLevel = true;
      this.isDivisionLevel = true;
      this.isDistrictLevel = true;
      this.isTehsilLevel = true;
      this.provinceData = this.allLocations?.ProvinceDropdown.filter((item: any) => item.Id === this.loginUser.ProvinceId);
      this.divisionData = this.allLocations?.DivisionDropdown.filter((item: any) => item.Id === this.loginUser.DivisionId);
      this.districtData = this.allLocations?.DistrictDropdown.filter((item: any) => item.Id === this.loginUser.DistrictId);
      this.tehsilData = this.allLocations?.TehsilDropdown.filter((item: any) => item.Id === this.loginUser.TehsilId);
      this.getHealthFacility(this.loginUser.TehsilId);
      this.setControls();
    }
    else if (this.loginUser.UserLevel == this.userLevelConstant.HealthFacilityLevel) {
      this.isProvinceLevel = true;
      this.isDivisionLevel = true;
      this.isDistrictLevel = true;
      this.isTehsilLevel = true;
      this.isHealthFacilityLevel = true;
      this.provinceData = this.allLocations?.ProvinceDropdown.filter((item: any) => item.Id === this.loginUser.ProvinceId);
      this.divisionData = this.allLocations?.DivisionDropdown.filter((item: any) => item.Id === this.loginUser.DivisionId);
      this.districtData = this.allLocations?.DistrictDropdown.filter((item: any) => item.Id === this.loginUser.DistrictId);
      this.tehsilData = this.allLocations?.TehsilDropdown.filter((item: any) => item.Id === this.loginUser.TehsilId);
      this.healthFacilityData = this.allLocations?.HealthFacilityDropdown.filter((item: any) => item.Id === this.loginUser.HealthFacilityId);
      this.getHealthFacilityDepartments(this.loginUser.HealthFacilityId);
      this.setControls();

    }
  }

  setControls() {
    if (typeof this.userLevelFormGroup !== 'undefined' && this.userLevelFormGroup.controls["ProvinceId"].value)
      this.getDivisions(this.userLevelFormGroup.controls["ProvinceId"].value);

    if (typeof this.userLevelFormGroup !== 'undefined' && this.userLevelFormGroup.controls["DivisionId"].value)
      this.getDistricts(this.userLevelFormGroup.controls["DivisionId"].value);

    if (typeof this.userLevelFormGroup !== 'undefined' && this.userLevelFormGroup.controls["DistrictId"].value)
      this.getTehsil(this.userLevelFormGroup.controls["DistrictId"].value);

    if (typeof this.userLevelFormGroup !== 'undefined' && this.userLevelFormGroup.controls["TehsilId"].value)
      this.getHealthFacility(this.userLevelFormGroup.controls["TehsilId"].value);

    if (typeof this.userLevelFormGroup !== 'undefined' && this.userLevelFormGroup.controls["HealthFacilityId"].value)
      this.getHealthFacilityDepartments(this.userLevelFormGroup.controls["HealthFacilityId"].value);

    if (typeof this.userLevelFormGroup !== 'undefined' && this.userLevelFormGroup.controls["DepartmentId"].value)
      this.getHealthFacilitySections(this.userLevelFormGroup.controls["DepartmentId"].value);
  }

  getAllLocations() {

    if (!this._localService.getValue('alllocations')) {
      this._commonService.getAllLocations().subscribe((data: any) => {
        this._localService.setValue('alllocations', data);
        this.allLocations = data;
        this.provinceData = data.ProvinceDropdown;
        if(this.userLevelFiltersModel.isFilterFromHf){
          if(this.IsHmisEnabled){
            this.healthFacilityData = data.HealthFacilityDropdown.filter((x:any)=>x.IsRunningHMIS == true);
          }else{
            this.healthFacilityData = data.HealthFacilityDropdown
          }
        }
        this.setLocations();
      });
    }
    else {

      this.allLocations = this._localService.getValue('alllocations');
      this.provinceData = this.allLocations.ProvinceDropdown;
      if(this.userLevelFiltersModel.isFilterFromHf){
        if(this.IsHmisEnabled){
          this.healthFacilityData = this.allLocations.HealthFacilityDropdown.filter((x:any)=>x.IsRunningHMIS == true);
        }else{
          this.healthFacilityData = this.allLocations.HealthFacilityDropdown;
        }
        //this.healthFacilityData = this.allLocations.HealthFacilityDropdown;
      }
      this.setLocations();
    }
  }

  getDivisions(provinceId?: number) {
    if (this.userLevelFormGroup) {
      provinceId = this.userLevelFormGroup.controls['ProvinceId'].value;
      this.getDistricts();
    }

    this.userLevelFiltersModel.DivisionId = null;
    this.userLevelFiltersModel.HealthFacilityId = null;
    this.districtData = [];
    this.tehsilData = [];
    if(!this.userLevelFiltersModel.isFilterFromHf)
      this.healthFacilityData = [];

    this.departmentData = [];
    this.sectionData = [];

    if(provinceId)
      this.divisionData = this.allLocations?.DivisionDropdown.filter((item: any) => item.ParentId === provinceId);
    else
      this.divisionData = this.allLocations?.DivisionDropdown;
  }

  getDistricts(divisionId?: number) {
    if (this.userLevelFormGroup) {
      divisionId = this.userLevelFormGroup.controls['DivisionId'].value;
      this.getTehsil();
    }

    this.userLevelFiltersModel.DistrictId = null;
    this.tehsilData = [];
    if(!this.userLevelFiltersModel.isFilterFromHf)
      this.healthFacilityData = [];
    this.departmentData = [];
    this.sectionData = [];

    this.districtData = this.allLocations?.DistrictDropdown.filter((item: any) => item.ParentId === divisionId);

    let selectedDivision = this.allLocations?.DivisionDropdown.filter((item: any) => item.Id === divisionId);
    this.userLevelFiltersModel.DivisionCode = selectedDivision.length > 0 ? selectedDivision[0].Code : null;

  }

  getTehsil(districtId?: number) {
    if (this.userLevelFormGroup) {
      districtId = this.userLevelFormGroup.controls['DistrictId'].value;
      this.getHealthFacility();
    }

    this.userLevelFiltersModel.HealthFacilityId = null;
    this.userLevelFiltersModel.TehsilId = null;
    if(!this.userLevelFiltersModel.isFilterFromHf)
      this.healthFacilityData = [];

    this.departmentData = [];
    this.sectionData = [];

    this.tehsilData = this.allLocations?.TehsilDropdown.filter((item: any) => item.ParentId === districtId);

    let selectedDistrict = this.allLocations?.DistrictDropdown.filter((item: any) => item.Id === districtId);
    this.userLevelFiltersModel.DistrictCode = selectedDistrict.length > 0 ? selectedDistrict[0].Code : null;
  }

  getHealthFacility(tehsilId?: number) {

    if (this.userLevelFormGroup)
      tehsilId = this.userLevelFormGroup.controls['TehsilId'].value;

    this.userLevelFiltersModel.HealthFacilityId = null;
    this.departmentData = [];
    this.sectionData = [];
    if(this.IsHmisEnabled){
      this.healthFacilityData = this.allLocations?.HealthFacilityDropdown.filter((item: any) => item.ParentId === tehsilId && item.IsRunningHMIS == true);
    }else{
      this.healthFacilityData = this.allLocations?.HealthFacilityDropdown.filter((item: any) => item.ParentId === tehsilId);
    }

    let selectedTehsil = this.allLocations?.TehsilDropdown.filter((item: any) => item.Id === tehsilId);
    this.userLevelFiltersModel.TehsilCode = selectedTehsil.length > 0 ? selectedTehsil[0].Code : null;
  }



  setAllDropdowns() {

    // // get tehsil
    // let healthfacilityId = this.userLevelFiltersModel.HealthFacilityId;
    // let healthfacilty = this.allLocations?.HealthFacilityDropdown.filter((item: any) => item.Id === healthfacilityId);
    // this.tehsilData = this.allLocations?.TehsilDropdown.filter((item: any) => item.Id === healthfacilty[0]?.ParentId);
    // if (this.tehsilData) {
    //   this.tehsilPlaceHolder = "";
    // }
    // // get district

    let healthfacilityId = this.userLevelFiltersModel.HealthFacilityId;

    if(this.userLevelFiltersModel.isFilterFromHf)
    {
      this.userLevelFiltersModel.TehsilId = null;
      this.userLevelFiltersModel.DistrictId = null;
      this.userLevelFiltersModel.DivisionId = null;

      // get tehsil
      let healthfacilty = this.allLocations?.HealthFacilityDropdown.find((item: any) => item.Id === healthfacilityId);

      if(!this.userLevelFiltersModel.TehsilId)
        this.tehsilData = this.allLocations?.TehsilDropdown.filter((item: any) => item.Id === healthfacilty?.ParentId);
        // this.userLevelFiltersModel.TehsilId = this.tehsilData[0].Id;

      // get district
      let tehsilId = this.tehsilData[0]?.Id;
      let tehsil = this.allLocations?.TehsilDropdown.filter((item: any) => item.Id === tehsilId);
      this.districtData = this.allLocations?.DistrictDropdown.filter((item: any) => item.Id === tehsil[0]?.ParentId);


      // get division
      let districtId = this.districtData[0]?.Id;
      let districts = this.allLocations?.DistrictDropdown.filter((item: any) => item.Id === districtId);
      this.divisionData = this.allLocations?.DivisionDropdown.filter((item: any) => item.Id === districts[0]?.ParentId);

      // get province
      let divisonId = this.divisionData[0]?.Id;
      let divisions = this.allLocations?.DivisionDropdown.filter((item: any) => item.Id == divisonId);
      this.provinceData = this.allLocations?.ProvinceDropdown.filter((item: any) => item.Id === divisions[0]?.ParentId);

      //assign in Model
      setTimeout(() => {

        if(!this.IsNullorUndefined(tehsilId))
          this.userLevelFiltersModel.TehsilId = tehsilId;

        if(!this.IsNullorUndefined(districtId))
          this.userLevelFiltersModel.DistrictId = districtId;

        if(!this.IsNullorUndefined(divisonId))
          this.userLevelFiltersModel.DivisionId = divisonId;

      }, 10);
    }
  }

  getHealthFacilityDepartments(healthFacilityId?: any) {


    // this.setAllDropdowns();
    if (this.userLevelFormGroup)
      healthFacilityId = this.userLevelFormGroup.controls['HealthFacilityId'].value;

    this.departmentData = [];
    this.sectionData = [];

    this.departmentData = this.allLocations?.HfDepartmentDropdown.filter((item: any) => item.ParentId === healthFacilityId);

    let selectedHealthFacility = this.allLocations?.HealthFacilityDropdown.filter((item: any) => item.Id === healthFacilityId);
    this.userLevelFiltersModel.HealthFacilityCode = selectedHealthFacility.length > 0 ? selectedHealthFacility[0].Code : null;




    if (this.loginUser.UserRoleList[0].Name == this.roleConstant.SscUserCreation) {
      this.departmentData = this.departmentData.filter((x) => x.Name == departments.opd);
    }
  }

  getHealthFacilitySections(lookupId?: any) {
    let Id = 0;
    if (typeof lookupId === 'object' && lookupId !== null)
      Id = lookupId.value;
    else
      Id = lookupId;

    if (this.userLevelFormGroup)
      Id = this.userLevelFormGroup.controls['DepartmentId'].value;

    if (Id) {
      let department = this.departmentData.find(x => x.LookupId == Id)
      Id = department.Id;
    }

    this.sectionData = [];
    this.sectionData = this.allLocations?.HfDepartmentSectionDropdown.filter((item: any) => item.ParentId === Id);




    if (this.loginUser.UserRoleList[0].Name == this.roleConstant.SscUserCreation) {
      this.sectionData = this.sectionData.filter((x) => x.Name == SectionConstant.psychiatryOPD);
    }
  }


  checkIfHealthFacilityFilter(event:any){

    this.getAllLocations();
    if(this.userLevelFiltersModel.isFilterFromHf)
      this.setAllDropdowns();

  }

  // setHfId(HealthFacilityId :any) {
  //   this.HealthFacilityId.emit(HealthFacilityId);
  //
  // }



  // getUnionCouncil(tehsilId?: any) {
  //   if (!tehsilId)
  //       tehsilId = this.patientform.controls['TehsilId'].value || 0;
  //   this.ucData = this.allLocations?.UCDropdown.filter((item: any) => item.ParentId === tehsilId);
  // }


  IsNullorUndefined(val?: any) {
    return (val === undefined || val == null || val.length <= 0 || val.length == '') ? true : false;
  }

  SetDropDownValues(){
     debugger
    this.loginUser.UserLevel
    this._commonService.GetAllLocationsFilters().subscribe((data: any) => {
      // console.log('AllFilterData',data)
      // console.log('this.loginUser',this.loginUser)
      // console.log('this.loginUser.roleName',this.roleName)
      if(this.loginUser.ProvinceId  == null){
        this.loginUser.ProvinceId = 1
      }
      if (this.loginUser.UserLevel == this.userLevelConstant.ProvincialLevel && this.roleName=='DSBORD') {
        this.isProvinceLevel = true;
        this.provinceData = data?.ProvinceDropdown.filter((item: any) => item.Id === this.loginUser.ProvinceId);
        this.DropDowndivisionData = data?.DivisionDropdown.filter((item: any) => item.ParentId === this.loginUser.ProvinceId);
        this.DropDowndistrictData = data?.DistrictDropdown.filter((item: any) => this.DropDowndivisionData.some((division) => division.Id === item.ParentId));
        this.DropDowntehsilData = data?.TehsilDropdown.filter((item: any) => this.DropDowndistrictData.some((district) => district.Id === item.ParentId));
        this.DropDownhealthFacilityData = data?.HealthFacilityDropdown.filter((item: any) => this.DropDowntehsilData.some((tehsil) => tehsil.Id === item.ParentId) && item.IsRunningHMIS == true);
        this.DropDownhealthFacilityTypeData = data?.HealthFacilityTypeDropdown.filter((item: any) => this.DropDownhealthFacilityData.some((Hf) => Hf.HfTypeCode === item.HfTypeCode))
        // let validHfTypeCodes = new Set(
        //   this.DropDownhealthFacilityData.map((item:any) => item.HfTypeCode)
        // );
        // let healthFacilityTypes = data?.HealthFacilityTypeDropdown.filter((item:any) =>
        //   validHfTypeCodes.has(item.HfTypeCode)
        // );
        // this.DropDownhealthFacilityTypeData = healthFacilityTypes
        this.userLevelFiltersModel.ProvinceId = this.provinceData[0]?.Id

        this.divisionData = this.DropDowndivisionData
        this.districtData = this.DropDowndistrictData;
        this.tehsilData = this.DropDowntehsilData;
        this.healthFacilityTypeData = this.DropDownhealthFacilityTypeData
        this.healthFacilityData = this.DropDownhealthFacilityData;
        //this.getDivisions(this.loginUser.ProvinceId);
        //this.setControls();
      }
      else if (this.loginUser.UserLevel == this.userLevelConstant.SuperUserLevel) {
        this.isProvinceLevel = true;
        this.provinceData = data?.ProvinceDropdown.filter((item: any) => item.Id === this.loginUser.ProvinceId);
        this.DropDowndivisionData = data?.DivisionDropdown.filter((item: any) => item.ParentId === this.loginUser.ProvinceId);
        this.DropDowndistrictData = data?.DistrictDropdown.filter((item: any) => this.DropDowndivisionData.some((division) => division.Id === item.ParentId));
        this.DropDowntehsilData = data?.TehsilDropdown.filter((item: any) => this.DropDowndistrictData.some((district) => district.Id === item.ParentId));
        this.DropDownhealthFacilityData = data?.HealthFacilityDropdown.filter((item: any) => this.DropDowntehsilData.some((tehsil) => tehsil.Id === item.ParentId));
        this.DropDownhealthFacilityTypeData = data?.HealthFacilityTypeDropdown.filter((item: any) => this.DropDownhealthFacilityData.some((Hf) => Hf.HfTypeCode === item.HfTypeCode))
        // let validHfTypeCodes = new Set(
        //   this.DropDownhealthFacilityData.map((item:any) => item.HfTypeCode)
        // );
        // let healthFacilityTypes = data?.HealthFacilityTypeDropdown.filter((item:any) =>
        //   validHfTypeCodes.has(item.HfTypeCode)
        // );
        // this.DropDownhealthFacilityTypeData = healthFacilityTypes
        this.userLevelFiltersModel.ProvinceId = this.provinceData[0]?.Id

        this.divisionData = this.DropDowndivisionData
        this.districtData = this.DropDowndistrictData;
        this.tehsilData = this.DropDowntehsilData;
        this.healthFacilityTypeData = this.DropDownhealthFacilityTypeData
        this.healthFacilityData = this.DropDownhealthFacilityData;
        //this.getDivisions(this.loginUser.ProvinceId);
        //this.setControls();
      }
      else if (this.loginUser.UserLevel == this.userLevelConstant.NationalLevel) {
        this.isProvinceLevel = true;
        this.provinceData = data?.ProvinceDropdown.filter((item: any) => item.Id === this.loginUser.ProvinceId);
        this.DropDowndivisionData = data?.DivisionDropdown.filter((item: any) => item.ParentId === this.loginUser.ProvinceId);
        this.DropDowndistrictData = data?.DistrictDropdown.filter((item: any) => this.DropDowndivisionData.some((division) => division.Id === item.ParentId));
        this.DropDowntehsilData = data?.TehsilDropdown.filter((item: any) => this.DropDowndistrictData.some((district) => district.Id === item.ParentId));
        this.DropDownhealthFacilityData = data?.HealthFacilityDropdown.filter((item: any) => this.DropDowntehsilData.some((tehsil) => tehsil.Id === item.ParentId));
        this.DropDownhealthFacilityTypeData = data?.HealthFacilityTypeDropdown.filter((item: any) => this.DropDownhealthFacilityData.some((Hf) => Hf.HfTypeCode === item.HfTypeCode))

        this.userLevelFiltersModel.ProvinceId = this.provinceData[0]?.Id
        
        this.divisionData = this.DropDowndivisionData
        this.districtData = this.DropDowndistrictData;
        this.tehsilData = this.DropDowntehsilData;
        this.healthFacilityTypeData = this.DropDownhealthFacilityTypeData
        this.healthFacilityData = this.DropDownhealthFacilityData;
      }
      else if (this.loginUser.UserLevel == this.userLevelConstant.ProvincialLevel) {
        this.isProvinceLevel = true;
        this.provinceData = data?.ProvinceDropdown.filter((item: any) => item.Id === this.loginUser.ProvinceId);
        this.DropDowndivisionData = data?.DivisionDropdown.filter((item: any) => item.ParentId === this.loginUser.ProvinceId);
        this.DropDowndistrictData = data?.DistrictDropdown.filter((item: any) => this.DropDowndivisionData.some((division) => division.Id === item.ParentId));
        this.DropDowntehsilData = data?.TehsilDropdown.filter((item: any) => this.DropDowndistrictData.some((district) => district.Id === item.ParentId));
        this.DropDownhealthFacilityData = data?.HealthFacilityDropdown.filter((item: any) => this.DropDowntehsilData.some((tehsil) => tehsil.Id === item.ParentId));
        this.DropDownhealthFacilityTypeData = data?.HealthFacilityTypeDropdown.filter((item: any) => this.DropDownhealthFacilityData.some((Hf) => Hf.HfTypeCode === item.HfTypeCode))

        this.userLevelFiltersModel.ProvinceId = this.provinceData[0]?.Id
        
        this.divisionData = this.DropDowndivisionData
        this.districtData = this.DropDowndistrictData;
        this.tehsilData = this.DropDowntehsilData;
        this.healthFacilityTypeData = this.DropDownhealthFacilityTypeData
        this.healthFacilityData = this.DropDownhealthFacilityData;
      }
      else if (this.loginUser.UserLevel == this.userLevelConstant.DivisionalLevel) {
        this.isProvinceLevel = true;
        this.isDivisionLevel = true;
  
        this.provinceData = data?.ProvinceDropdown.filter((item: any) => item.Id === this.loginUser.ProvinceId);
        this.DropDowndivisionData = data?.DivisionDropdown.filter((item: any) => item.Id === this.loginUser.DivisionId);
        this.DropDowndistrictData = data?.DistrictDropdown.filter((item: any) => this.DropDowndivisionData.some((division) => division.Id === item.ParentId));
        this.DropDowntehsilData = data?.TehsilDropdown.filter((item: any) => this.DropDowndistrictData.some((district) => district.Id === item.ParentId));
        this.DropDownhealthFacilityData = data?.HealthFacilityDropdown.filter((item: any) => this.DropDowntehsilData.some((tehsil) => tehsil.Id === item.ParentId));
        this.DropDownhealthFacilityTypeData = data?.HealthFacilityTypeDropdown.filter((item: any) => this.DropDownhealthFacilityData.some((Hf) => Hf.HfTypeCode === item.HfTypeCode))

        this.userLevelFiltersModel.ProvinceId = this.provinceData[0]?.Id
        this.userLevelFiltersModel.DivisionId = this.DropDowndivisionData[0]?.Id
        this.divisionData = this.DropDowndivisionData
        this.districtData = this.DropDowndistrictData;
        this.tehsilData = this.DropDowntehsilData;
        this.healthFacilityTypeData = this.DropDownhealthFacilityTypeData
        this.healthFacilityData = this.DropDownhealthFacilityData;


        //this.provinceData = this.provinceData.filter((item: any) => item.Id === this.loginUser.ProvinceId);
        //this.divisionData = this.DropDowndivisionData.filter((item: any) => item.Id === this.loginUser.DivisionId);
        //this.getDistricts(this.loginUser.DivisionId);
  
        //this.setControls();
      }
      else if (this.loginUser.UserLevel == this.userLevelConstant.DistrictLevel) {
        this.isProvinceLevel = true;
        this.isDivisionLevel = true;
        this.isDistrictLevel = true;
  
        this.provinceData = data?.ProvinceDropdown.filter((item: any) => item.Id === this.loginUser.ProvinceId);
        this.DropDowndivisionData = data?.DivisionDropdown.filter((item: any) => item.Id === this.loginUser.DivisionId);
        this.DropDowndistrictData = data?.DistrictDropdown.filter((item: any) => item.Id === this.loginUser.DistrictId);
        this.DropDowntehsilData = data?.TehsilDropdown.filter((item: any) => this.DropDowndistrictData.some((district) => district.Id === item.ParentId));
        this.DropDownhealthFacilityData = data?.HealthFacilityDropdown.filter((item: any) => this.DropDowntehsilData.some((tehsil) => tehsil.Id === item.ParentId));
        this.DropDownhealthFacilityTypeData = data?.HealthFacilityTypeDropdown.filter((item: any) => this.DropDownhealthFacilityData.some((Hf) => Hf.HfTypeCode === item.HfTypeCode))

        this.userLevelFiltersModel.ProvinceId = this.provinceData[0]?.Id
        this.userLevelFiltersModel.DivisionId = this.DropDowndivisionData[0]?.Id
        this.userLevelFiltersModel.DistrictId = this.DropDowndistrictData[0]?.Id

        this.divisionData = this.DropDowndivisionData
        this.districtData = this.DropDowndistrictData;
        this.tehsilData = this.DropDowntehsilData;
        this.healthFacilityTypeData = this.DropDownhealthFacilityTypeData
        this.healthFacilityData = this.DropDownhealthFacilityData;
        //this.getTehsil(this.loginUser.DistrictId);
        //this.setControls();
      }
      else if (this.loginUser.UserLevel == this.userLevelConstant.TehsilLevel) {
        this.isProvinceLevel = true;
        this.isDivisionLevel = true;
        this.isDistrictLevel = true;
        this.isTehsilLevel = true;

        this.provinceData = data?.ProvinceDropdown.filter((item: any) => item.Id === this.loginUser.ProvinceId);
        this.DropDowndivisionData = data?.DivisionDropdown.filter((item: any) => item.Id === this.loginUser.DivisionId);
        this.DropDowndistrictData = data?.DistrictDropdown.filter((item: any) => item.Id === this.loginUser.DistrictId);
        this.DropDowntehsilData = data?.TehsilDropdown.filter((item: any) => item.Id === this.loginUser.TehsilId);
        this.DropDownhealthFacilityData = data?.HealthFacilityDropdown.filter((item: any) => this.DropDowntehsilData.some((tehsil) => tehsil.Id === item.ParentId));
        this.DropDownhealthFacilityTypeData = data?.HealthFacilityTypeDropdown.filter((item: any) => this.DropDownhealthFacilityData.some((Hf) => Hf.HfTypeCode === item.HfTypeCode))

        this.userLevelFiltersModel.ProvinceId = this.provinceData[0]?.Id
        this.userLevelFiltersModel.DivisionId = this.DropDowndivisionData[0]?.Id
        this.userLevelFiltersModel.DistrictId = this.DropDowndistrictData[0]?.Id
        this.userLevelFiltersModel.TehsilId = this.DropDowntehsilData[0]?.Id 

        this.divisionData = this.DropDowndivisionData
        this.districtData = this.DropDowndistrictData;
        this.tehsilData = this.DropDowntehsilData;
        this.healthFacilityTypeData = this.DropDownhealthFacilityTypeData
        this.healthFacilityData = this.DropDownhealthFacilityData;
       // this.getHealthFacility(this.loginUser.TehsilId);
       // this.setControls();
      }
      else if (this.loginUser.UserLevel == this.userLevelConstant.HealthFacilityLevel) {
        this.isProvinceLevel = true;
        this.isDivisionLevel = true;
        this.isDistrictLevel = true;
        this.isTehsilLevel = true;
        this.isHealthFacilityLevel = true;

        this.provinceData = data?.ProvinceDropdown.filter((item: any) => item.Id === this.loginUser.ProvinceId);
        this.DropDowndivisionData = data?.DivisionDropdown.filter((item: any) => item.Id === this.loginUser.DivisionId);
        this.DropDowndistrictData = data?.DistrictDropdown.filter((item: any) => item.Id === this.loginUser.DistrictId);
        this.DropDowntehsilData = data?.TehsilDropdown.filter((item: any) => item.Id === this.loginUser.TehsilId);
        this.DropDownhealthFacilityData = data?.HealthFacilityDropdown.filter((item: any) => item.Id === this.loginUser.HealthFacilityId);
        this.DropDownhealthFacilityTypeData = data?.HealthFacilityTypeDropdown.filter((item: any) => this.DropDownhealthFacilityData.some((Hf) => Hf.HfTypeCode === item.HfTypeCode))

        this.userLevelFiltersModel.ProvinceId = this.provinceData[0]?.Id
        this.userLevelFiltersModel.DivisionId = this.DropDowndivisionData[0]?.Id
        this.userLevelFiltersModel.DistrictId = this.DropDowndistrictData[0]?.Id
        this.userLevelFiltersModel.TehsilId = this.DropDowntehsilData[0]?.Id
        this.userLevelFiltersModel.HealthFacilityTypeId = this.DropDownhealthFacilityTypeData[0]?.Id
        this.userLevelFiltersModel.HealthFacilityId = this.DropDownhealthFacilityData[0]?.Id

        this.divisionData = this.DropDowndivisionData
        this.districtData = this.DropDowndistrictData;
        this.tehsilData = this.DropDowntehsilData;
        this.healthFacilityTypeData = this.DropDownhealthFacilityTypeData
        this.healthFacilityData = this.DropDownhealthFacilityData;
        //this.getHealthFacilityDepartments(this.loginUser.HealthFacilityId);
        //this.setControls();
  
      }

      // this.divisionData = data?.DivisionDropdown;
      // this.districtData = data?.DistrictDropdown;
      // this.tehsilData = data?.TehsilDropdown;
      // this.healthFacilityTypeData = this.DropDownhealthFacilityTypeData
      // this.healthFacilityData = data?.HealthFacilityDropdown.filter((x:any)=>x.IsRunningHMIS == true);
      
      // console.log('this.divisionData',this.divisionData)
      // console.log('this.districtData',this.districtData)
      // console.log('this.tehsilData',this.tehsilData)
      // console.log('healthFacilityData',this.healthFacilityData)
      this.isSaved.emit(true)
      //this.setLocations()
    });
  
    //this.divisionData = this.allLocations?.DivisionDropdown;
  }
  public handleFilter(value:any, filter:any){
    //  
    // if (filter == 'division') {
    //   this.divisionData = this.divisionData.filter((s: any) => s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    // }
    // if (filter == 'district') {
    //   this.districtData = this.districtData.filter((s: any) => s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    // }
    // if (filter == 'tehsil') {
    //   this.tehsilData = this.tehsilData.filter((s: any) => s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    // }
  }
  
  public dropdownValueChanged(value:any, filter:any) {
     
    if (!value) {
      if (filter == 'division') {
        this.userLevelFiltersModel.DistrictId = ''
        this.userLevelFiltersModel.DivisionId = ''
        this.userLevelFiltersModel.TehsilId = ''
        this.userLevelFiltersModel.HealthFacilityTypeId = ''
        this.userLevelFiltersModel.HealthFacilityId = ''

        this.divisionData = this.DropDowndivisionData
        this.districtData = this.DropDowndistrictData
        this.tehsilData = this.DropDowntehsilData
        this.healthFacilityData = this.DropDownhealthFacilityData
        if(this.userLevelFiltersModel.TehsilId){
          this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.TehsilId == this.userLevelFiltersModel.TehsilId)
          return
        }else if(this.userLevelFiltersModel.DistrictId){
          this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.DistrictId == this.userLevelFiltersModel.DistrictId)
          return
        }else if(this.userLevelFiltersModel.DivisionId){
          this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.DivisionId == this.userLevelFiltersModel.DivisionId)
          return
        }
      }
      if (filter == 'district') {
        this.userLevelFiltersModel.DistrictId = ''
        this.userLevelFiltersModel.TehsilId = ''
        this.userLevelFiltersModel.HealthFacilityTypeId = ''
        this.userLevelFiltersModel.HealthFacilityId = ''
        this.districtData = this.DropDowndistrictData
        this.tehsilData = this.DropDowntehsilData
        this.healthFacilityData = this.DropDownhealthFacilityData
        if(this.userLevelFiltersModel.TehsilId){
          this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.TehsilId == this.userLevelFiltersModel.TehsilId)
          return
        }else if(this.userLevelFiltersModel.DistrictId){
          this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.DistrictId == this.userLevelFiltersModel.DistrictId)
          return
        }else if(this.userLevelFiltersModel.DivisionId){
          this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.DivisionId == this.userLevelFiltersModel.DivisionId)
          return
        }
      }
      if (filter == 'tehsil') {
        this.userLevelFiltersModel.TehsilId = ''
        this.userLevelFiltersModel.HealthFacilityTypeId = ''
        this.userLevelFiltersModel.HealthFacilityId = ''
        this.tehsilData = this.DropDowntehsilData
        this.healthFacilityData = this.DropDownhealthFacilityData
        if(this.userLevelFiltersModel.TehsilId){
          this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.TehsilId == this.userLevelFiltersModel.TehsilId)
          return
        }else if(this.userLevelFiltersModel.DistrictId){
          this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.DistrictId == this.userLevelFiltersModel.DistrictId)
          return
        }else if(this.userLevelFiltersModel.DivisionId){
          this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.DivisionId == this.userLevelFiltersModel.DivisionId)
          return
        }
      }
      if (filter == 'HFType') {
        this.userLevelFiltersModel.HealthFacilityTypeId = ''
        this.userLevelFiltersModel.HealthFacilityId = ''
        this.healthFacilityTypeData = this.DropDownhealthFacilityTypeData
        this.healthFacilityData = this.DropDownhealthFacilityData
        if(this.userLevelFiltersModel.TehsilId){
          this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.TehsilId == this.userLevelFiltersModel.TehsilId)
          return
        }else if(this.userLevelFiltersModel.DistrictId){
          this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.DistrictId == this.userLevelFiltersModel.DistrictId)
          return
        }else if(this.userLevelFiltersModel.DivisionId){
          this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.DivisionId == this.userLevelFiltersModel.DivisionId)
          return
        }

      }
      if (filter == 'HealthFacility') {
        this.userLevelFiltersModel.HealthFacilityId = ''
        this.healthFacilityData = this.DropDownhealthFacilityData
        if(this.userLevelFiltersModel.TehsilId){
          this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.TehsilId == this.userLevelFiltersModel.TehsilId)
          return
        }else if(this.userLevelFiltersModel.DistrictId){
          this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.DistrictId == this.userLevelFiltersModel.DistrictId)
          return
        }else if(this.userLevelFiltersModel.DivisionId){
          this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.DivisionId == this.userLevelFiltersModel.DivisionId)
          return
        }
      }
      return
    }

    if (filter == 'division') {
      this.userLevelFiltersModel.DistrictId = ''
      this.userLevelFiltersModel.TehsilId = ''
      this.userLevelFiltersModel.HealthFacilityTypeId = ''
      this.userLevelFiltersModel.HealthFacilityId = ''
      this.districtData = this.DropDowndistrictData.filter((item: any) => item.ParentId === value)
      this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.DivisionId === value)

      // this.selectedFiltersModel.district.Code = this.hfmisCode;
      // this.resetDrops(filter);
      // this.getDistricts();
      // this.getTehsils();
    }
    if (filter == 'district') {
      this.userLevelFiltersModel.TehsilId = ''
      this.userLevelFiltersModel.HealthFacilityTypeId = ''
      this.userLevelFiltersModel.HealthFacilityId = ''
      let District = this.DropDowndistrictData.filter((item: any) => item.Id === value)
      this.tehsilData = this.DropDowntehsilData.filter((item: any) => item.ParentId === value)
      this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.DistrictId === value)
      //let div = this.DropDowndivisionData.filter((item: any) => item.Id === this.tehsilData[0].ParentId)
      this.userLevelFiltersModel.DivisionId = District[0]?.ParentId
    }
    if (filter == 'tehsil') {
      this.userLevelFiltersModel.HealthFacilityTypeId = ''
      this.userLevelFiltersModel.HealthFacilityId = ''
      this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.ParentId === value)
      let Tehsil = this.DropDowntehsilData.filter((item: any) => item.Id === value)
      this.userLevelFiltersModel.DistrictId = Tehsil[0]?.ParentId
      let District = this.DropDowndistrictData.filter((item: any) => item.Id === this.userLevelFiltersModel.DistrictId)
      this.userLevelFiltersModel.DivisionId = District[0]?.ParentId
      
      // let division = this.DropDowndistrictData.filter((item: any) => item.Id === this.userLevelFiltersModel.DivisionId)
      // this.userLevelFiltersModel.DivisionId = division[0].ParentId
    }

    if (filter == 'HFType') {
      this.userLevelFiltersModel.HealthFacilityId = ''
      let hfacilityType = this.DropDownhealthFacilityTypeData.filter((item: any) => item.Id === value)
      
      if(this.userLevelFiltersModel.TehsilId){
        this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.HfTypeCode == hfacilityType[0]?.HfTypeCode && item.TehsilId == this.userLevelFiltersModel.TehsilId)
        return
      }else if(this.userLevelFiltersModel.DistrictId){
        this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.HfTypeCode == hfacilityType[0]?.HfTypeCode && item.DistrictId == this.userLevelFiltersModel.DistrictId)
        return
      }else if(this.userLevelFiltersModel.DivisionId){
        this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.HfTypeCode == hfacilityType[0]?.HfTypeCode && item.DivisionId == this.userLevelFiltersModel.DivisionId)
        return
      }else if(this.userLevelFiltersModel.HealthFacilityTypeId){
        this.healthFacilityData = this.DropDownhealthFacilityData.filter((item: any) => item.HfTypeCode == hfacilityType[0]?.HfTypeCode)
        return
      }
      
      //let Tehsil = this.DropDowntehsilData.filter((item: any) => item.Id === hfacility[0]?.ParentId)
      // this.userLevelFiltersModel.TehsilId = Tehsil[0]?.Id
      // this.userLevelFiltersModel.DistrictId = Tehsil[0]?.ParentId
      // let District = this.DropDowndistrictData.filter((item: any) => item.Id === this.userLevelFiltersModel.DistrictId)
      // this.userLevelFiltersModel.DivisionId = District[0]?.ParentId
      
      // let division = this.DropDowndistrictData.filter((item: any) => item.Id === this.userLevelFiltersModel.DivisionId)
      // this.userLevelFiltersModel.DivisionId = division[0].ParentId
    }

    if (filter == 'HF') {
      let hfacility = this.DropDownhealthFacilityData.filter((item: any) => item.Id === value)
      let hfacilityType = this.DropDownhealthFacilityTypeData.filter((item: any) => item.HfTypeCode === hfacility[0]?.HfTypeCode)
      this.userLevelFiltersModel.HealthFacilityTypeId = hfacilityType[0]?.Id
      let Tehsil = this.DropDowntehsilData.filter((item: any) => item.Id === hfacility[0]?.ParentId)
      this.userLevelFiltersModel.TehsilId = Tehsil[0]?.Id
      this.userLevelFiltersModel.DistrictId = Tehsil[0]?.ParentId
      let District = this.DropDowndistrictData.filter((item: any) => item.Id === this.userLevelFiltersModel.DistrictId)
      this.userLevelFiltersModel.DivisionId = District[0]?.ParentId
      
      // let division = this.DropDowndistrictData.filter((item: any) => item.Id === this.userLevelFiltersModel.DivisionId)
      // this.userLevelFiltersModel.DivisionId = division[0].ParentId
    }
    
  }
  

}
