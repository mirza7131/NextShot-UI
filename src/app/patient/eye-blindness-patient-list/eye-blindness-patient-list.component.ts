import { Component, Input, OnInit } from '@angular/core';
import { PatientsService } from '../patients.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { EyeBlindnessFilter } from './eye-blindness-patient-filter';
import { ExcelExportService } from './excel-export.service';
@Component({
  selector: 'app-eye-blindness-patient-list',
  templateUrl: './eye-blindness-patient-list.component.html',
  styleUrls: ['./eye-blindness-patient-list.component.scss']
})
export class EyeBlindnessPatientListComponent implements OnInit {

  
  @Input() filterModel: any = new EyeBlindnessFilter();
  eyeBlindnessPatinetData:any;
  constructor( public _patientsService: PatientsService,
    public _AuthService: AuthService,
    public datepipe: DatePipe,
    private _messageService: MessageService,
    private _excelExport: ExcelExportService,
    private readonly router: Router) { }

  ngOnInit(): void {
    this.getEyeBlindnessPatientList(this.filterModel);
  }

  getEyeBlindnessPatientList(filterModel: EyeBlindnessFilter): void {

    this._patientsService.getEyeBlindnessPatientList(filterModel).subscribe((data: any) => {

      this.eyeBlindnessPatinetData = data.List;
      this.filterModel.TotalRecords = data.TotalCount;

    });
  }


  exportToExcel(){
    this._patientsService.getExcelExportEyeBlindnessPatientList(this.filterModel).subscribe((data: any) => {

      this.eyeBlindnessPatinetData = data.List;
      this.filterModel.TotalRecords = data.TotalCount;



      this._excelExport.exportAsExcel({
        table: undefined,
        fileName: 'Eye Avastin Patient List',
        sheetName: 'Sheet 1',
        data: this.eyeBlindnessPatinetData,
      })

    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  submitFilter() {
    this.filterModel.PageNumber = 1;
    this.filterModel.PageSize = 10;
    this.getEyeBlindnessPatientList(this.filterModel);
  }

  clearFilter() {
    this.filterModel = new EyeBlindnessFilter();
    this.getEyeBlindnessPatientList(this.filterModel);
  }

  paginate(event: any) {
     
      this.filterModel.PageNumber = event.page + 1;
      this.filterModel.PageSize = event.rows;
      this.getEyeBlindnessPatientList(this.filterModel);
    }
}
