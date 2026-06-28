import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() control: FormControl
  @Input() label: string = ''
  @Input() type: string = 'text'
  @Input() placeholder: string = ''
  @Input() required: boolean = false
  @Input() readonly: boolean = false
  @Input() disabled: boolean = false
  @Input() isMaskInput: boolean = false
  @Input() maskingFormate: string = ''
  @Input() validate: boolean = true
  @Output() value_change = new EventEmitter<any>();
  @Output() onComplete = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  _onComplete(){

    this.onComplete.emit(1)
  }

  onValueChange(event: any) {
    this.value_change.emit(event.target.value)
  }

}
