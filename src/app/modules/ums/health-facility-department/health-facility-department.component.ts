import { Component, OnInit } from '@angular/core';
import { HealthFacilityDepartment } from './health-facility-department';
import { Table } from 'primeng/table';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { HealthFacilityDepartmentService } from './health-facility-department.service';
import { DepartmentService } from '../department/department.service';
import { HealthFacilityService } from '../health-facility/health-facility.service';
import { HealthFacility } from '../health-facility/health-facility';
import { Department } from '../department/department';
import { Section } from '../section/section';
import { SectionService } from '../section/section.service';
import { HealthFacilityDepartmentSectionService } from '../health-facility-department-section/health-facility-department-section.service';
import { HealthFacilityDepartmentSection } from '../health-facility-department-section/health-facility-department-section';
import { HealthFacilityDepartmentFilter } from './health-facility-department-filter';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserLevelFiltersModel } from 'src/app/core/models/PaginatorModel';
import { LocalService } from 'src/app/_services/local.service';
import { CommonService } from 'src/app/_services/common.service';



@Component({
  selector: 'app-health-facility-department',
  templateUrl: './health-facility-department.component.html',
  styleUrls: ['./health-facility-department.component.scss']
})

export class HealthFacilityDepartmentComponent implements OnInit {

  //#region Class Fields & Propertities

  cols: any[] = [];

  departments: Department[] = [];

  sections: Section[] = [];

  healthFacilities: HealthFacility[] = [];

  healthFacilityDepartmentDialog: boolean = false;

  deleteHealthFacilityDepartmentDialog: boolean = false;

  healthFacilityDepartments: HealthFacilityDepartment[] = [];

  healthFacilityDepartment: HealthFacilityDepartment = {};

  selectedHealthFacilityDepartments: HealthFacilityDepartment[] = [];

  public allLocations?: any = [];

  submitted: boolean = false;

  userInitializeFormGroup : UserLevelFiltersModel = new UserLevelFiltersModel();
  // HealthFacilityDepartment Form Groupn
  healthFacilityDepartmentForm = new FormGroup({
    ProvinceId:new FormControl(this.userInitializeFormGroup.ProvinceId),
    DivisionId:new FormControl(this.userInitializeFormGroup.DivisionId),
    TehsilId:new FormControl(this.userInitializeFormGroup.DistrictId ),
    DistrictId:new FormControl(this.userInitializeFormGroup.TehsilId),
    HealthFacilityId:new FormControl(this.userInitializeFormGroup.HealthFacilityId, Validators.required),
    HfDepartmentId: new FormControl(),
    DepartmentLookupId: new FormControl(),
    SectionIds: new FormControl([]),
    IsActive: new FormControl(true),
  });

  formInitialValues:any = {};

  loading: boolean = false;

  loadLazyTimeout: any;


  lazyItems: any[] = [];

  filterModel: HealthFacilityDepartmentFilter = new HealthFacilityDepartmentFilter();

  loginUsePermissions: any = {};
  showDeleteListItem : boolean = true;
  ShowSync: boolean = false;
  loginUser: any = {};
  //#endregion

  // #region Constructor

  constructor
  (
    private _healthFacilityDepartmentService: HealthFacilityDepartmentService,
    private _healthFacilityDepartmentSectionService: HealthFacilityDepartmentSectionService,
    private _departmentService: DepartmentService,
    private _sectionService: SectionService,
    private _authService:AuthService,
    private _localService:LocalService,
    private _commonService:CommonService
  )
  {
    
  }

  ngOnInit(): void {

    this.cols = [
      { field: 'HealthFacilityName', header: 'HealthFacility' },
      { field: 'DepartmentName', header: 'Department' },
      { field: 'IsActive', header: 'Active' }
    ];

    this.loginUser = this._authService.user;

    this.getAllHfDepartmentsWithSections(this.filterModel);
    // this.getAllHealthFacility();

    this.formInitialValues = this.healthFacilityDepartmentForm.value;
    this.getAllLocations();
    this.loginUsePermissions = this._authService.getPermissionsByUrl(window.location.pathname);
    this.showDeleteListItem = this.loginUsePermissions.CanDelete;

    let loginUser = this._authService.getLoginUser();
    let isHfAdmin = loginUser.UserRoleList.find((x:any) => x.ShortName == 'HF Admin');
    if(isHfAdmin && this.loginUser.IsOffline)
      this.ShowSync = true;
  }

  //#endregion

  // #region CUD Operations

