import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { getValidatorErrorMessage } from '../validators-utils';
@Component({
  selector: 'app-error-messages',
  templateUrl: './error-messages.component.html',
  styleUrls: ['./error-messages.component.scss']
})
export class ErrorMessagesComponent implements OnInit {
  @Input()
  control: AbstractControl
  @Input()
  label: string = ''


  constructor() { }

  ngOnInit(): void {
  }
  get errorMessage() {
    for (const validatorName in this.control?.errors) {
      if ((this.control.dirty || this.control.touched) && this.control.invalid)
        return getValidatorErrorMessage(validatorName,this.label, this?.control.errors[validatorName]);
    }
    return null;
  }

}
