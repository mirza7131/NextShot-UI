import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { DepartmentService } from '../department/department.service';
import { HealthFacilityService } from '../health-facility/health-facility.service';
import { HealthFacility } from '../health-facility/health-facility';
import { Department } from '../department/department';
import { HealthFacilityDepartmentSection } from './health-facility-department-section';
import { HealthFacilityDepartmentSectionService } from './health-facility-department-section.service';
import { Section } from '../section/section';
import { SectionService } from '../section/section.service';
import { HealthFacilityDepartment } from '../health-facility-department/health-facility-department';
import { UserLevelFiltersModel } from 'src/app/core/models/PaginatorModel';
import { HealthFacilityDepartmentSectionFilter } from './health-facility-department-section-filter';
import { HealthFacilityDepartmentService } from '../health-facility-department/health-facility-department.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LocalService } from 'src/app/_services/local.service';
import { CommonService } from 'src/app/_services/common.service';


@Component({
  selector: 'app-health-facility-department-section',
  templateUrl: './health-facility-department-section.component.html',
  styleUrls: ['./health-facility-department-section.component.scss']
})

export class HealthFacilityDepartmentSectionComponent implements OnInit {
  //#region Class Fields & Propertities

  cols: any[] = [];

  departments: Department[] = [];

  sections: any = [];
  healthFacilities: HealthFacility[] = [];

  healthFacilityDepartmentDialog: boolean = false;

  deleteHealthFacilityDepartmentDialog: boolean = false;

  healthFacilityDepartments: HealthFacilityDepartment[] = [];

  healthFacilityDepartment: any = {};

  selectedHealthFacilityDepartments: HealthFacilityDepartment[] = [];

  public allLocations?: any = [];

  submitted: boolean = false;

  userInitializeFormGroup: UserLevelFiltersModel = new UserLevelFiltersModel();

  formInitialValues: any = {};

  loading: boolean = false;

  loadLazyTimeout: any;


  lazyItems: any[] = [];

  filterModel: HealthFacilityDepartmentSectionFilter = new HealthFacilityDepartmentSectionFilter();

  loginUsePermissions: any = {};
  showDeleteListItem: boolean = true;
  // HealthFacilityDepartment Form Group
  
  healthFacilityDepartmentSectionForm = new FormGroup({
    HfDepartmentSections: this.fb.array([]),
  });
  //#endregion

  // #region Constructor

  constructor
    (
      private _healthFacilityDepartmentService: HealthFacilityDepartmentService,
      private _healthFacilityDepartmentSectionService: HealthFacilityDepartmentSectionService,
      private _departmentService: DepartmentService,
      private _sectionService: SectionService,
      private _healthFacilityService: HealthFacilityService,
      private _authService: AuthService,
      private _localService: LocalService,
      private _commonService: CommonService,
      private fb: FormBuilder,
    ) {

  }

  ngOnInit(): void {

    this.cols = [
      { field: 'HealthFacilityName', header: 'HealthFacility' },
      { field: 'DepartmentName', header: 'Department' },
      { field: 'IsActive', header: 'Active' }
    ];

    this.getAllHfDepartmentsWithSections(this.filterModel);
    // this.getAllHealthFacility();

    // this.formInitialValues = this.healthFacilityDepartmentForm.value;
    this.getAllLocations();
    this.loginUsePermissions = this._authService.getPermissionsByUrl(window.location.pathname);
    this.showDeleteListItem = this.loginUsePermissions.CanDelete;
  }

  //#endregion

  // #region CUD Operations

  saveHealthFacilityDepartment() {
    this.submitted = true;

    // if (this.healthFacilityDepartmentForm.valid) {
    //   this.healthFacilityDepartment = this.healthFacilityDepartmentForm.value as HealthFacilityDepartment;
    //   this._healthFacilityDepartmentService.create(this.healthFacilityDepartment).subscribe(data => {

    //     this.healthFacilityDepartmentDialog = false;
    //     this.healthFacilityDepartment = {};
    //     this.healthFacilityDepartmentForm.reset(this.formInitialValues);
    //     this.getAllHfDepartmentsWithSections(this.filterModel);
    //   });
    // }
  }

