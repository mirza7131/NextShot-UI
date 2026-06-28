import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientRegistrationsComponent } from './patient-registrations/patient-registrations.component';
import { PatientVisitComponent } from './patient-visit/patient-visit.component';
import { TbPatientListComponent } from './tb-patient-list/tb-patient-list.component';
import { EyeBlindnessPatientListComponent } from './eye-blindness-patient-list/eye-blindness-patient-list.component';


const routes: Routes = [
    {
      path:'registration',
      component: PatientRegistrationsComponent
    },
    {
      path:'patientlist',
      component: PatientListComponent
    },
    {
      path:'patientvisit',
      component: PatientVisitComponent
    },
    {
      path:'tbPatientsList',
      component: TbPatientListComponent
    },
    {
      path:'EyeBlindnessPatients',
      component: EyeBlindnessPatientListComponent
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
