import { Component, OnInit } from '@angular/core';
import { HealthFacilityStation } from './health-facility-station'; 
import { Table } from 'primeng/table';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { HealthFacilityStationService } from './health-facility-station.service';
import { DepartmentService } from '../department/department.service';
import { HealthFacilityService } from '../health-facility/health-facility.service';
import { HealthFacility } from '../health-facility/health-facility';
import { ProfileService } from '../profile/profile.service';
import { Department } from '../department/department';
import { Section } from '../section/section';
import { SectionService } from '../section/section.service';
import { HealthFacilityDepartmentSectionService } from '../health-facility-department-section/health-facility-department-section.service';
import { HealthFacilityDepartmentSection } from '../health-facility-department-section/health-facility-department-section';
import { HealthFacilityStationFilter } from './health-facility-station-filter'; 
import { Profile } from '../profile/profile';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserLevelFiltersModel } from 'src/app/core/models/PaginatorModel';
import { LocalService } from 'src/app/_services/local.service';
import { PatientsService } from 'src/app/patient/patients.service';



@Component({
  selector: 'app-health-facility-station',
  templateUrl: './health-facility-station.component.html',
  styleUrls: ['./health-facility-station.component.scss']
})
export class HealthFacilityStationComponent implements OnInit {

  //#region Class Fields & Propertities

  cols: any[] = [];

  listStations: Profile[] = [];

  departments: Department[] = [];

  sections: Section[] = [];

  healthFacilities: HealthFacility[] = [];

  healthFacilityStationDialog: boolean = false;

  deleteHealthFacilityStationDialog: boolean = false;

  healthFacilityStations: HealthFacilityStation[] = [];

  healthFacilityStation: HealthFacilityStation = {};

  selectedHealthFacilityStations: HealthFacilityStation[] = [];

  submitted: boolean = false;

  userInitializeFormGroup : UserLevelFiltersModel = new UserLevelFiltersModel();

  // HealthFacilityDepartment Form Groupn
  healthFacilityStationForm = new FormGroup({
    HealthFacilityStationId: new FormControl(),
    StationProfileId: new FormControl('', Validators.required),
    SequenceNo: new FormControl(0),
    HealthFacilityId: new FormControl(this.userInitializeFormGroup.HealthFacilityId, Validators.required),
    IsActive: new FormControl(true),
  });

  formInitialValues:any = {};

  loading: boolean = false;

  loadLazyTimeout: any;

  lazyItems: any[] = [];

  filterModel: HealthFacilityStationFilter = new HealthFacilityStationFilter();
  
  loginUsePermissions: any = {};
  showDeleteListItem : boolean = true;
  allLocations?: any = [];
  //#endregion

  // #region Constructor