  //#endregion

  // #region Read Operations


  // get hfDepartmentFormControl() {
  //   return this.healthFacilityDepartmentForm.controls;
  // }

  paginate(event: any) {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.filterModel.PageNumber = event.page + 1;
    this.filterModel.PageSize = event.rows;
    this.getAllHfDepartmentsWithSections(this.filterModel);
  }

  getAllDepartments(): void {
    this._departmentService.get().subscribe((data: any) => this.departments = data);
  }

  // getAllLocations() {

  //   this._healthFacilityDepartmentService.getAllLocations().subscribe((data: any) => {
  //     this.allLocations = data;
  //   });
  // }

  getAllLocations() {

    if (!this._localService.getValue('alllocations')) {
      this._commonService.getAllLocations().subscribe((data: any) => {
        this._localService.setValue('alllocations', data);
        this.allLocations = data;
        // this.provinceData = data.ProvinceDropdown;
        // this.tehsilsData = data.TehsilDropdown;
        // if(this.loginUserDetail.HealthFacilityId)
        //     this.getdepartments(this.loginUserDetail.HealthFacilityId);
        // else
        //     this.getdepartments();
      });
    }
    else {
      this.allLocations = this._localService.getValue('alllocations');
      // this.provinceData = this.allLocations.ProvinceDropdown;
      // this.tehsilsData = this.allLocations.TehsilDropdown;
      // if(this.loginUserDetail.HealthFacilityId);
      //     this.getdepartments(this.loginUserDetail.HealthFacilityId);
      // else
      //     this.getdepartments();
    }
  }

  // getSectionByDepartment(departmentId: number, isEdit?: boolean): void {
  //   if (!isEdit)
  //     this.healthFacilityDepartmentForm.controls["SectionIds"].setValue([]);

  //   if (departmentId != null) {
  //     this._sectionService.getByDepartmentId(departmentId).subscribe((data: any) => this.sections = data);
  //   }
  //   else {
  //     this.sections = [];
  //   }
  // }

  getSectionsByHfDepartmentId(hfDepartmentId: number): void {
    this._healthFacilityDepartmentSectionService.getByHfDepartmentId(hfDepartmentId).subscribe((data: any) => this.sections = data);
  }

  getHfDepartmentsByHealthFacility(): void {

    this._healthFacilityDepartmentService.getHfDepartmentsByHealthFacility().subscribe((data: any) => this.departments = data);
  }

  // getAllHealthFacility(): void {

  //   this._healthFacilityService.get().subscribe((data:any) => this.healthFacilities = data);
  // }

  getAllHfDepartments(): void {
    this._healthFacilityDepartmentService.get().subscribe((data: any) => this.healthFacilityDepartments = data);
  }

