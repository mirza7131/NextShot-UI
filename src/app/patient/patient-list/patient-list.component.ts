import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RoleConstant } from 'src/app/core/constants/Role.constant';
import { PaginatorModel } from 'src/app/core/models/PaginatorModel';
import { PatientVisitComponent } from '../patient-visit/patient-visit.component';
import { Patient } from '../patientmodel';
import { PatientsService } from '../patients.service';
import { PatientFilter } from './patient-filter';
import { PatientListService } from './patient-list.service';


@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  @ViewChild(PatientVisitComponent) patientVisitChild!: PatientVisitComponent;

  @Input() filterModel: any = new PatientFilter();
  @Input() showFilters: boolean = true;
   
  //#region Class Fields & Propertities

  roleConstant: RoleConstant = new RoleConstant();

  patients: Patient[] = [];

  cols:any = [];

  patientDialog: boolean = false;

  deletePatientDialog: boolean = false;

  deletePatientsDialog: boolean = false;

  submitted: boolean = false;

  patient: Patient = {};

  roles:any[] = [];

  formData: Patient = {};

  userExist:boolean = false;

  showPatientVisitDialog:boolean = false;
  showPatientVisitCnic?:string;

  // Patient Form Group
  patientForm = new FormGroup({
    PatientId: new FormControl(),
    FirstName: new FormControl('',Validators.required),
    LastName: new FormControl('',Validators.required),
    Mrno: new FormControl(),
    FullName: new FormControl(),
    GuardianName: new FormControl(),
    Cnic: new FormControl(),
    Age: new FormControl(),
    Dob: new FormControl(),
    NationalityProfileId: new FormControl(),
    PassportNo: new FormControl(),
    MotherLandProfileId: new FormControl(),
    CasteProfileId: new FormControl(),
    GenderProfileId: new FormControl(),
    BloodGroupProfileId: new FormControl(),
    MobileNo: new FormControl(),
    Emai: new FormControl(),
    Ntn: new FormControl(),
    ProvinceId: new FormControl(),
    DivisionId: new FormControl(),
    DistrictId: new FormControl(),
    TehsilId: new FormControl(),
    UnionCouncilId: new FormControl(),
    Hfmiscode: new FormControl(),
    ParmanentAddress: new FormControl(),
    TemporaryAddress: new FormControl(),
    ReligionProfileId: new FormControl(),
    MaritialStatusProfileId: new FormControl(),
    Domicile: new FormControl(),
    IsActive: new FormControl(),
  });

  formInitialValues:any = {};

  paginatorModel:PaginatorModel = new PaginatorModel();

  loginUserDetail: any = {};

  showDeleteListItem : boolean = true;

  //#endregion

  // #region Constructor
  constructor
  (
    private _patientService: PatientListService,
    public router: Router,
    public _authService: AuthService,
    private datepipe: DatePipe
  )
  {
    this.filterModel.StartDate = new Date().toJSON().slice(0,10).replace(/-/g,'-') + "T00:01:01";
    this.filterModel.EndDate = new Date().toJSON().slice(0,10).replace(/-/g,'-') + "T23:59:59";
  }

  ngOnInit(): void {

    this.cols = [
      { field: 'FirstName', header: 'Name' },
      { field: 'Email', header: 'Email' },
      { field: 'CNIC', header: 'CNIC' },
      { field: 'IsActive', header: 'Active' }
    ];
console.log("s",this.filterModel)
    this.getAllPatients(this.filterModel);
    this.formInitialValues = this.patientForm.value;
    this.loginUserDetail.permission = this._authService.getPermissionsByUrl(window.location.pathname);
    this.showDeleteListItem = this.loginUserDetail.permission.CanDelete;
  }

  //#endregion

  // #region CUD Operations

  savePatient() {

    this.submitted = true;

    if (this.patientForm.valid)
    {

      this.patient = this.patientForm.value as Patient;

      this._patientService.create(this.patient).subscribe(data => {

        if (this.patientForm.controls['PatientId'].value)
        {
          // @ts-ignore
          this.patients[this.findIndexById(this.patientForm.controls['PatientId'].value)] = this.patientForm.value;

        }
        else
        {
          this.patient.PatientId = data.PatientId;
          this.patients.push(this.patient);
        }

        this.patients = [...this.patients];
        this.patientDialog = false;
        this.patient = {};
        this.patientForm.reset(this.formInitialValues);

      });
    }
  }



  confirmDelete() {

    this.deletePatientDialog = false;

    this._patientService.delete(this.patient.PatientId || '').subscribe((data:any) =>  {

      this.patients = this.patients.filter(val => val.PatientId !== this.patient.PatientId);
      this.patient = {};
    });

  }


  //#endregion

  // #region Read Operations

  getAllPatients(filterModel:PatientFilter): void {

    this._patientService.get(this.filterModel).subscribe((data:any) => {

      this.patients = data.List;
      this.filterModel.TotalRecords = data.TotalCount;

    });

  }

  get patientFormControl() {
    return this.patientForm.controls;
  }

  //#endregion

  // #region Helper Methods

  editPatient(patient: any) {

    this.patient = { ...patient };

    this.patientDialog = true;

    Object.keys(this.patientForm.value).forEach((key:any) => {

      if(key == 'Dob')
        this.patientForm.controls['Dob'].setValue(new Date(patient[key as keyof typeof patient]));
      else
        this.patientForm.controls[key as keyof typeof this.patientForm.value].setValue(patient[key as keyof typeof patient]);

    });
  }

  deletePatient(patient: Patient) {
    this.deletePatientDialog = true;
    this.patient = { ...patient };
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.patients.length; i++) {
        if (this.patients[i].PatientId === id) {
            index = i;
            break;
        }
    }

    return index;
  }

  openNew() {

    this.submitted = false;
    this.patientDialog = true;
    this.patientForm.reset(this.formInitialValues);
  }

  hideDialog() {
    this.patientDialog = false;
    this.submitted = false;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  paginate(event:any)
  {
    this.filterModel.PageNumber = event.page + 1;
    this.filterModel.PageSize = event.rows;
    this.getAllPatients(this.filterModel);
  }

  submitFilter()
  {
    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;
    this.getAllPatients(this.filterModel);
  }

  clearFilter()
  {
    this.filterModel = new PatientFilter();
    this.getAllPatients(this.filterModel);
  }


  showPatientVisits(patient:any)
  {
    this.showPatientVisitCnic = patient.Cnic;
    this.showPatientVisitDialog = true;
  }

  //#endregion


}
