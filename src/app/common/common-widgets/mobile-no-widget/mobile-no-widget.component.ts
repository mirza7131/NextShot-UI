import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mobile-no-widget',
  templateUrl: './mobile-no-widget.component.html',
  styleUrls: ['./mobile-no-widget.component.scss']
})
export class MobileNoWidgetComponent implements OnInit {

    // This property is bound using its original name.
    @Input() mobilenoModel : any = {} // if Model
    @Input() mobileNoFormGroup : any;  // if Formgroup
  
    
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
