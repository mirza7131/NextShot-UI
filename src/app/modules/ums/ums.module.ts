import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UmsRoutingModule } from './ums-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileTypeComponent } from './profile-type/profile-type.component';
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from '@angular/forms';
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { MessageModule } from 'primeng/message';
import {TreeTableModule} from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import { TabViewModule } from 'primeng/tabview';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import {SplitButtonModule} from 'primeng/splitbutton';
import {TieredMenuModule} from 'primeng/tieredmenu';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { InputMaskModule } from 'primeng/inputmask';
import {FileUploadModule} from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { ImageModule } from 'primeng/image';
import { DepartmentComponent } from './department/department.component';
import { SectionComponent } from './section/section.component';
import { HealthFacilityDepartmentComponent } from './health-facility-department/health-facility-department.component';
import { HealthFacilityComponent } from './health-facility/health-facility.component';
import { HealthFacilityDepartmentSectionComponent } from './health-facility-department-section/health-facility-department-section.component';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { HealthFacilityStationComponent } from './health-facility-station/health-facility-station.component';
import { CommonWidgetsModule } from "src/app/common/common-widgets/common-widgets.module";
// import { ReciptModule } from '../recipt/recipt.module';
import { TooltipModule } from 'primeng/tooltip';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
// import { CommonComponentsModule } from '../common/common-components/common-components.module';/
import { PanelModule } from 'primeng/panel';
import { ErrorLogComponent } from './error-log/error-log.component';
import { AssignableUserRolesComponent } from './user/assignable-user-roles/assignable-user-roles.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ControllsModule } from 'src/app/controlls/controlls.module';
import { UserFeedbackComponent } from './user-feedback/user-feedback.component';
import { HealthFacilityConfigurationComponent } from './health-facility-configuration/health-facility-configuration.component';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';


@NgModule({
    declarations: [
        ProfileComponent,
        ProfileTypeComponent,
        MenuComponent,
        RoleComponent,
        UserComponent,
        DepartmentComponent,
        SectionComponent,
        HealthFacilityDepartmentComponent,
        HealthFacilityComponent,
        HealthFacilityDepartmentSectionComponent,
        HealthFacilityStationComponent,
        PatientDetailComponent,
        ErrorLogComponent,
        AssignableUserRolesComponent,
        ChangePasswordComponent,
        UserFeedbackComponent,
        HealthFacilityConfigurationComponent
    ],
    imports: [
        CommonModule,
        UmsRoutingModule,
        DropdownModule,
        FormsModule,
        InputTextModule,
        InputTextareaModule,
        MultiSelectModule,
        DialogModule,
        TableModule,
        ToolbarModule,
        ToastModule,
        ButtonModule,
        InputSwitchModule,
        ReactiveFormsModule,
        MessageModule,
        TreeTableModule,
        TreeModule,
        TabViewModule,
        SplitButtonModule,
        TieredMenuModule,
        AccordionModule,
        BadgeModule,
        InputMaskModule,
        FileUploadModule,
        CalendarModule,
        ImageModule,
        SkeletonModule,
        MultiSelectModule,
        PaginatorModule,
        CommonWidgetsModule,
        // ReciptModule,
        TooltipModule,
        // CommonComponentsModule,
        PanelModule,
        ControllsModule,
        CheckboxModule,
        ConfirmPopupModule,
    ],
    exports:[ChangePasswordComponent],
    providers:[ConfirmationService]
})
export class UmsModule { }
