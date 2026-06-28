import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPatientHistoryComponent } from './list-patient-history/list-patient-history.component';
import { TableModule } from 'primeng/table';
import { ReciptModule } from '../../recipt/recipt.module';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientPrescriptionDetailByVisitIdComponent } from './patient-prescription-detail-by-visit-id/patient-prescription-detail-by-visit-id/patient-prescription-detail-by-visit-id.component';
import { MedicinePresciptionComponent } from './medicine-presciption/medicine-presciption.component';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { MessagesModule } from 'primeng/messages';
import { BadgeModule } from 'primeng/badge';

// import { MessageModule } from 'primeng/message';


@NgModule({
  declarations: [
    ListPatientHistoryComponent,
    PatientPrescriptionDetailByVisitIdComponent,
    MedicinePresciptionComponent,
    ConfirmationPopupComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    ReciptModule,
    DialogModule,
    RadioButtonModule,
    DropdownModule,
    InputNumberModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,
    BadgeModule
  ],
  exports: [ListPatientHistoryComponent,PatientPrescriptionDetailByVisitIdComponent,MedicinePresciptionComponent]
})
export class CommonComponentsModule { }
