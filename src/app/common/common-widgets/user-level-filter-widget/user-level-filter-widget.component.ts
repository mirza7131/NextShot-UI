import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserLevelFilterWidgetService } from './user-level-filter-widget.service';
import { UserLevelConstant } from 'src/app/core/constants/user-level.constant';
import { PatientVisitFilter } from 'src/app/patient/patient-visit/patient-visit-filter';
import { RoleConstant } from 'src/app/core/constants/Role.constant';
import { LocalService } from 'src/app/_services/local.service';
import { CommonService } from 'src/app/_services/common.service';
import { departments } from 'src/app/core/constants/department.constants';
import { SectionConstant } from 'src/app/core/constants/section.constants';

@Component({
  selector: 'app-user-level-filter-widget',
  templateUrl: './user-level-filter-widget.component.html',
  styleUrls: ['./user-level-filter-widget.component.scss']
})
export class UserLevelFilterWidgetComponent implements OnInit {

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

  roleConstant: RoleConstant = new RoleConstant();
  isSuperAdmin: boolean = false;
  loginUser: any = {};

  bindValue = '[readonly]="true"';
  userLevelConstant: UserLevelConstant = new UserLevelConstant();

  public allLocations: any = [];
  public provinceData: any[] = [];
  public divisionData: any[] = [];
  public districtData: any[] = [];
  public tehsilData: any[] = [];
  public healthFacilityData: any[] = [];
  public departmentData: any[] = [];
  public sectionData: any[] = [];
  public healthFacilityPlaceHolder = "Select a Health Facility"
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

    // console.log('console User Level filter', this.userLevelFiltersModel);

    // console.log('IsHmisListIsHmisList', this.IsHmisEnabled)
    this.isSuperAdmin = this._authService.isSuperAdmin();
    this.loginUser = this._authService.user;
    this.getAllLocations();
    // this.setAllDropdowns();
    // console.log(this.userLevelFormGroup);
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
      this.provinceData = this.allLocations.ProvinceDropdown.filter((item: any) => item.Id === this.loginUser.ProvinceId);
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
        if (this.userLevelFiltersModel.isFilterFromHf) {
          if (this.IsHmisEnabled) {
            this.healthFacilityData = data.HealthFacilityDropdown.filter((x: any) => x.IsRunningHMIS == true);
          } else {
            this.healthFacilityData = data.HealthFacilityDropdown
          }
        }
        this.setLocations();
      });
    }
    else {

      this.allLocations = this._localService.getValue('alllocations');
      this.provinceData = this.allLocations.ProvinceDropdown;
      if (this.userLevelFiltersModel.isFilterFromHf) {
        if (this.IsHmisEnabled) {
          this.healthFacilityData = this.allLocations.HealthFacilityDropdown.filter((x: any) => x.IsRunningHMIS == true);
        } else {
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
    if (!this.userLevelFiltersModel.isFilterFromHf)
      this.healthFacilityData = [];

    this.departmentData = [];
    this.sectionData = [];

    if (provinceId)
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
    if (!this.userLevelFiltersModel.isFilterFromHf)
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
    if (!this.userLevelFiltersModel.isFilterFromHf)
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
    if (this.IsHmisEnabled) {
      this.healthFacilityData = this.allLocations?.HealthFacilityDropdown.filter((item: any) => item.ParentId === tehsilId && item.IsRunningHMIS == true);
    } else {
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

    if (this.userLevelFiltersModel.isFilterFromHf) {
      this.userLevelFiltersModel.TehsilId = null;
      this.userLevelFiltersModel.DistrictId = null;
      this.userLevelFiltersModel.DivisionId = null;

      // get tehsil
      let healthfacilty = this.allLocations?.HealthFacilityDropdown.find((item: any) => item.Id === healthfacilityId);

      if (!this.userLevelFiltersModel.TehsilId)
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

        if (!this.IsNullorUndefined(tehsilId))
          this.userLevelFiltersModel.TehsilId = tehsilId;

        if (!this.IsNullorUndefined(districtId))
          this.userLevelFiltersModel.DistrictId = districtId;

        if (!this.IsNullorUndefined(divisonId))
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


  checkIfHealthFacilityFilter(event: any) {

    this.getAllLocations();
    if (this.userLevelFiltersModel.isFilterFromHf)
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
    return (val === undefined || val == null || val.length <= 0 || val.length == '' || val == 0 || Number.isNaN(val)) ? true : false;
  }


  public numberToWords(num: any) {
    var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if ((num = num?.toString())?.length > 9) return 'overflow';
    let n: any = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return ''; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
  }



  isValidDate(dateString: any): boolean {
    const dateObject = new Date(dateString);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const yearsAgo = currentYear - 110;

    // Check if the dateObject is a valid date
    // Also, check for the range of valid years as per your requirement
    if (
      isNaN(dateObject.getTime()) ||
      dateString.trim() === '' ||
      dateObject.getFullYear() < yearsAgo ||
      dateObject.getFullYear() > currentYear 
    ) {
      return false;
    }

    if (dateObject > new Date()) {
      return false;    
    }

    return true;
  }


  calculateDiff(dateSent: Date) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
  }

}