  getAllHfDepartmentsWithSections(filterModel: HealthFacilityDepartmentSectionFilter): void {
    this._healthFacilityDepartmentService.getAllWithDepartment(this.filterModel).subscribe((data: any) => {
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
    // this.healthFacilityDepartmentForm.reset(this.formInitialValues);
    this.getAllDepartments();
  }

  editSection(healthFacilityDepartment: any) {
     
    // this.healthfaciltyDepartmentSectionDetail()
      this.healthFacilityDepartment = healthFacilityDepartment ;
     this.healthFacilityDepartmentDialog = true;
     this.sections= this.healthFacilityDepartment.HfDepartmentSections;
     this.removeHealthfaciltySectionDetail();
     let control = <FormArray>this.HfDepartmentSections;
    this.sections.forEach((x:any) => {
      this.healthfaciltyDepartmentSectionDetail(x);
      // control.push(this.fb.group({
      //   contact: new FormControl(x.contact, [Validators.required, Validators.minLength(12), Validators.maxLength(12)]),
      //   contactName: new FormControl(x.contactName, [Validators.required, Validators.minLength(5),Validators.pattern('^[a-zA-Z \-\']+')]),
      //   age: new FormControl(x.age, [Validators.required, Validators.min(1), Validators.max(100)]),
      //   relation: new FormControl(x.relation, [Validators.required])
      // }));
    })
     this.healthFacilityDepartmentSectionForm.patchValue(this.sections)
     
  }
  healthfaciltyDepartmentSectionDetail(data:any){
     
    const Item = this.fb.group({
      HfDepartmentSectionId: new FormControl(data.HfDepartmentSectionId),
      HfDepartmentId: new FormControl(data.HfDepartmentId),
      SectionLookupId: new FormControl(data.SectionLookupId),
      SectionName: new FormControl(data.SectionName),
      VitalsFloorNo: new FormControl(data.VitalsFloorNo),
      VitalsRoomNo: new FormControl(data.VitalsRoomNo),
      DoctorFloorNo: new FormControl(data.DoctorFloorNo),
      DoctorRoomNo: new FormControl(data.DoctorRoomNo),
      PharmacyFloorNo: new FormControl(data.PharmacyFloorNo),
      PharmacyRoomNo: new FormControl(data.PharmacyRoomNo),
      PathalogyFloorNo: new FormControl(data.PathalogyFloorNo),
      PathalogyRoomNo: new FormControl(data.PathalogyRoomNo),
      AlmonerFloorNo: new FormControl(data.AlmonerFloorNo),
      AlmonerRoomNo: new FormControl(data.AlmonerRoomNo),
      IsActive:new FormControl(true)
  });
  this.HfDepartmentSections.push(Item);
}

get HfDepartmentSections() {
  return this.healthFacilityDepartmentSectionForm.controls["HfDepartmentSections"] as FormArray;
}

removeHealthfaciltySectionDetail() {
  this.healthFacilityDepartmentSectionForm.controls["HfDepartmentSections"].clear();
}
  
  deleteSection(healthFacilityDepartment: HealthFacilityDepartment) {
    this.deleteHealthFacilityDepartmentDialog = true;
    this.healthFacilityDepartment = { ...healthFacilityDepartment };
  }

  confirmDelete() {

    this._healthFacilityDepartmentService.delete(this.healthFacilityDepartment.HfDepartmentId).subscribe((data: any) => {

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

  onLazyLoad(event: any) {
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

  mapWithHfDepartmentSection(hfDepartmentObj: HealthFacilityDepartment, sectionId: number) {
    let hfDepartmentSectionObj: HealthFacilityDepartmentSection = {};
    hfDepartmentSectionObj.DepartmentId = hfDepartmentObj.DepartmentLookupId;
    hfDepartmentSectionObj.HfDepartmentId = hfDepartmentObj.HfDepartmentId;
    hfDepartmentSectionObj.SectionId = sectionId;
    hfDepartmentSectionObj.IsActive = hfDepartmentObj.IsActive;
    return hfDepartmentSectionObj;
  }
  onSubmit() {
    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;
     
    if (this.filterModel.SearchString == "") {
      delete this.filterModel.SearchString;
      this.getAllHfDepartmentsWithSections(this.filterModel);
    } else {
      this.getAllHfDepartmentsWithSections(this.filterModel);
    }
  }

  saveHfDepartmentSection(data:FormGroup){
     
    this._healthFacilityDepartmentSectionService.BulkCreateOrEdit(data.value.HfDepartmentSections).subscribe((data:any)=>{
      if(data){
        this.getAllHfDepartmentsWithSections(this.filterModel)
        this.healthFacilityDepartmentDialog = false;
        this.submitted = false;
      }
    })

  }
  //#endregion

}


