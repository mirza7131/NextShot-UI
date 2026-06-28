
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientRoutingModule } from './patient-routing.module';
import { PatientRegistrationsComponent } from './patient-registrations/patient-registrations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientVisitComponent } from './patient-visit/patient-visit.component';
import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { QRCodeModule } from 'angularx-qrcode';
import { ReciptModule } from '../recipt/recipt.module';
import { PanelModule } from 'primeng/panel';
import { CommonWidgetsModule } from '../common/common-widgets/common-widgets.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { UmsModule } from '../ums/ums.module';
import { TbPatientListComponent } from './tb-patient-list/tb-patient-list.component';
import { ControllsModule } from 'src/app/controlls/controlls.module';
import { PatientFingerprintComponent } from './patient-registrations/patient-fingerprint/patient-fingerprint.component';
import { IPDModule } from '../ipd/ipd.module';
import { EyeBlindnessPatientListComponent } from './eye-blindness-patient-list/eye-blindness-patient-list.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { UserLevelFilterWidgetComponent } from '../common/common-widgets/user-level-filter-widget/user-level-filter-widget.component';


@NgModule({
  declarations: [
    PatientRegistrationsComponent,
    PatientListComponent,
    PatientVisitComponent,
    TbPatientListComponent,
    PatientFingerprintComponent,
    EyeBlindnessPatientListComponent,

  ],
  imports: [
    CommonModule,
    PatientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    RadioButtonModule,
    InputTextModule,
    InputMaskModule,
    CardModule,
    CalendarModule,
    DialogModule,
    ButtonModule,
    TabViewModule,
    InputTextareaModule,
    CheckboxModule,
    TableModule,
    ToastModule,
    BadgeModule,
    PaginatorModule,
    MessageModule,
    QRCodeModule,
    ReciptModule,
    PanelModule,
    CommonWidgetsModule,
    MultiSelectModule,
    InputTextModule,
    UmsModule,
    ControllsModule,
    IPDModule,
    ConfirmPopupModule,
  ],
  exports: [PatientVisitComponent, PatientRegistrationsComponent, PatientListComponent, PatientFingerprintComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ConfirmationService,
    UserLevelFilterWidgetComponent
  ]
})
export class PatientModule { }
