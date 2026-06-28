import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PatientsService } from 'src/app/patient/patients.service';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit {

    //#region Global Variables
     @Input() displayGlobalSearch: boolean = false;
     @Input() isPatientSelected: boolean = false;
     @Output() selectedPatientObj = new EventEmitter<any>();
     @Output() showCheckoutDialog = new EventEmitter<boolean>();
     SearchString:any;
     patientQueueDataList: any[] = [];

    //#endregion

    //#region Constructor
  constructor(
    public _patientsService: PatientsService,
            ) { }

  ngOnInit(): void {
    
  }
    //#endregion

    //#region CRUD
  getGlobalSearch(){

    if(this.SearchString)
    {
        this._patientsService.getGlobalQue(this.SearchString).subscribe((data:any)=>{
            if(data){

               this.patientQueueDataList=data;
            }
        })
    }
    else{
        this.patientQueueDataList = []
    }

  }
    //#endregion

    //#region Helper Methods
    opendailogue(){
      if(this.isPatientSelected)
        this.showCheckoutDialog.emit(true);
      else
        this.displayGlobalSearch = true;
    }
    closedailogue(){
        this.displayGlobalSearch = false;
        this.patientQueueDataList = []
        this.SearchString='';

    }
    selectdPatient(obj:any){

        // this.selectedPatientObj = obj;
        this.selectedPatientObj.emit(obj);
        this.closedailogue();
    }
    //#endregion
}