  saveHealthFacilityDepartment() {
    this.submitted = true;

    if (this.healthFacilityDepartmentForm.valid)
    {
        this.healthFacilityDepartment = this.healthFacilityDepartmentForm.value as HealthFacilityDepartment;
        this._healthFacilityDepartmentService.create(this.healthFacilityDepartment).subscribe(data => {

            this.healthFacilityDepartmentDialog = false;
            this.healthFacilityDepartment = {};
            this.healthFacilityDepartmentForm.reset(this.formInitialValues);
            this.getAllHfDepartmentsWithSections(this.filterModel);
        });
    }
  }

  //#endregion

  // #region Read Operations


  get hfDepartmentFormControl() {
    return this.healthFacilityDepartmentForm.controls;
  }

  paginate(event:any)
  {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.filterModel.PageNumber = event.page + 1;
    this.filterModel.PageSize = event.rows;
    this.getAllHfDepartmentsWithSections(this.filterModel);
  }

  getAllDepartments(): void {
    this._departmentService.get().subscribe((data:any) => this.departments = data);
  }

  // getAllLocations() {

  //   this._healthFacilityDepartmentService.getAllLocations().subscribe((data: any) => {
  //     this.allLocations = data;
  //   });
  // }

  getAllLocations() {
    
    if(!this._localService.getValue('alllocations'))
    {
        this._commonService.getAllLocations().subscribe((data: any) => {
            this._localService.setValue('alllocations',data);
            this.allLocations = data;
            // this.provinceData = data.ProvinceDropdown;
            // this.tehsilsData = data.TehsilDropdown;
            // if(this.loginUserDetail.HealthFacilityId)
            //     this.getdepartments(this.loginUserDetail.HealthFacilityId);
            // else
            //     this.getdepartments();
        });
    }
    else
    {
        this.allLocations = this._localService.getValue('alllocations');
        // this.provinceData = this.allLocations.ProvinceDropdown;
        // this.tehsilsData = this.allLocations.TehsilDropdown;


        // if(this.loginUserDetail.HealthFacilityId)
        //     this.getdepartments(this.loginUserDetail.HealthFacilityId);
        // else
        //     this.getdepartments();
    }
  }

  getSectionByDepartment(departmentId:number, isEdit?:boolean): void {
    if(!isEdit)
      this.healthFacilityDepartmentForm.controls["SectionIds"].setValue([]);

    if(departmentId != null){
      this._sectionService.getByDepartmentId(departmentId).subscribe((data:any) => this.sections = data);
    }
    else {
      this.sections = [];
    }
  }

  getSectionsByHfDepartmentId(hfDepartmentId:number): void {
    this._healthFacilityDepartmentSectionService.getByHfDepartmentId(hfDepartmentId).subscribe((data:any) => this.sections = data);
  }

  getHfDepartmentsByHealthFacility(): void {

    this._healthFacilityDepartmentService.getHfDepartmentsByHealthFacility().subscribe((data:any) => this.departments = data);
  }

  // getAllHealthFacility(): void {

  //   this._healthFacilityService.get().subscribe((data:any) => this.healthFacilities = data);
  // }

  getAllHfDepartments(): void {
    this._healthFacilityDepartmentService.get().subscribe((data:any) => this.healthFacilityDepartments = data);
  }

  getAllHfDepartmentsWithSections(filterModel:HealthFacilityDepartmentFilter): void {
    this._healthFacilityDepartmentService.getAllWithDepartment(filterModel).subscribe((data:any) => {
      this.healthFacilityDepartments = data.List;
      this.filterModel.TotalRecords = data.TotalCount;
    });
  }

  //#endregion

  // #region Helper Methods

  openNew() {
    this.healthFacilityDepartment = {};
    this.submitted = false;
    this.healthFacilityDepartmentDialog = true;
    this.healthFacilityDepartmentForm.reset(this.formInitialValues);
    this.getAllDepartments();
  }

