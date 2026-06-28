import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { HealthFacility } from './health-facility';
import { HealthFacilityService } from './health-facility.service';
import { HealthFacilityFilter } from './health-facility-filter';


@Component({
  selector: 'app-health-facility',
  templateUrl: './health-facility.component.html',
  styleUrls: ['./health-facility.component.scss']
})
export class HealthFacilityComponent implements OnInit {

  //#region Class Fields & Propertities

  cols: any[] = [];

  items: any[] = [];

  healthFacilityDialog: boolean = false;

  deleteHealthFacilityDialog: boolean = false;

  deleteDepartmentsDialog: boolean = false;

  healthFacilities: HealthFacility[] = [];

  healthFacility: HealthFacility = {};

  selectedHealthFacilities: HealthFacility[] = [];

  filterModel : HealthFacilityFilter = new HealthFacilityFilter();

  submitted: boolean = false;

  // Module Creation
  healthFacilityForm = new FormGroup({

      HealthFacilityId: new FormControl(),
      Name: new FormControl('',Validators.required),
      Code: new FormControl('',Validators.required),
      IsActive: new FormControl(true)

  });

  formInitialValues:any = {};

  //#endregion

  // #region Constructor

    constructor
    (
      private _healthFacilityService: HealthFacilityService
    )
    {

    }

    ngOnInit(): void {

        this.cols = [
            { field: 'Name', header: 'Name' },
            { field: 'Code', header: 'Code' },
            { field: 'IsActive', header: 'Active' }
        ];

        this.getAllHealthFacilities(this.filterModel);
        this.formInitialValues = this.healthFacilityForm.value;
    }

  // #endregion

  // #region CUD Operations

    saveDepartment() {

        this.submitted = true;

        if (this.healthFacilityForm.valid)
        {
            this.healthFacility = this.healthFacilityForm.value as HealthFacility;


            this._healthFacilityService.create(this.healthFacility).subscribe(data => {


                if (this.healthFacilityForm.controls['HealthFacilityId'].value)
                {
                    // @ts-ignore
                this.healthFacilities[this.findIndexById(data.HealthFacilityId)] = this.healthFacilityForm.value;
                }
                else
                {
                  this.healthFacility.HealthFacilityId = data.HealthFacilityId;
                  this.healthFacilities.push(this.healthFacility);
                }

                this.healthFacilities = [...this.healthFacilities];
                this.healthFacilityDialog = false;
                this.healthFacility = {};
                this.healthFacilityForm.reset(this.formInitialValues);

            });


        }
    }

    confirmDelete() {

        this._healthFacilityService.delete(this.healthFacility.HealthFacilityId || '').subscribe((data:any) =>  {
        this.deleteHealthFacilityDialog = false;
        this.healthFacilities = this.healthFacilities.filter(val => val.HealthFacilityId !== this.healthFacility.HealthFacilityId);
        this.healthFacility = {};

        });

    }

    // #endregion

    // #region Read Operations

    getAllHealthFacilities(filterModel:HealthFacilityFilter): void {
      // this._healthFacilityService.get().subscribe((data:any) => this.healthFacilities = data);
      this._healthFacilityService.getAllWithPagination(this.filterModel).subscribe((data:any) => {
        // this.departments = data
        this.healthFacilities = data.List;
        this.filterModel.TotalRecords = data.TotalCount;
      });
    }
    // #endregion

    // #region Helper Methods

  openNew() {
    this.submitted = false;
    this.healthFacilityDialog = true;

    this.healthFacilityForm.reset(this.formInitialValues);
  }

  hideDialog() {
    this.healthFacilityDialog = false;
    this.submitted = false;
  }

  editHealthFacility(healthFacility: HealthFacility) {

    this.healthFacility = { ...healthFacility };
    this.healthFacilityDialog = true;

    Object.keys(this.healthFacilityForm.value).forEach((key:any) => {
      this.healthFacilityForm.controls[key as keyof typeof this.healthFacilityForm.value].setValue(healthFacility[key as keyof typeof healthFacility]) ;

    });

  }

  deleteHealthFacility(healthFacility: HealthFacility) {
    this.deleteHealthFacilityDialog = true;
    this.healthFacility = { ...healthFacility };
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.healthFacilities.length; i++) {
        if (this.healthFacilities[i].HealthFacilityId === id) {
            index = i;
            break;
        }
    }

    return index;
  }

  get healthFacilityFormControl() {
    return this.healthFacilityForm.controls;
  }

  paginate(event:any)
  {
     
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.filterModel.PageNumber = event.page + 1;
    this.filterModel.PageSize = event.rows;
    this.getAllHealthFacilities(this.filterModel);
  }
  onSearch(){
    this.filterModel.PageNumber = 1;
    // this.filterModel.PageSize = 10;
    if(this.filterModel.SearchString==""){
      delete this.filterModel.SearchString;
      this.getAllHealthFacilities(this.filterModel);
    } else {
      this.getAllHealthFacilities(this.filterModel);
    }
  }
  //#endregion

}
