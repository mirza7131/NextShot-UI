import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent  {

  @Input() control:FormControl
  @Input() name: string = ''
  @Input() label: string = ''
  @Input() value: any
  @Input() inputId: string = ''
  @Input() isDisabled: boolean;
  @Output() controlValue = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  emitControlValue() {
    this.controlValue.emit(this.control.value);
  }

}
