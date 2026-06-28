import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  
  @Input() control:FormControl
  @Input() label: string = ''
  @Input() id: string;
  @Input() styles: boolean = false;
  @Output() clickEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {

    // console.log('-----------------------------------',this.label,this.control)
  }

  emitCheckboxDetail() {
    this.clickEvent.emit(this.control.value);
  }

}
