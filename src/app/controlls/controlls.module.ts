import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ErrorMessagesComponent } from './error-messages/error-messages.component';
import { InputComponent } from './input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { PatientContactDetailsComponent } from './patient-contact-details/patient-contact-details.component';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule } from 'primeng/calendar';

import { InputTextAreaComponent } from './input-text-area/input-text-area.component';

import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadModule } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';



@NgModule({
  declarations: [
    DropdownComponent,
    ErrorMessagesComponent,
    InputComponent,
    CheckboxComponent,
    PatientContactDetailsComponent,
    RadioButtonComponent,
    CalendarComponent,
    FileUploadComponent,
    InputTextAreaComponent,
    
  ],
  imports: [
    CommonModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    InputMaskModule,
    TableModule,
    ToastModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule,
    CalendarModule,
    FileUploadModule,
    MultiSelectModule
  ],
  exports: [
    DropdownComponent,
    ErrorMessagesComponent,
    InputComponent,
    CheckboxComponent,
    PatientContactDetailsComponent,
    RadioButtonComponent,
    CalendarComponent,
    FileUploadComponent,
    InputTextAreaComponent

  ]
})
export class ControllsModule { }
