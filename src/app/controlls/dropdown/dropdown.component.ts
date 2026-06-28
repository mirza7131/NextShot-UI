/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  @Input() control: FormControl
  @Input() label: string = ''
  @Input() disabled: boolean = false;
  @Input() placeholder: string = ''
  @Input() options: Array<{ Id: number, Name: string }> = [];
  @Input() option: string = ''
  @Input() optionLabel: string = ''
  @Input() optionValue: string = ''
  @Input() appendTo: string = 'body'
  @Input() required: boolean = false
  @Input() multiselect: boolean = false
  @Input() validate: boolean = true
  @Output() changeEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
    // this.control.patchValue({ Id: 1, Name: 'Cavitation' })
  }

  emitDropDownValue() {
    this.changeEvent.emit(this.control.value);
  }

}

