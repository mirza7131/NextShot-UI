import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-contact-details',
  templateUrl: './patient-contact-details.component.html',
  styleUrls: ['./patient-contact-details.component.scss']
})
export class PatientContactDetailsComponent implements OnInit {

  @Input() control = this.fb.group({
    contact: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]),
    contactName: new FormControl('', [Validators.required, Validators.minLength(5)]),
    age: new FormControl(Number, [Validators.required, Validators.max(100)]),
    relation: new FormControl(null, [Validators.required])
  })
  @Input() label: string = ''
  @Input() type: string = 'text'
  @Input() placeholder: string = ''
  @Input() required: boolean = false
  @Input() readonly: boolean = false
  @Input() isMaskInput: boolean = false
  @Input() options: Array<{ Id:number, Name: string, }> = [];
  @Input() optionLabel: string = ''

  @Output() contactDetailsEvent = new EventEmitter<any>();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    console.log(',...............................', this.control.controls)
  }

  emitContactDetails() {
     
    this.contactDetailsEvent.emit(this.control.value);
  }

}
