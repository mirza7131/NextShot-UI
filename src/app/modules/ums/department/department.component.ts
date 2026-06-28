import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Department } from './department';
import { DepartmentService } from './department.service';
import { DepartmentFilter } from './department-filter';


@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

  //#region Class Fields & Propertities

  cols: any[] = [];

  items: any[] = [];

  departmentDialog: boolean = false;

  deleteDepartmentDialog: boolean = false;

  deleteDepartmentsDialog: boolean = false;

  departments: Department[] = [];

  department: Department = {};

  selectedDepartments: Department[] = [];

  filterModel : DepartmentFilter = new DepartmentFilter();

  submitted: boolean = false;

  // Module Creation
  departmentForm = new FormGroup({

      DepartmentLookupId: new FormControl(),
      Name: new FormControl('',Validators.required),
      DisplayName: new FormControl('',Validators.required),
      Description: new FormControl(''),
      IsActive: new FormControl(true)

  });

  formInitialValues:any = {};

  //#endregion

  // #region Constructor

    constructor
    (
      private _departmentService: DepartmentService
    )
    {

    }

    ngOnInit(): void {

        this.cols = [
            { field: 'Name', header: 'Name' },
            { field: 'Description', header: 'Description' },
            { field: 'TestPrice', header: 'TestPrice' },
            { field: 'IsActive', header: 'Active' }
        ];

        this.getAllDepartments(this.filterModel);
        this.formInitialValues = this.departmentForm.value;
    }

  // #endregion

  // #region CUD Operations

    saveDepartment() {

        this.submitted = true;

        if (this.departmentForm.valid)
        {
            this.department = this.departmentForm.value as Department;


            this._departmentService.create(this.department).subscribe(data => {


                // if (this.departmentForm.controls['DepartmentLookupId'].value)
                // {
                //     // @ts-ignore
                // this.departments[this.findIndexById(data.DepartmentLookupId)] = this.departmentForm.value;
                // }
                // else
                // {
                //   this.department.DepartmentLookupId = data.DepartmentLookupId;
                //   this.departments.push(this.department);
                // }

                // this.departments = [...this.departments];
                this.departmentDialog = false;
                this.department = {};
                this.departmentForm.reset(this.formInitialValues);
                this.getAllDepartments(this.filterModel);
            });


        }
    }

    confirmDelete() {
        this._departmentService.delete(this.department.DepartmentLookupId || '').subscribe((data:any) =>  {
          this.deleteDepartmentDialog = false;
          // this.departments = this.departments.filter(val => val.DepartmentLookupId !== this.department.DepartmentLookupId);
          this.department = {};
          this.getAllDepartments(this.filterModel);

        });
    }

    // #endregion

    // #region Read Operations

    getAllDepartments(filterModel:DepartmentFilter): void {
      // this._departmentService.get().subscribe((data:any) => this.departments = data);
      this._departmentService.getAllWithPagination(this.filterModel).subscribe((data:any) => {
        // this.departments = data
        this.departments = data.List;
        this.filterModel.TotalRecords = data.TotalCount;
      });
    }

    // #endregion

    // #region Helper Methods

  openNew() {
    this.submitted = false;
    this.departmentDialog = true;
    this.departmentForm.reset(this.formInitialValues);
  }
  hideDialog() {
    this.departmentDialog = false;
    this.submitted = false;
  }
  editDepartment(department: Department) {

    this.department = { ...department };
    this.departmentDialog = true;

    Object.keys(this.departmentForm.value).forEach((key:any) => {
      this.departmentForm.controls[key as keyof typeof this.departmentForm.value].setValue(department[key as keyof typeof department]) ;

    });

  }

  deleteDepartment(department: Department) {
    this.deleteDepartmentDialog = true;
    this.department = { ...department };
  }

  // onGlobalFilter(table: Table, event: Event) {
  //   table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  // }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.departments.length; i++) {
        if (this.departments[i].DepartmentLookupId === id) {
            index = i;
            break;
        }
    }

    return index;
  }

  get labDepartmentControl() {
    return this.departmentForm.controls;
  }

  paginate(event:any)
  {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.filterModel.PageNumber = event.page + 1;
    this.filterModel.PageSize = event.rows;
    this.getAllDepartments(this.filterModel);
  }
  onSearch(){
    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;
    if(this.filterModel.SearchString==""){
      delete this.filterModel.SearchString;
      this.getAllDepartments(this.filterModel);
    } else {
      this.getAllDepartments(this.filterModel);
    }
  }
  //#endregion

}
