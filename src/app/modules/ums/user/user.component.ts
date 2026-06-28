import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User, UserRole } from './user';
import { ValidationErrors, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { Table } from 'primeng/table';
import { RoleService } from '../role/role.service';
import { MessageService } from 'primeng/api';
import { ProfileService } from '../profile/profile.service';
import { HealthFacilityService } from '../health-facility/health-facility.service';
import { HealthFacility } from '../health-facility/health-facility';
import { UserFilter } from './user-filter';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MessageConstant } from 'src/app/core/constants/message.constants';
import { ProfileTypeConstant } from 'src/app/core/constants/profileType.constants';
import { UserLevelConstant } from 'src/app/core/constants/user-level.constant';
// import { json } from 'd3';
import { RoleConstant } from 'src/app/core/constants/Role.constant';
import { UserLevelFiltersModel } from 'src/app/core/models/PaginatorModel';
import { LocalService } from 'src/app/_services/local.service';
import { PatientsService } from 'src/app/patient/patients.service';
import { CommonService } from 'src/app/_services/common.service';
import { departments } from 'src/app/core/constants/department.constants';
import { SectionConstant } from 'src/app/core/constants/section.constants';
// import { PatientVisitFilter } from '../../patient/patient-visit/patient-visit-filter';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  //#region Class Fields & Propertities
  userLevelConstant: UserLevelConstant = new UserLevelConstant();
  // public userLevelFiltersModel: any = new PatientVisitFilter(); // if Model
  datePipe = new DatePipe("en-US");
  users: User[] = [];

  cols: any = [];
  socialWelfare: string = "SCLWLF";

  userDialog: boolean = false;

  assigsUserRoleDialog: boolean = false;
  isAssignUserRole: boolean = false;

  deleteUserDialog: boolean = false;

  deleteUsersDialog: boolean = false;

  submitted: boolean = false;

  user: User = {};

  roles: any[] = [];
  assignableRoles: any[] = [];

  selectedRoles: UserRole[] = [];

  formData: User = {};

  userExist: boolean = false;

  readonlyForm: boolean = true; // to make fields readonly if user is not admin

  editCnic: boolean = false; // to make cnic editable in case of New

  authViaHR: boolean = false; // to allow password fields visible or not

  userCreationWithoutHR: boolean = false; // to allow user creation without data fetching from HR

  maxDate: string = new Date().toISOString().slice(0, 10);

  minDate: string = new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().slice(0, 10); //minimum 100 years

  isSuperAdmin: boolean = false;

  // public departmentData: any[] = [];

  // public sectionData: any[] = [];

  formInitialValues: any = {};

  listGender: any = [];

  listDesignation: any = [];

  listDivision: any = [];

  listDistrict: any = [];

  listTehsil: any = [];

  listHealthFacilities: HealthFacility[] = [];

  // filterModel: UserFilter = new UserFilter();
  filterModel: any = {} ;

  loginUser: any = {};
  UserRoleList: any = [];

  // allLocations: any = [];

  public MobileCode: Array<any> = [
    { Code: '0300' },
    { Code: '0301' },
    { Code: '0302' },
    { Code: '0303' },
    { Code: '0304' },
    { Code: '0305' },
    { Code: '0306' },
    { Code: '0307' },
    { Code: '0308' },
    { Code: '0309' },
    { Code: '0310' },
    { Code: '0311' },
    { Code: '0312' },
    { Code: '0313' },
    { Code: '0314' },
    { Code: '0315' },
    { Code: '0316' },
    { Code: '0317' },
    { Code: '0318' },
    { Code: '0320' },
    { Code: '0321' },
    { Code: '0322' },
    { Code: '0323' },
    { Code: '0324' },
    { Code: '0325' },
    { Code: '0330' },
    { Code: '0331' },
    { Code: '0332' },
    { Code: '0333' },
    { Code: '0334' },
    { Code: '0335' },
    { Code: '0336' },
    { Code: '0337' },
    { Code: '0340' },
    { Code: '0341' },
    { Code: '0342' },
    { Code: '0343' },
    { Code: '0344' },
    { Code: '0345' },
    { Code: '0346' },
    { Code: '0347' },
    { Code: '0348' },
    { Code: '0349' },
    { Code: '0355' },
  ];

  public Cniccode: Array<any> = [
    { Code: '00000-0000000-0' },
    { Code: '11111-1111111-1' },
    { Code: '22222-2222222-2' },
    { Code: '33333-3333333-3' },
    { Code: '44444-4444444-4' },
    { Code: '55555-5555555-5' },
    { Code: '66666-6666666-6' },
    { Code: '77777-7777777-7' },
    { Code: '88888-8888888-8' },
    { Code: '99999-9999999-9' },
  ];

  public mobilecode: any
  public MobilenumLetters: any;
  public Mobilekeys: any;
  public cniccode: any
  public cnicnumLetters: any;
  public cnickeys: any;
  showUserFilterWidget: boolean = true;
  userLevelFiltersModel: UserLevelFiltersModel = new UserLevelFiltersModel();
  // User Form Group
  userForm = new FormGroup({
    UserId: new FormControl(),
    FullName: new FormControl('', Validators.required),
    FatherName: new FormControl('', Validators.required),
    Password: new FormControl('', this.authViaHR ? [] : Validators.required),
    ConfirmPassword: new FormControl('', this.authViaHR ? [] : Validators.required),
    Email: new FormControl('', [Validators.required, Validators.email]),
    Cnic: new FormControl('', Validators.required),
    Dob: new FormControl('', [Validators.required, this.dobValidator]),
    ContactNo: new FormControl('', Validators.required),
    IsActive: new FormControl(true),
    GenderProfileId: new FormControl(),
    HrId: new FormControl(),
    ProvinceId: new FormControl(this.userLevelFiltersModel.ProvinceId),
    DivisionId: new FormControl(this.userLevelFiltersModel.DivisionId),
    DistrictId: new FormControl(this.userLevelFiltersModel.DistrictId),
    TehsilId: new FormControl(this.userLevelFiltersModel.TehsilId),
    HealthFacilityId: new FormControl(this.userLevelFiltersModel.HealthFacilityId),
    DepartmentId: new FormControl(),
    SectionId: new FormControl(),
    DesignationProfileId: new FormControl(),
  });

  loginUsePermissions: any = {};
  showDeleteListItem: boolean = true;
  ShowSync: boolean = false;
  roleConstant: RoleConstant = new RoleConstant();
  hfDepartmentSection: any = [];
  hfDepartment: any = [];


  public allLocations?: any = [];
  public provinceData: any[] = [];
  public divisionData: any[] = [];
  public districtData: any[] = [];
  public tehsilData: any[] = [];
  public healthFacilityData: any[] = [];
  public departmentData: any[] = [];
  public sectionData: any[] = [];

  public isProvinceLevel: boolean = false;
  public isDivisionLevel: boolean = false;
  public isDistrictLevel: boolean = false;
  public isTehsilLevel: boolean = false;
  public isHealthFacilityLevel: boolean = false;
  //#endregion

  // #region Constructor
  constructor
    (
      private _userService: UserService,
      private _roleService: RoleService,
      private _profileService: ProfileService,
      private _messageService: MessageService,
      private _healthFacilityService: HealthFacilityService,
      private _authService: AuthService,
      private _localService: LocalService,
      // private _patientsService: PatientsService,
      private _commonService: CommonService
    ) {

  }

  ngOnInit(): void {

    this.cols = [
      { field: 'FullName', header: 'Name' },
      { field: 'Email', header: 'Email' },
      { field: 'CNIC', header: 'CNIC' },
      { field: 'IsActive', header: 'Active' }
    ];

    
    this.getAllUsers(this.filterModel);
    // this.getAllLocations();
    this.formInitialValues = this.userForm.value;

    // to make fields readonly if user is not admin
    this.readonlyForm = !this._authService.isSuperAdmin();
    this.authViaHR = this._authService.isAuthViaHR();
    this.userCreationWithoutHR = this._authService.isUserCreationWithoutHR();
    this.isSuperAdmin = this._authService.isSuperAdmin();
    // this.getAllRoles();
    // this.loginUser = this._localService.getEncryptedValue('response');
    this.loginUser = this._localService.getEncryptedValue('responseData');
  //  this.loginUser = this._authService.user;
   
   
   
   
   
    // let loginUser = this._authService.getLoginUser();
    

     this.UserRoleList = this._localService.getEncryptedValue('roles');

     let isHfAdmin = this.UserRoleList.find((x:any) => x.ShortName == 'HF Admin');
   // let isHfAdmin = this.loginUser.UserRoleList.find((x:any) => x.ShortName == 'HF Admin');
    if(isHfAdmin && this.loginUser.IsOffline)
      this.ShowSync = true;
    // if(this.loginUser.UserLevel == this.userLevelConstant.HealthFacilityLevel)
    //   this.getdepartments(parseInt(JSON.parse(localStorage.getItem("user") ?? "").HealthFacilityId));

    // User Form Group
    this.userForm.reset(this.formInitialValues);

    // this.loginUsePermissions = this._authService.getPermissionsByUrl(window.location.pathname);
    // this.showDeleteListItem = this.loginUsePermissions.CanDelete;
    // this.user.UserRoles = this.loginUser.UserRoleList;
  }

  //#endregion

  // #region CUD Operations

  saveUser() {

    this.submitted = true;

    let selectedRoles = this.selectedRoles;
    selectedRoles = [];

    let _messageService = this._messageService;
    if (this.userForm.valid) {
      if (this.userExist) {
        this._messageService.add({ severity: 'error', summary: 'Invalid User', detail: MessageConstant.UserAlreadyExist, life: 3000 });
        return;
      }

      this.roles.forEach(function (item) {

        if (item.IsActive) {
          selectedRoles.push({
            RoleId: item.RoleId,
            UserRoleId: item.UserRoleId,
            UserId: item.UserId,
            IsActive: true
          });
        }

      });

      if (selectedRoles.length == 0) {
        _messageService.add({ severity: 'error', summary: 'Error', detail: MessageConstant.SelectAtLeastOneRole, life: 3000 });
        return;
      }

      let isDeptAssigned: boolean = true;
      let isSectionAssigned: boolean = true;
      selectedRoles.forEach((selectedRole) => {
        let data = this.roles.find((userRoles) => userRoles.RoleId == selectedRole.RoleId);
        if (data.ShortName == this.roleConstant.DOCTOR) {
          if (this.userForm.controls.SectionId.value == null) {
            isDeptAssigned = false
          } else if (this.userForm.controls.DepartmentId.value == null) {
            isSectionAssigned = false
          }
        }
      })


      if (!isDeptAssigned) {
        return _messageService.add({ severity: 'error', summary: 'Error', detail: MessageConstant.PleaseSelectDepAndSec, life: 3000 });
      } else if (!isSectionAssigned) {
        return _messageService.add({ severity: 'error', summary: 'Error', detail: MessageConstant.PleaseSelectDepAndSec, life: 3000 });
      }
      this.user = {
        ...this.userForm.value,
        Dob: this.userForm.value.Dob ? new Date(this.userForm.value.Dob) : undefined
      } as User;

      // if login user is not super admin then use its health facility id
      // if(!this.isSuperAdmin)
      // {
      //   this.user.HealthFacilityId =  this.loginUser.HealthFacilityId;
      //   this.user.ProvinceId =  this.loginUser.ProvinceId;
      //   this.user.DivisionId =  this.loginUser.DivisionId;
      //   this.user.DistrictId =  this.loginUser.DistrictId;
      //   this.user.TehsilId =  this.loginUser.TehsilId;
      // }

      this.user.UserRoles = selectedRoles;

      if (this.authViaHR)
        this.user.Password = '123456';

      // this.user.Username = this.userForm.controls['Cnic'].value || '';

      this._userService.create(this.user).subscribe(data => {

        // if (this.userForm.controls['UserId'].value) // edit
        // {
        //   // @ts-ignore
        //   this.users[this.findIndexById(this.userForm.controls['UserId'].value)] = this.userForm.value;

        // }
        // else // add
        // {
        //   this.user.UserId = data.UserId;
        //   this.users.push(this.user);
        // }

        // this.users = [...this.users];
        this.userDialog = false;
        this.user = {};
        this.userForm.reset(this.formInitialValues);
        this.getAllUsers(this.filterModel);


      });
    }
  }



  saveAssignableRolesEmitter(roles: any) {
    this._userService.createUserAssignableRoles(roles).subscribe(() => {
      this.assigsUserRoleDialog = false;
      this.isAssignUserRole = false
    })
  }


  confirmDelete() {

    this.deleteUserDialog = false;

    this._userService.delete(this.user.UserId || '').subscribe((data: any) => {

      this.users = this.users.filter(val => val.UserId !== this.user.UserId);
      this.user = {};
    });

  }


  //#endregion

  // #region Read Operations

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

  setControls(isEdit?:any) {
    if (typeof this.userForm !== 'undefined' && this.userForm.controls["ProvinceId"].value)
      this.getDivisions(this.userForm.controls["ProvinceId"].value);

    if (typeof this.userForm !== 'undefined' && this.userForm.controls["DivisionId"].value)
      this.getDistricts(this.userForm.controls["DivisionId"].value);

    if (typeof this.userForm !== 'undefined' && this.userForm.controls["DistrictId"].value)
      this.getTehsil(this.userForm.controls["DistrictId"].value);

    if (typeof this.userForm !== 'undefined' && this.userForm.controls["TehsilId"].value)
      this.getHealthFacility(this.userForm.controls["TehsilId"].value);

    if (typeof this.userForm !== 'undefined' && this.userForm.controls["HealthFacilityId"].value)
    {
      //if(isEdit)
      //   this.getDepartmentAndSectionByHealthFacility(this.userForm.controls["HealthFacilityId"].value);
      // this.getHealthFacilityDepartments(this.userForm.controls["HealthFacilityId"].value);
    }

    if (typeof this.userForm !== 'undefined' && this.userForm.controls["DepartmentId"].value)
      this.getHealthFacilitySections(this.userForm.controls["DepartmentId"].value);
  }
  // checkIfDepartmentSectionExist(){
  //   if(this.allLocations?.HfDepartmentDropdown && this.allLocations?.HfDepartmentDropdown.length>0 && this.allLocations?.HfDepartmentSectionDropdown && this.allLocations?.HfDepartmentSectionDropdown.length>0)
  //     return true
  //   else
  //     return false  
  // }

  getAllLocations() {
debugger
    if (!this._localService.getValue('alllocations')) {
      this._commonService.getAllLocations().subscribe((data: any) => {
        this._localService.setValue('alllocations', data);
        debugger
        this.allLocations = data;
        this.provinceData = data.ProvinceDropdown;
        // if (this.userLevelFiltersModel.isFilterFromHf) {
        //   // if (this.IsHmisEnabled) {
        //   //   this.healthFacilityData = data.HealthFacilityDropdown.filter((x: any) => x.IsRunningHMIS == true);
        //   // } else {
        //     this.healthFacilityData = data.HealthFacilityDropdown
        //   // }
        // }
        this.setLocations();
      });
    }
    else {

      this.allLocations = this._localService.getValue('alllocations');
      this.provinceData = this.allLocations.ProvinceDropdown;
      // if (this.userLevelFiltersModel.isFilterFromHf) {
      //   // if (this.IsHmisEnabled) {
      //   //   this.healthFacilityData = this.allLocations.HealthFacilityDropdown.filter((x: any) => x.IsRunningHMIS == true);
      //   // } else {
      //     this.healthFacilityData = this.allLocations.HealthFacilityDropdown;
      //   // }
      //   //this.healthFacilityData = this.allLocations.HealthFacilityDropdown;
      // }
      this.setLocations();
    }
  }

  getDivisions(provinceId?: any) {
    if (this.userForm) {
      provinceId = this.userForm.controls['ProvinceId'].value;
      this.getDistricts();
    }

    // this.userLevelFiltersModel.DivisionId = null;
    // this.userLevelFiltersModel.HealthFacilityId = null;
    this.districtData = [];
    this.tehsilData = [];
    // if (!this.userLevelFiltersModel.isFilterFromHf)
    this.healthFacilityData = [];
    this.departmentData = [];
    this.sectionData = [];

    if (provinceId)
      this.divisionData = this.allLocations?.DivisionDropdown.filter((item: any) => item.ParentId === provinceId);
    else
      this.divisionData = this.allLocations?.DivisionDropdown;
  }

  getDistricts(divisionId?: any) {
    if (this.userForm) {
      divisionId = this.userForm.controls['DivisionId'].value;
      this.getTehsil();
    }

    // this.userLevelFiltersModel.DistrictId = null;
    this.tehsilData = [];
    // if (!this.userLevelFiltersModel.isFilterFromHf)
    this.healthFacilityData = [];
    this.departmentData = [];
    this.sectionData = [];

    this.districtData = this.allLocations?.DistrictDropdown.filter((item: any) => item.ParentId === divisionId);

    // let selectedDivision = this.allLocations?.DivisionDropdown.filter((item: any) => item.Id === divisionId);
    // this.userLevelFiltersModel.DivisionCode = selectedDivision.length > 0 ? selectedDivision[0].Code : null;

  }

  getTehsil(districtId?: any) {
    if (this.userForm) {
      districtId = this.userForm.controls['DistrictId'].value;
      this.getHealthFacility();
    }

    // this.userLevelFiltersModel.HealthFacilityId = null;
    // this.userLevelFiltersModel.TehsilId = null;
    // if (!this.userLevelFiltersModel.isFilterFromHf)
    this.healthFacilityData = [];

    this.departmentData = [];
    this.sectionData = [];

    this.tehsilData = this.allLocations?.TehsilDropdown.filter((item: any) => item.ParentId === districtId);

    // let selectedDistrict = this.allLocations?.DistrictDropdown.filter((item: any) => item.Id === districtId);
    // this.userLevelFiltersModel.DistrictCode = selectedDistrict.length > 0 ? selectedDistrict[0].Code : null;
  }

  getHealthFacility(tehsilId?: any) {

    if (this.userForm)
      tehsilId = this.userForm.controls['TehsilId'].value;

    // this.userLevelFiltersModel.HealthFacilityId = null;
    this.departmentData = [];
    this.sectionData = [];
    // if (this.IsHmisEnabled) {
    //   this.healthFacilityData = this.allLocations?.HealthFacilityDropdown.filter((item: any) => item.ParentId === tehsilId && item.IsRunningHMIS == true);
    // } else {
      this.healthFacilityData = this.allLocations?.HealthFacilityDropdown.filter((item: any) => item.ParentId === tehsilId);
    // }

    let selectedTehsil = this.allLocations?.TehsilDropdown.filter((item: any) => item.Id === tehsilId);
    // this.userLevelFiltersModel.TehsilCode = selectedTehsil.length > 0 ? selectedTehsil[0].Code : null;
  }

  getDepartmentAndSectionByHealthFacility(healthFacilityId:any): void {

    if (this.userForm)
      healthFacilityId = this.userForm.controls['HealthFacilityId'].value;

    this.departmentData = [];
    this.sectionData = [];
    if(healthFacilityId){
      this._userService.getDepartmentAndSectionByHealthFacility(healthFacilityId).subscribe((data: any) => {

        this.allLocations.HfDepartmentDropdown = data.HfDepartmentDropdown;
        this.allLocations.HfDepartmentSectionDropdown = data.HfDepartmentSectionDropdown;
        this.departmentData = data.HfDepartmentDropdown;
        // this.sectionData = data.HfDepartmentSectionDropdown;
        this.getHealthFacilityDepartments();
        this.setControls();
      });
    }

  }

  getHealthFacilityDepartments(healthFacilityId?: any) {


    // this.setAllDropdowns();
    if (this.userForm)
      healthFacilityId = this.userForm.controls['HealthFacilityId'].value;

    this.departmentData = [];
    this.sectionData = [];

    this.departmentData = this.allLocations?.HfDepartmentDropdown.filter((item: any) => item.ParentId === healthFacilityId);

    // let selectedHealthFacility = this.allLocations?.HealthFacilityDropdown.filter((item: any) => item.Id === healthFacilityId);
    // this.userLevelFiltersModel.HealthFacilityCode = selectedHealthFacility.length > 0 ? selectedHealthFacility[0].Code : null;




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

    if (this.userForm)
      Id = this.userForm.controls['DepartmentId'].value;

    if (Id) {
      let department = this.departmentData.find(x => x.LookupId == Id)
      if(department)
        Id = department.Id;
    }

    this.sectionData = [];
    this.sectionData = this.allLocations?.HfDepartmentSectionDropdown.filter((item: any) => item.ParentId === Id);




    if (this.loginUser.UserRoleList[0].Name == this.roleConstant.SscUserCreation) {
      this.sectionData = this.sectionData.filter((x) => x.Name == SectionConstant.psychiatryOPD);
    }
  }



  submitFilter() {

    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;
    if(this.filterModel.SearchString == "")
    {
      delete this.filterModel.SearchString;
      this.getAllUsers(this.filterModel);
    } 
    else 
    {
      this.getAllUsers(this.filterModel);
    }
  }

  clearFilter() {
    this.filterModel = new UserFilter();
    this.getAllUsers(this.filterModel);
    // this.populateDashboard(this.filterModel);
  }

  getAllUsers(filterModel: UserFilter): void {
    debugger
    this._userService.getAllWithPagination(this.filterModel).subscribe((data: any) => {
      debugger
      this.users = data.List;
     this.filterModel.TotalRecords = data.TotalCount;
     console.log("this.users==>",this.users);

    });

  }



  getUserRolesByUserId(user: User): void {

    // this._userService.getUserRolesByUserId(userId).subscribe((data:any) => {
    // this.user = data
    let userRoles = this.user.UserRoles || [];

    // var result = userRoles.map(function(a) {return a.RoleId;});

    this.roles.forEach(function (item) {
      item.IsActive = false;
    });

    this.roles.forEach(function (item) {

      userRoles.forEach(function (item2) {

        if (item.RoleId == item2.RoleId) {
          item.IsActive = true
          item.UserRoleId = item2.UserRoleId;
          item.UserId = item2.UserId;
        }

      });

    });
    // });
  }

  syncData() {
    var obj = {
      HealthFacilityId : this.loginUser.HealthFacilityId
    }
    this._userService.syncData(obj).subscribe((res: any) => {
      let response = res;
    })
  }

  getUserAssignableRolesById() {
     

    // if (this.loginUser.IsShowRoleOnly) {
    //   this.user.UserId = this.loginUser.UserId
    // }


    this._userService.getUserAssignableRolesById(this.user.UserId).subscribe((res: any) => {
       
      this.assignableRoles = res;
      let tempRoles = this.assignableRoles;



      if (this.loginUser.IsShowRoleOnly) {
        let tempRoles = JSON.parse(JSON.stringify(this.roles));
        var filteredArray = tempRoles.filter((item: any) =>
          this.assignableRoles.some(filterItem => {
            return filterItem.RoleId == item.RoleId
          })
        );


        this.roles = filteredArray;

      } else {


        this.roles.forEach(function (item) {
          item.IsActive = false;
        });
        this.roles.forEach((item) => {

          tempRoles.forEach((item2: any) => {
             
            if (item.RoleId == item2.RoleId) {
              item.IsActive = true
              item.UserRoleId = item2.UserRoleId;
              item.UserId = item2.UserId;
            }

          });

        });
      }




      // this.assignableRoles.forEach((element, index) => {
      //   if (element.RoleId === this.roles[index].RoleId) {
      //     this.roles[index].IsActive = true;
      //   }
      // });

    })
  }

  getAllRoles(): void {
    this._roleService.get().subscribe((data: any) => {
       
debugger
      this.roles = data
      this.roles.forEach(function (item) {
        item.IsActive = false;
      });
       
      if (this.assigsUserRoleDialog || !this.loginUser.IsShowRoleOnly) {
        this.getUserAssignableRolesById();
      } else if (this.user.UserId) {
        this.getUserRolesByUserId(this.user);
      }


      // if (this.loginUser.UserRoleList[0].Name == this.roleConstant.SscUserCreation) {
      //   this.roles = this.roles.filter((x) => x.ShortName == this.socialWelfare)
      // }

    });
  }

  checkIfUserExistByCnic() {

    var userCnic = this.userForm.controls['Cnic'].value;
    this.EnterCnicNum();
    this.showUserFilterWidget = false; // hide user filter widget to update accordingl filter data
    // check if user exist in our internal db
    this._userService.getByCnic(this.userForm.controls['Cnic'].value || '').subscribe((data: any) => {

      // if (!data) {
      //   this.showUserFilterWidget = false;
      //   this.userExist = false;
        // this._userService.getHrUserByCnic(this.userForm.controls['Cnic'].value || '').subscribe((data: any) => {

          // if (!data) {
          //   this._messageService.add({ severity: 'error', summary: 'Not Found', detail: MessageConstant.UserNotPresentInHR, life: 3000 });
          //   this.userForm.reset(this.formInitialValues);
          //   if (this.userCreationWithoutHR) {
          //     this.userForm.controls['Cnic'].setValue(userCnic);
          //     this.readonlyForm = false;
          //   }
          // }
          // else {

            this.userForm.patchValue(data);
            var datePipe = new DatePipe("en-US");
            this.userForm.controls["Dob"].setValue(datePipe.transform(data.Dob, 'yyyy-MM-dd'));

            if (this.userCreationWithoutHR) {
              this.readonlyForm = false;
            }
          // }

         //  this.showUserFilterWidget = true;

        // });
      // }
   //   else 
      if (data) {
        this._messageService.add({ severity: 'error', summary: 'Invalid User', detail: MessageConstant.UserAlreadyExist, life: 3000 });
        this.userForm.reset(this.formInitialValues);
        this.userExist = true;
      }
      else {
        this.showUserFilterWidget = true;
        this.userExist = false;
        this.readonlyForm = false;
      }
    });

  }

  get userFormControl() {
    return this.userForm.controls;
  }

  getGenders() {
    this._profileService.getProfileByProfileType('GNDR').subscribe((data: any) => {
      this.listGender = data;
    });
  }

  getDesignations() {
    this._profileService.getProfileByProfileType(ProfileTypeConstant.Designation).subscribe((data: any) => {
      this.listDesignation = data;
    });
  }

  //#endregion

  // #region Helper Methods

  editUser(user: any) {

    this.editCnic = false;
    // this.getAllLocations();
    this.getGenders();
    this.getAllRoles();
    this.getDesignations();
    if (this.loginUser.IsShowRoleOnly) {
      this.user.UserId = this.loginUser.UserId;
      this.getUserAssignableRolesById();
    }

    this.user = { ...user };

    // this.userForm.patchValue(user);

    // this.userForm.controls["Dob"].setValue(this.datePipe.transform(this.user.Dob , 'yyyy-MM-dd')) ;


    Object.keys(this.userForm.value).forEach((key: any) => {

      this.userForm.controls[key as keyof typeof this.userForm.value].setValue(user[key as keyof typeof user]);

      if (key == "Dob") {
        var datePipe = new DatePipe("en-US");
        this.userForm.controls["Dob"].setValue(datePipe.transform(this.user.Dob, 'yyyy-MM-dd'));
      }
    });

    this.setControls(true);

    this.userDialog = true;
  }


  assigsUserRole(user: any) {

    this.assigsUserRoleDialog = true;
    this.isAssignUserRole = true;

    this.getAllRoles();


    this.user = { ...user }
  }


  closeDiaglog() {
     
    this.assigsUserRoleDialog = false;
    this.isAssignUserRole = false
  }

  deleteUser(user: User) {
    this.deleteUserDialog = true;
    this.user = { ...user };
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].UserId === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  openNew() {


    this.user = {
      ...this.userForm.value,
      Dob: this.userForm.value.Dob ? new Date(this.userForm.value.Dob) : undefined
    } as User;
    this.editCnic = true;
    this.submitted = false;
    this.userDialog = true;
    this.userForm.reset(this.formInitialValues);
    this.getAllLocations();
     this.getAllRoles();
     this.getGenders();
     this.getDesignations();
    // if (this.loginUser.IsShowRoleOnly) {
    //   this.user.UserId = this.loginUser.UserId;
    //   this.getUserAssignableRolesById();
    // }

  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  onGlobalFilter(table: Table, event: Event) {

    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');

    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;
    if ((event.target as HTMLInputElement).value)
      this.filterModel.SearchString = (event.target as HTMLInputElement).value;
    else
      this.filterModel.SearchString = undefined;

    this.getAllUsers(this.filterModel);
  }

  fakeArray(): Array<any> {
    if (this.roles.length >= 0) {

      return new Array(Math.ceil(this.roles.length / 2));
    }
    return [];
  }

  selectRole(event: any, userRole: UserRole) {

    let value: boolean = false;
    if (event.checked) {
      value = true;
    }
    else {
      value = false;
    }

    this.roles.forEach(function (item) {
      if (item.RoleId == userRole.RoleId)
        item.IsActive = value;
    });

  }

  paginate(event: any) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.filterModel.PageNumber = event.page + 1;
    this.filterModel.PageSize = event.rows;
    this.getAllUsers(this.filterModel);
  }

  dobValidator(control: FormControl): ValidationErrors | null {

    if (control.value) {
      const date = new Date(control.value);
      const today = new Date();
      const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
      if (today < date || date < minDate) {
        return { 'invalidDate': true }
      }
    }
    return null;
  }

  EnterMobileNum() {
    this.Mobilekeys = this.userForm.controls['ContactNo'].value;
    this.MobilenumLetters = this.Mobilekeys.substring(0, 4);
    this.mobilecode = this.MobileCode.find(x => x.Code == this.MobilenumLetters);

    if (!this.mobilecode) {
      this._messageService.add({ severity: 'error', summary: 'Invalid Number', detail: "Mobile Number Invalid", life: 3000 });
      this.userForm.controls['ContactNo'].setValue(null)
    }
  }

  EnterCnicNum() {
    this.cnickeys = this.userForm.controls['Cnic'].value;
    this.cnicnumLetters = this.cnickeys.substring(0, 15);
    this.cniccode = this.Cniccode.find(x => x.Code == this.cnicnumLetters);
    if (this.cniccode) {
      this._messageService.add({ severity: 'error', summary: 'Invalid Number', detail: "Cnic Number Invalid", life: 3000 });
      this.userForm.controls['Cnic'].setValue(null)
    }
    this.cnickeys = this.userForm.controls['Cnic'].value;
    this.cnicnumLetters = this.cnickeys.substring(0, 1);
    if (this.cnicnumLetters == 0) {
      this.userForm.controls['Cnic'].setValue(null);
      return this._messageService.add({ severity: 'error', summary: 'Invalid User', detail: "Cnic Number Invalid", life: 3000 });
    }
  }

  rjxscharacter(e: any) {

    try {

      let k;

      if (/^[a-zA-Z ]*$/.test(e.key)) {
        // return true;
      }
      else {
        e.preventDefault();
        // return false;
      }
    }
    catch (e) {
    }

  }

//#endregion
  onSubmit() {
    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;

    if (this.filterModel.SearchString == "") {
      delete this.filterModel.SearchString;
      this.getAllUsers(this.filterModel);
    }
    else {
      this.getAllUsers(this.filterModel);
    }
  }

  //#endregion

}
