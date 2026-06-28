import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PatientsService } from 'src/app/patient/patients.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent implements OnInit {

  //#region Class Fields & Propertities
  Mrno:any = '';
  PatientData:any = {};
  ShowPatientHistory:boolean = false;
  //#endregion

  // #region Constructor
  constructor(
    private _patientService: PatientsService,
  ) { }

  ngOnInit(): void {
  }

  //#endregion

  //#region CUD Methods
  searchRecord(){
    
    this.ShowPatientHistory = false;

    this._patientService.getPatientbyMRNO(this.Mrno).subscribe(data => {

      if(data.length > 0)
      {
        this.PatientData = data[0];
        this.ShowPatientHistory = true;
      }
      else
      {
        this.PatientData = {};
        this.ShowPatientHistory = false;
      }

    });
  }
  //#endregion

  //#region Helper Methods
  
  clearRecord(){

    this.PatientData = {};
    this.ShowPatientHistory = false;
  }

  calculateAge(dob: any) {

    var ctrldob = dob == '' ? new Date() : new Date(dob) ;

    var ctrldoa = new Date(Date.now());

    var diff = new Date(ctrldoa.getTime() - ctrldob.getTime());

    return (diff.getUTCFullYear() - 1970) + ' Y ' + diff.getUTCMonth() + ' M ' + (diff.getUTCDate() - 1) + ' D ' ;
  }
  //#endregion
  
}
