import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-radio-button-filter',
  templateUrl: './radio-button-filter.component.html',
  styleUrls: ['./radio-button-filter.component.scss']
})
export class RadioButtonFilterComponent implements OnInit {

  //#region Class Fields & Propertities
  
  @Input() selectedOption:any;
  @Input() anmonalOptions:boolean = false;

  @Input() isShowCnic:boolean = true;
  @Input() isShowMobileNo:boolean = true;
  @Input() isShowMrno:boolean = true;
  @Input() isShowBarcode:boolean = true;
  @Input() isShowBatchNumber:boolean = false;
  @Input() isShowTitle:boolean = false;
  @Input() isShowFromHealthFacility:boolean = false;

  @Output() selectedOptionEvent = new EventEmitter<any>();
  
  //#endregion

  // #region Constructor
  
  constructor() { }

  ngOnInit(): void {
  }

  //#endregion
  
  // #region Events

  onSelectOption(obj:any)
  {
    this.selectedOptionEvent.emit(obj.value);
  }

  ngOnChanges(changes: SimpleChanges) 
  {
    this.selectedOption = changes['selectedOption'].currentValue;

  }

  //#endregion

}
