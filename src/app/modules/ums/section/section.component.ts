import { Component, OnInit } from '@angular/core';
import { Section } from './section';
import { Table } from 'primeng/table';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { SectionService } from './section.service';
import { DepartmentService } from '../department/department.service';
import { SectionFilter } from './section-filter';


@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})

export class SectionComponent implements OnInit {

  //#region Class Fields & Propertities

  cols: any[] = [];

  departments: any[] = [];

  sectionDialog: boolean = false;

  deleteSectionDialog: boolean = false;

  sections: Section[] = [];

  section: Section = {};

  selectedSections: Section[] = [];

  submitted: boolean = false;

  filterModel :SectionFilter = new SectionFilter();

  
  listConsultantSections: Section[] = [];

  // Section Form Groupn
  sectionForm = new FormGroup({
    SectionLookupId: new FormControl(),
    Name: new FormControl('',Validators.required),
    DisplayName: new FormControl('',Validators.required),
    DepartmentLookupId: new FormControl('',Validators.required),
    FormType: new FormControl('',Validators.required),
    IsActive: new FormControl(true),
    IsConsultant: new FormControl(false),
    IsFilterClinic: new FormControl(false),
    MimsWardId: new FormControl(0, Validators.required),
    ConsultantSectionLookupId: new FormControl(),
  });

  formInitialValues:any = {};
  //#endregion

  // #region Constructor

  constructor
  (
    private _sectionService: SectionService,
    private _departmentService: DepartmentService
  )
  {
  }

  ngOnInit(): void {

    this.cols = [
      { field: 'Name', header: 'Name' },
      { field: 'DisplayName', header: 'Display Name' },
      { field: 'Department', header: 'Department' },
      { field: 'IsActive', header: 'Active' }
    ];

    this.getAllWithDepartment(this.filterModel);  

    // this.sectionForm.controls.FormType.patchValue('GeneralForm')
    this.formInitialValues = this.sectionForm.value;

  }

  //#endregion

  // #region CUD Operations

  saveSection() {
     
    this.submitted = true;

    if (this.sectionForm.valid)
    {
        this.section = this.sectionForm.value as Section;

        this._sectionService.create(this.section).subscribe(data => {

            if (this.sectionForm.controls['SectionLookupId'].value)
            {
              this.section.SectionLookupId = this.sectionForm.controls['SectionLookupId'].value;
              // @ts-ignore
              this.sections[this.findIndexById(this.sectionForm.controls['SectionLookupId'].value)] = this.sectionForm.value;
            }
            else
            {
              this.section.SectionLookupId = data.SectionLookupId;
              this.sections.push(this.section);
            }

            this.departments.forEach(element => {

              if(element.DepartmentLookupId == this.section.DepartmentLookupId)
                this.sections[this.findIndexById(this.section.DepartmentLookupId || '')].DepartmentName = element.Name;

            });

            // this.getAllWithDepartment();
            this.sections = [...this.sections];
            this.sectionDialog = false;
            this.section = {};
            this.sectionForm.reset(this.formInitialValues);

        });
    }
  }

  //#endregion

  // #region Read Operations

  get sectionFormControl() {

    return this.sectionForm.controls;

  }
  
  getAllspeciality(){

  }

  getAllDepartments(): void {

    this._departmentService.get().subscribe((data:any) => {
        this.departments = data
    });
  }

  getAllSections(): void {

    this._sectionService.get().subscribe((data:any) => {
        this.sections = data
    });
  }

  getAllWithDepartment(filterModel:SectionFilter): void {
    
    this._sectionService.getAllWithDepartment(this.filterModel).subscribe((data:any) => {
        
        this.sections = data.List
        this.filterModel.TotalRecords = data.TotalCount;
    });
  }

  getAllConsultantSections(): void 
  {

    this._sectionService.get().subscribe((data:any) => {
      this.listConsultantSections =  data.filter((x:any) => x.IsConsultant !== true);
    });

  }

  //#endregion

  // #region Helper Methods

  openNew() {
    this.section = {};
    this.submitted = false;
    this.sectionDialog = true;
    this.sectionForm.reset(this.formInitialValues);
    this.sectionForm.controls.FormType.patchValue('GeneralForm')
    this.getAllDepartments();
  }

  editSection(section: Section) {
    this.section = { ...section };
    this.sectionDialog = true;

    Object.keys(this.sectionForm.value).forEach((key:any) => {

      this.sectionForm.controls[key as keyof typeof this.sectionForm.value].setValue(section[key as keyof typeof section]) ;

    });

    this.getAllDepartments();
    this.getAllConsultantSections();
  }

  deleteSection(section: Section) {
      this.deleteSectionDialog = true;
      this.section = { ...section };
  }

  confirmDelete() {

    this._sectionService.delete(this.section.SectionLookupId).subscribe((data:any) =>  {

      this.deleteSectionDialog = false;
      this.sections = this.sections.filter(val => val.SectionLookupId !== this.section.SectionLookupId);
      this.section = {};
    });

  }
  hideDialog() {
      this.sectionDialog = false;
      this.submitted = false;
  }

  onGlobalFilter(table: Table, event: Event) {
    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;
    if((event.target as HTMLInputElement).value)
      this.filterModel.SearchString = (event.target as HTMLInputElement).value;
    else
      this.filterModel.SearchString = undefined;

    this.getAllWithDepartment(this.filterModel);

  }

  findIndexById(id: string): number 
  {
    let index = -1;
    for (let i = 0; i < this.sections.length; i++) {
        if (this.sections[i].SectionLookupId === id) {
            index = i;
            break;
        }
    }
    return index;
  }
  
  paginate(event:any)
  {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    this.filterModel.PageNumber = event.page + 1;
    this.filterModel.PageSize = event.rows;
    this.getAllWithDepartment(this.filterModel);
  }

  onSearch()
  {
      this.filterModel.PageNumber = 1;
      this.filterModel.PageSize = 10;
      if(this.filterModel.SearchString==""){
          delete this.filterModel.SearchString;
          this.getAllWithDepartment(this.filterModel);
      } else {
      this.getAllWithDepartment(this.filterModel);
      }
  }

  onChangeIsConsultant(event:any)
  {
    console.log(event);
  }

  //#endregion

}
