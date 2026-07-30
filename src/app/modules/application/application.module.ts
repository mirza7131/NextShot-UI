import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenubarModule } from 'primeng/menubar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TabMenuModule } from 'primeng/tabmenu';
import { StepsModule } from 'primeng/steps';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MegaMenuModule } from 'primeng/megamenu';
import { InputTextModule } from 'primeng/inputtext';
import { ApplicationComponent } from './application.component';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InboxComponent } from './inbox/inbox.component';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ImageModule } from 'primeng/image';
import { NonNegativeNumberDirective } from 'src/app/Directives/non-negative-number-directive';
import { EmptySpaceOnly } from 'src/app/Directives/empty-space-only';
import { EmailValid } from 'src/app/Directives/email-valid';
import { BadgeModule } from 'primeng/badge';
import { RegisterCompanyComponent } from './register-company/register-company.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { PanelModule } from 'primeng/panel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { InventoryComponent } from './inventory/inventory.component';
import { ClubTablesComponent } from './club-tables/club-tables.component';







@NgModule({
 
  declarations: 
  [
   
    ApplicationComponent,
    InboxComponent,
    NonNegativeNumberDirective,
    EmptySpaceOnly,
    EmailValid,
    RegisterCompanyComponent,
    InventoryComponent,
    ClubTablesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,
    MultiSelectModule,
		BreadcrumbModule,
		MenubarModule,
		TabMenuModule,
		StepsModule,
		TieredMenuModule,
		MenuModule,
		ButtonModule,
		ContextMenuModule,
		MegaMenuModule,
		PanelMenuModule,
		InputTextModule,
    InputMaskModule,
    DropdownModule,
    DialogModule,
    TableModule,
    FileUploadModule,
    ToastModule,
    ConfirmDialogModule,
    RadioButtonModule,
    CalendarModule,
    InputSwitchModule,
    CheckboxModule,
    InputTextareaModule,
    ImageModule,
    ApplicationRoutingModule,
    BadgeModule,
    InputTextModule,
    ReactiveFormsModule,
    InputNumberModule,
    PanelModule,
    AutoCompleteModule,
    CardModule
 
  ]
})
export class ApplicationModule { }
