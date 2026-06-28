import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { PatientsService } from 'src/app/modules/patient/patients.service';

@Component({
  selector: 'app-list-patient-history',
  templateUrl: './list-patient-history.component.html',
  styleUrls: ['./list-patient-history.component.scss']
})
export class ListPatientHistoryComponent implements OnInit {

  // #region globalVariable
  @Input() patientId:string = "";
  historyData:any = null;
  testListData:any = [];

  patientVisitId?: string;
  patientDiagnoseId?: string = "";
  formType: string;
  reciptPatientLabTestId?: string;
  doctorReciptComponent: boolean = false;
  doctorReciptDialog: boolean = false;
  labTestDialog: boolean = false;
  pathalogyReceiptComponent: boolean = false;
  imgLink:any;
  XrayImage:boolean = false; 

  //#endregion

  // #region Constructor
  constructor(
    private _patientService: PatientsService,
  )
  {}

 

  ngOnInit(): void {
    this.getHistory();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.historyData){
      if (!this.checkForNullandUndefined(changes["patientId"].currentValue) && changes["patientId"]?.currentValue != changes["patientId"]?.previousValue)
        this.getHistory();
    }
  }

  //#endregion


  //#region CUD Methods

  getHistory() {
    this._patientService
    .getPatientHistory(this.patientId)
    .subscribe((data: any) => {
        if (data) {
          this.historyData = data;
        }
    });
  }

  
  //#endregion

  // #region Helper Methods
  patientLabTestRecord (historyobj: any) {
     
    this.hideLabTestDialog();

    this.patientVisitId = historyobj.PatientOpenVisitId;
    this._patientService.getAllTestListByVisitId(this.patientVisitId).subscribe((data: any) => {
        if (data && data.length > 0) 
        {
           
          this.testListData = data;

          this.showLabTestDialog();
          this.pathalogyReceiptComponent = false;
        }
    });
  }

  showLabTestDetail(item:any) {
    this.XrayImage = false; 
    this.pathalogyReceiptComponent = false;
    
    if(item.PatientLabTestId)
    {
      this.pathalogyReceiptComponent = true;
      this.reciptPatientLabTestId = item.PatientLabTestId;
    }
  }

  showLabTestDialog () {
    this.labTestDialog = true;
  }

  hideLabTestDialog () {
    this.labTestDialog = false;
  }

  patientPreviousRecord (historyobj: any) {
    this.patientVisitId = historyobj.PatientOpenVisitId;
    this.patientDiagnoseId = historyobj.PatientDiagnoseId;
    this.formType = historyobj.FormType;
     
    this.showDoctorPrintDialog();
  }

  showDoctorPrintDialog () {
    this.doctorReciptComponent = true;
    this.doctorReciptDialog = true;
  }

  checkForNullandUndefined(val: any) {
    if (val == null || val == 'undefined' || val == '') return true;
    else return false;
  }

  IsEmptyObj(obj: any) {
    return obj && Object.keys(obj).length === 0;
  }

  onClickXRAYResult(val:any){
     
    this.XrayImage = false; 
    this.pathalogyReceiptComponent= false;
    if(val.LabTestImage)
    this.XrayImage = true; 
    this.imgLink=val.LabTestImage
  }
  //#endregion

}
