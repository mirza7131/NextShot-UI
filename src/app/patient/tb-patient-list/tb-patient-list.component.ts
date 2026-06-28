import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RoleConstant } from 'src/app/core/constants/Role.constant';
import { TbPatientFilter } from './tb-patient-filter';
import { PatientsService } from '../patients.service';
import { TbPatientContactDetailsFilter } from './tb-patient-contact-details';
import { MessageService } from 'primeng/api';
import { MessageConstant } from 'src/app/core/constants/message.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tb-patient-list',
  templateUrl: './tb-patient-list.component.html',
  styleUrls: ['./tb-patient-list.component.scss']
})
export class TbPatientListComponent implements OnInit {

  @Input() filterModel: any = new TbPatientFilter();
  @Input() tbPatientContactDetailsFilterModel: any = new TbPatientContactDetailsFilter();
  @Input() showFilters: boolean = true;
  public tbPatientContactsDialog: boolean = false;
  public tempId: string = '';

  //#region Class Fields & Propertities

  roleConstant: RoleConstant = new RoleConstant();


  tbPatient: TbPatientFilter[] = [];
  tbPatientContact: TbPatientContactDetailsFilter[] = [];

  cols: any = [];

  public loginUserDetail: any = {};
  showDeleteListItem: boolean = true;

  //#endregion

  // #region Constructor
  constructor
    (
      public _patientsService: PatientsService,
      public _AuthService: AuthService,
      public datepipe: DatePipe,
      private _messageService: MessageService,
      private readonly router: Router
    ) {
  }

  ngOnInit(): void {

     
    this.loginUserDetail = this._AuthService.getLoginUser();
    this.cols = [
      { field: 'FirstName', header: 'Name' },
      { field: 'Email', header: 'Email' },
      { field: 'CNIC', header: 'CNIC' },
      { field: 'IsActive', header: 'Active' }
    ];


    this.getTbPatientList(this.filterModel);
    this.loginUserDetail.permission = this._AuthService.getPermissionsByUrl(window.location.pathname);
    this.showDeleteListItem = this.loginUserDetail.permission.CanDelete;

  }

  getTbPatientList(filterModel: TbPatientFilter): void {

    this._patientsService.getTbPatientList(filterModel).subscribe((data: any) => {

      this.tbPatient = data.List;
      this.filterModel.TotalRecords = data.TotalCount;

    });
  }



  public getTbPatientContacts(tbPatientId: string) {
     
    this.tbPatientContactDetailsFilterModel = new TbPatientContactDetailsFilter();
    this.tbPatientContactDetailsFilterModel.PatientId = tbPatientId;
    this.tempId = tbPatientId;
    this._patientsService.getTbPatientContactList(this.tbPatientContactDetailsFilterModel).subscribe((data: any) => {
      this.tbPatientContact = data.List;
      this.tbPatientContactDetailsFilterModel.TotalRecords = data.TotalCount;
      this.tbPatientContactsDialog = true;
    });
  }

  public collectSputum(ContactId: string) {
    this._patientsService.updateSputumById(ContactId).subscribe((data: any) => {
      if (data) {
        this.getTbPatientContacts(this.tempId);
        return this._messageService.add({ severity: 'success', summary: 'Success', detail: MessageConstant.PatientSuptumUpdate, life: 3000 });
      } else {
        return this._messageService.add({ severity: 'error', summary: 'Error', detail: MessageConstant.PatientNotSuptumUpdate, life: 3000 });
      }
    });
  }


  public generateVisit(tbPatitentContact: any) {
     
    let res = this._patientsService.setTbPatientContactData(tbPatitentContact);
    if(res){
      this.router.navigate(['/patient/registration'])
    } else{
      return this._messageService.add({ severity: 'error', summary: 'Error', detail: MessageConstant.FailedToGenerateVisit, life: 3000 });
    }
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  paginate(event: any) {
     
    if (this.tbPatientContact.length > 0) {
      this.tbPatientContactDetailsFilterModel.PageNumber = event.page + 1;
      this.tbPatientContactDetailsFilterModel.PageSize = event.rows;
      this.getTbPatientContacts(this.tempId);
    } else {
      this.filterModel.PageNumber = event.page + 1;
      this.filterModel.PageSize = event.rows;
      this.getTbPatientList(this.filterModel);
    }
  }

  submitFilter() {
    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;
    this.getTbPatientList(this.filterModel);
  }

  clearFilter() {
    this.filterModel = new TbPatientFilter();
    this.getTbPatientList(this.filterModel);
  }

  cancel() {
     
    this.tbPatientContactsDialog = false
    this.tbPatientContact = []
    this.tbPatientContactDetailsFilterModel = null;

  }
}
