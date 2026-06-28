import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { DetailsComponent } from './details/details.component';
import { TabViewModule } from 'primeng/tabview';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { MegaMenuModule } from 'primeng/megamenu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';
import { ScruitnyapplicationsComponent } from './scruitnyapplications/scruitnyapplications.component';
import { BadgeModule } from 'primeng/badge';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NonNegativeNumberDirective } from 'src/app/Directives/non-negative-number-directive';
import { EmailValid } from 'src/app/Directives/email-valid';
import { EmptySpaceOnlyDuplicate } from 'src/app/Directives/empty-space-only-duplicate';
import { PanelModule } from 'primeng/panel';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        DashboardsRoutingModule,
        TabViewModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
	    BreadcrumbModule,
	    MenubarModule,
	    TabMenuModule,
	    StepsModule,
	    TieredMenuModule,
	    ContextMenuModule,
	    MegaMenuModule,
	    InputTextModule,
        InputMaskModule,
        DropdownModule,
        DialogModule,
        FileUploadModule,
        ToastModule,
        RadioButtonModule,
        CalendarModule,
        InputSwitchModule,
        CheckboxModule,
        InputTextareaModule,
        ImageModule,
        ToolbarModule,
        BadgeModule,
        RippleModule,
        ConfirmPopupModule,
        ConfirmDialogModule,
        PanelModule
    ],
    declarations: [DashboardComponent, 
        DetailsComponent,
        ScruitnyapplicationsComponent,
        EmptySpaceOnlyDuplicate]
})


export class DashboardModule { }
