import { Component, Input, OnInit } from '@angular/core';
import { PatientVisitFilter } from 'src/app/patient/patient-visit/patient-visit-filter';

@Component({
  selector: 'app-cnic-widget',
  templateUrl: './cnic-widget.component.html',
  styleUrls: ['./cnic-widget.component.scss']
})
export class CnicWidgetComponent implements OnInit {

  // This property is bound using its original name.
  @Input() cnicModel : any = {} // if Model
  @Input() cnicFormGroup : any;  // if Formgroup

  
  //#region Class Fields & Propertities

  //#endregion

  // #region Constructor

    constructor() { }

    ngOnInit(): void {
      
    }

  //#endregion

  // #region CUD Operations


  //#endregion

  // #region Read Operations


  //#endregion

  // #region Helper Methods
  //#endregion
}
