import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RoleConstant } from 'src/app/core/constants/Role.constant';
import { fromTypeConstant } from 'src/app/core/constants/fromType.constants';
import { PatientsService } from 'src/app/modules/patient/patients.service';

@Component({
  selector: 'app-patient-prescription-detail-by-visit-id',
  templateUrl: './patient-prescription-detail-by-visit-id.component.html',
  styleUrls: ['./patient-prescription-detail-by-visit-id.component.scss'],
  providers: [MessageService]
})
export class PatientPrescriptionDetailByVisitIdComponent implements OnInit {

  @Input() patientVisitId?: string;
  @Input() diagnoseDialog: boolean = false;
  //#region Class Fields & Propertities

  diagnoseListData: any = [];
  msgs: Message[] = [{ severity: 'info', summary: 'Info Message', detail: 'Please print all slips for the patient and then you can close the pop up' }];
  allAreTrue: boolean = false;
  doctorReciptComponent: boolean = false;
  physioTherapydoctorReciptComponent: boolean = false;
  formTypeConstant = new fromTypeConstant();
  formType: string;
  patientDaignosedId?: string;
  loginUserDetail: any;
  public roleConstant: RoleConstant = new RoleConstant()

  //#endregion

  constructor(public _patientService: PatientsService, public _authService: AuthService) { }

  ngOnInit(): void {
    this.loginUserDetail = this._authService.getLoginUser();
    this.patientDisgnoseRecord();
  }

  patientDisgnoseRecord() {

    this._patientService.getPatientDiagnoseRecord(this.patientVisitId).subscribe((data: any) => {
      if (data && data.length > 0) {
        debugger
        this.diagnoseListData = data;
        this.diagnoseDialog = true;
        this.doctorReciptComponent = false;
        this.physioTherapydoctorReciptComponent = false;


        if (this.loginUserDetail.UserRoleList[0].ShortName == this.roleConstant.Pharmacy) {
          this.allAreTrue = this.diagnoseListData.every((obj: any) => obj.IsPrinted === true);
        } else {
          this.allAreTrue = true;
        }

        // if there is only one diagnose then open that only
        if (data.length == 1) {
          this.showDiagnoseDetail(data[0]);
        }
      }
    });


  }

  showDiagnoseDetail(item: any) {
    this.doctorReciptComponent = false;
    this.physioTherapydoctorReciptComponent = false;
    setTimeout(() => {
      if (item.PatientVisitId && item.PatientDiagnoseId) {
        this.formType = item.FormType;
        this.patientVisitId = item.PatientVisitId;
        this.patientDaignosedId = item.PatientDiagnoseId;
        // if(item.FormType == this.formTypeConstant.PhysiotherapyFormOPD)
        //   this.physioTherapydoctorReciptComponent = true;
        // else
        this.doctorReciptComponent = true;
      }
    }, 500);
  }

  physioTherapyDoctorPrint(historyobj: any) {

    this.patientVisitId = historyobj.PatientVisitId;
    this.patientDaignosedId = historyobj.PatientDiagnoseId;
    this.showPhysioTherapDoctorPrintDialog();
  }

  showPhysioTherapDoctorPrintDialog() {
    this.physioTherapydoctorReciptComponent = true;
    this.doctorReciptComponent = false;
  }

  checkAllPrintStatus() {
    this.diagnoseListData.forEach((ele: any) => {
      if (ele.isPrinted) {

      }
    });
  }
  updatePrintStatus(PatientDiagnoseId: any) {
    this.diagnoseListData.forEach((ele: any) => {
      if (ele.PatientDiagnoseId == PatientDiagnoseId) {
        ele.IsPrinted = true;
        return;
      }
    });

    this.allAreTrue = this.diagnoseListData.every((obj: any) => obj.IsPrinted === true);

  }

}