  constructor
  (
    
    private _healthFacilityStationService: HealthFacilityStationService,
    private _healthFacilityDepartmentSectionService: HealthFacilityDepartmentSectionService,
    private _departmentService: DepartmentService,
    private _sectionService: SectionService,
    private _healthFacilityService: HealthFacilityService,
    private _profileService:ProfileService,
    private _authService:AuthService,
    private _localService:LocalService,
    private _patientService:PatientsService
  )
  {
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'HealthFacilityName', header: 'HealthFacility' },
      { field: 'DepartmentName', header: 'Department' },
      { field: 'IsActive', header: 'Active' }
    ];

    // this.getAllHfDepartmentsWithDepartment();
    // this.getAllHealthFacility();
    this.getAllStationWithDetails(this.filterModel);

    this.formInitialValues = this.healthFacilityStationForm.value;

    this.loginUsePermissions = this._authService.getPermissionsByUrl(window.location.pathname);
    this.showDeleteListItem = this.loginUsePermissions.CanDelete;
    this.getAllLocations();

  }

  //#endregion

  // #region CUD Operations

  saveHealthFacilityStation() {
    this.submitted = true;
    
    if (this.healthFacilityStationForm.valid)
    {
        this.healthFacilityStation = this.healthFacilityStationForm.value as HealthFacilityStation;
        
        this._healthFacilityStationService.create(this.healthFacilityStation).subscribe(data => {

            // if (this.healthFacilityStationForm.controls['HealthFacilityStationId'].value)
            // {
            //   this.healthFacilityStation.HealthFacilityStationId = this.healthFacilityStationForm.controls['HealthFacilityStationId'].value;
            //   // @ts-ignore
            //   this.healthFacilityStations[this.findIndexById(this.healthFacilityStationForm.controls['HealthFacilityStationId'].value)] = this.healthFacilityStationForm.value;
            // }
            // else
            // {
            //   if(!data.HealthFacilityStationId)
            //     return;
            //   this.healthFacilityStation.HealthFacilityStationId = data.HealthFacilityStationId;
            //   this.healthFacilityStation.SequenceNo = data.SequenceNo;
            //   this.healthFacilityStations.push(this.healthFacilityStation);
            // }
            
            

            // this.healthFacilities.forEach(element => {
            //   if(element.HealthFacilityId == this.healthFacilityStation.HealthFacilityId)
            //     this.healthFacilityStations[this.findIndexById(this.healthFacilityStation.HealthFacilityStationId || 0)].HealthFacilityName = element.Name;
            // });

            // this.listStations.forEach(element => {

            //   if(element.ProfileId == this.healthFacilityStation.StationProfileId)
            //     this.healthFacilityStations[this.findIndexById(this.healthFacilityStation.HealthFacilityStationId || 0)].StationProfileName = element.Name;

            // });

            // // this.getAllWithDepartment();
            // this.healthFacilityStations = [...this.healthFacilityStations];
            this.healthFacilityStationDialog = false;
            this.healthFacilityStation = {};
            this.healthFacilityStationForm.reset(this.formInitialValues);
            this.getAllStationWithDetails(this.filterModel);
            
        });
    }
  }

  //#endregion

  // #region Read Operations

  get healthFacilityStationFormControl() {
    return this.healthFacilityStationForm.controls;
  }

  getAllStationWithDetails(filterModel:HealthFacilityStationFilter): void {
    this._healthFacilityStationService.getAllStationWithDetails(this.filterModel).subscribe((data:any) => {
      this.healthFacilityStations = data.List;
      this.filterModel.TotalRecords = data.TotalCount;
    });
  }

  getAllDepartments(): void {
    this._departmentService.get().subscribe((data:any) => this.departments = data);
  }

  getSectionByDepartment(departmentId:number): void {
    this._sectionService.getByDepartmentId(departmentId).subscribe((data:any) => this.sections = data);
  }

  getSectionsByHfDepartmentId(hfDepartmentId:number): void {
    this._healthFacilityDepartmentSectionService.getByHfDepartmentId(hfDepartmentId).subscribe((data:any) => this.sections = data);
  }

  // getHfDepartmentsByHealthFacility(): void {

  //   this._healthFacilityDepartmentService.getHfDepartmentsByHealthFacility().subscribe((data:any) => this.departments = data);
  // }

  // getAllHealthFacility(): void {
  //   this._healthFacilityService.get().subscribe((data:any) => this.healthFacilities = data);
  // }

  getProfileByProfileType(shortName:string)
  {
    this._profileService.getProfileByProfileType(shortName).subscribe((data:any) => { this.listStations = data;
    });
  }

  // getAllHfDepartments(): void {

  //   this._healthFacilityDepartmentService.get().subscribe((data:any) => this.healthFacilityDepartments = data);
  // }

  // getAllHfDepartmentsWithDepartment(): void {

  //   this._healthFacilityDepartmentService.getAllWithDepartment().subscribe((data:any) => this.healthFacilityDepartments = data);
  // }

  

  //#endregion

  // #region Helper Methods

  openNew() {
    this.healthFacilityStation = {};
    this.submitted = false;
    this.healthFacilityStationDialog = true;
    this.healthFacilityStationForm.reset(this.formInitialValues);
    // this.getAllHealthFacility();
    this.getProfileByProfileType('CSTSNL');
  }

  editSection(healthFacilityStation: HealthFacilityStation) {

    this.healthFacilityStation = { ...healthFacilityStation };
    this.healthFacilityStationDialog = true;

    Object.keys(this.healthFacilityStationForm.value).forEach((key:any) => {

      this.healthFacilityStationForm.controls[key as keyof typeof this.healthFacilityStationForm.value].setValue(healthFacilityStation[key as keyof typeof healthFacilityStation]) ;

    });

    // this.getAllDepartments();
    // this.getAllHealthFacility();
    this.getProfileByProfileType('CSTSNL');

    // this.getHfDepartmentsByHealthFacility();
    // this.getSectionByDepartment(this.healthFacilityDepartment.DepartmentLookupId || 0);
  }

  deleteSection(healthFacilityStation: HealthFacilityStation) {
      this.deleteHealthFacilityStationDialog = true;
      this.healthFacilityStation = { ...healthFacilityStation};
  }

  confirmDelete() {
    this._healthFacilityStationService.delete(this.healthFacilityStation.HealthFacilityStationId).subscribe((data:any) =>  {
      this.deleteHealthFacilityStationDialog = false;
      this.healthFacilityStations = this.healthFacilityStations.filter(val => val.HealthFacilityStationId !== this.healthFacilityStation.HealthFacilityStationId);
      this.healthFacilityStation = {};

    });

  }

  hideDialog() {
      this.healthFacilityStationDialog = false;
      this.submitted = false;
  }


  onGlobalFilter(table: Table, event: Event) {

    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');

    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;
    if((event.target as HTMLInputElement).value)
      this.filterModel.SearchString = (event.target as HTMLInputElement).value;
    else
      this.filterModel.SearchString = undefined;

    this.getAllStationWithDetails(this.filterModel);
  }

  findIndexById(id: any): any {
    let index = -1;
    for (let i = 0; i < this.healthFacilityStations.length; i++) {
        if (this.healthFacilityStations[i].HealthFacilityStationId === id) {
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

  paginate(event:any)
  {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.filterModel.PageNumber = event.page + 1;
    this.filterModel.PageSize = event.rows;
    this.getAllStationWithDetails(this.filterModel);
  }
  
  getAllLocations() {
    if(!this._localService.getValue('alllocations'))
    {
      this._patientService.getAllLocations().subscribe((data: any) => {

        this._localService.setValue('alllocations',data);
        this.allLocations = data;
        this.healthFacilities = this.allLocations?.HealthFacilityDropdown;

      });
    }
    else
    {
      this.allLocations = this._localService.getValue('alllocations');
      this.healthFacilities = this.allLocations?.HealthFacilityDropdown;
    }
  }

  //#endregion


}
