import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mr-no-widget',
  templateUrl: './mr-no-widget.component.html',
  styleUrls: ['./mr-no-widget.component.scss']
})
export class MrNoWidgetComponent implements OnInit {

  // This property is bound using its original name.
  @Input() mrNoModel : any = {} // if Model
  @Input() mrNoFormGroup : any;  // if Formgroup

  
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
