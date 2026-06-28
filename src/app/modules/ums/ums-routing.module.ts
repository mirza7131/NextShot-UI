import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentComponent } from './department/department.component';
import { HealthFacilityDepartmentSectionComponent } from './health-facility-department-section/health-facility-department-section.component';
import { HealthFacilityDepartmentComponent } from './health-facility-department/health-facility-department.component';
import { HealthFacilityStationComponent } from './health-facility-station/health-facility-station.component';
import { HealthFacilityComponent } from './health-facility/health-facility.component';
import { MenuComponent } from './menu/menu.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { ProfileTypeComponent } from './profile-type/profile-type.component';
import { ProfileComponent } from './profile/profile.component';
import { RoleComponent } from './role/role.component';
import { SectionComponent } from './section/section.component';
import { UserComponent } from './user/user.component';
import { ErrorLogComponent } from './error-log/error-log.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserFeedbackComponent } from './user-feedback/user-feedback.component';
import { HealthFacilityConfigurationComponent } from './health-facility-configuration/health-facility-configuration.component';



const routes: Routes = [
  {
    path:'',
    component: UserComponent
  },
  {
    path:'profiletype',
    component: ProfileTypeComponent
  },
  {
    path:'profile',
    component: ProfileComponent
  },
  {
    path:'menu',
    component: MenuComponent
  },
  {
    path:'role',
    component: RoleComponent
  },
  {
    path:'user',
    component: UserComponent
  },
  {
    path:'department',
    component: DepartmentComponent
  },
  {
    path:'section',
    component: SectionComponent
  },
  {
    path:'healthfacility',
    component: HealthFacilityComponent
  },
  {
    path:'healthfacilityconfigurations',
    component: HealthFacilityConfigurationComponent
  },
  {
    path:'healthfacilitystation',
    component: HealthFacilityStationComponent
  },
  {
    path:'healthfacilitydepartment',
    component: HealthFacilityDepartmentComponent
  },
  {
    path:'patientdetail',
    component: PatientDetailComponent
  },
  {
    path:'healthfacilitydepartmentsection',
    component: HealthFacilityDepartmentSectionComponent
  },
  {
    path:'changepassword',
    component: ChangePasswordComponent
  },
  {
    path:"userfeedback",
    component:UserFeedbackComponent
  }
  // {
  //   path:'healthfacilitydepartmentsection',
  //   component: HealthFacilityDepartmentSectionComponent
  // }
  ,
  {
    path:'errorlog',
    component: ErrorLogComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UmsRoutingModule { }