  editSection(healthFacilityDepartment: HealthFacilityDepartment) {


    this.healthFacilityDepartment = { ...healthFacilityDepartment };
    this.healthFacilityDepartmentDialog = true;

    Object.keys(this.healthFacilityDepartmentForm.value).forEach((key:any) => {
      this.healthFacilityDepartmentForm.controls[key as keyof typeof this.healthFacilityDepartmentForm.value].setValue(healthFacilityDepartment[key as keyof typeof healthFacilityDepartment]) ;
    });

    // let healthFacilityId = this.healthFacilityDepartmentForm.controls["HealthFacilityId"].value;

    let healthFacility = this.allLocations?.HealthFacilityDropdown.filter((item: any) => item.Id === this.healthFacilityDepartmentForm.controls["HealthFacilityId"].value);
    let tehsil = this.allLocations?.TehsilDropdown.filter((item: any) => item.Id === healthFacility[0].ParentId);
    let district = this.allLocations?.DistrictDropdown.filter((item: any) => item.Id === tehsil[0].ParentId);
    let division = this.allLocations?.DivisionDropdown.filter((item: any) => item.Id === district[0].ParentId);
    let province = this.allLocations?.ProvinceDropdown.filter((item: any) => item.Id === division[0].ParentId);

    let user = this._localService.getEncryptedValue('user');

    let a = parseInt(user.DistrictId ?? "0");

    if(parseInt(user.ProvinceId ?? "0") == 0)
      this.healthFacilityDepartmentForm.controls["ProvinceId"].setValue(province[0].Id);
    else
      this.healthFacilityDepartmentForm.controls["ProvinceId"].setValue(parseInt(user.ProvinceId ?? "0"));

    if(parseInt(user.DivisionId ?? "0") == 0)
      this.healthFacilityDepartmentForm.controls["DivisionId"].setValue(division[0].Id);
    else
      this.healthFacilityDepartmentForm.controls["DivisionId"].setValue(parseInt(user.DivisionId ?? "0"));

    if(parseInt(user.DistrictId ?? "0") == 0)
      this.healthFacilityDepartmentForm.controls["DistrictId"].setValue(district[0].Id);
    else
      this.healthFacilityDepartmentForm.controls["DistrictId"].setValue(parseInt(user.DistrictId ?? "0"));

    if(parseInt(user.TehsilId ?? "0") == 0)
      this.healthFacilityDepartmentForm.controls["TehsilId"].setValue(tehsil[0].Id);
    else
      this.healthFacilityDepartmentForm.controls["TehsilId"].setValue(parseInt(user.TehsilId ?? "0"));

    if(parseInt(user.HealthFacilityId ?? "0") == 0)
      this.healthFacilityDepartmentForm.controls["HealthFacilityId"].setValue(healthFacility[0].Id);
    else
      this.healthFacilityDepartmentForm.controls["HealthFacilityId"].setValue(parseInt(user.HealthFacilityId ?? "0"));


    this.getAllDepartments();
    // this.getHfDepartmentsByHealthFacility();
    this.getSectionByDepartment(this.healthFacilityDepartment.DepartmentLookupId || 0, true);
  }

  deleteSection(healthFacilityDepartment: HealthFacilityDepartment) {
      this.deleteHealthFacilityDepartmentDialog = true;
      this.healthFacilityDepartment = { ...healthFacilityDepartment };
  }

  confirmDelete() {

    this._healthFacilityDepartmentService.delete(this.healthFacilityDepartment.HfDepartmentId).subscribe((data:any) =>  {

      this.deleteHealthFacilityDepartmentDialog = false;
      // this.healthFacilityDepartments = this.healthFacilityDepartments.filter(val => val.HfDepartmentId !== this.healthFacilityDepartment.HfDepartmentId);
      this.healthFacilityDepartment = {};
      // this.getAllDepartments();
      this.getAllHfDepartmentsWithSections(this.filterModel);

    });

  }

  hideDialog() {
      this.healthFacilityDepartmentDialog = false;
      this.submitted = false;
  }

  // onGlobalFilter(table: Table, event: Event) {
  //   table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  // }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.healthFacilityDepartments.length; i++) {
        if (this.healthFacilityDepartments[i].HfDepartmentId === id) {
            index = i;
            break;
        }
    }

    return index;
  }

  onLazyLoad(event:any) {
    this.loading = true;

    if (this.loadLazyTimeout) {
        clearTimeout(this.loadLazyTimeout);
    }

    //imitate delay of a backend call
    this.loadLazyTimeout = setTimeout(() => {
        const { first, last } = event;
        const lazyItems = [...this.lazyItems];

        for (let i = first; i < last; i++) {
            lazyItems[i] = { label: `Item #${i}`, value: i };
        }

        this.lazyItems = lazyItems;
        this.loading = false;
    }, Math.random() * 1000 + 250);
  }

  mapWithHfDepartmentSection(hfDepartmentObj:HealthFacilityDepartment,sectionId:number)
  {
    let hfDepartmentSectionObj:HealthFacilityDepartmentSection = {};
    hfDepartmentSectionObj.DepartmentId =  hfDepartmentObj.DepartmentLookupId;
    hfDepartmentSectionObj.HfDepartmentId =  hfDepartmentObj.HfDepartmentId;
    hfDepartmentSectionObj.SectionId = sectionId;
    hfDepartmentSectionObj.IsActive = hfDepartmentObj.IsActive;
    return hfDepartmentSectionObj;
  }
  onSubmit(){
    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;
     
    if(this.filterModel.SearchString==""){
        delete this.filterModel.SearchString;
        this.getAllHfDepartmentsWithSections(this.filterModel);
    } else {
    this.getAllHfDepartmentsWithSections(this.filterModel);
    }
}
  //#endregion

}

