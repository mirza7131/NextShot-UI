
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-text-area',
  templateUrl: './input-text-area.component.html',
  styleUrls: ['./input-text-area.component.scss']
})
export class InputTextAreaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.myClass = this.myClass + this._myClass;

  }



  @Input() control:FormControl
  @Input() label: string = ''
  @Input() type: string = 'text'
  @Input() rows: number;
  @Input() cols: number;
  @Input() required: boolean = false
  @Input() readonly: boolean = false
  @Input() autoResize: boolean = false
  @Input() KeyFilter: string = 'int'
  @Input() disabled: boolean = false
  @Input() _myClass: string = ''
  @Input() myClass: string = 'w100 ';

}
