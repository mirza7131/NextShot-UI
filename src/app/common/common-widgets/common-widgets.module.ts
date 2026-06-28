import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import {InputMaskModule} from 'primeng/inputmask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DateFilterWidgetComponent } from './date-filter-widget/date-filter-widget.component';
import { UserLevelFilterWidgetComponent } from './user-level-filter-widget/user-level-filter-widget.component';
import { UserListDropdownWidgetComponent } from './user-list-dropdown-widget/user-list-dropdown-widget.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { CnicWidgetComponent } from './cnic-widget/cnic-widget.component';
import { MobileNoWidgetComponent } from './mobile-no-widget/mobile-no-widget.component';
import { MrNoWidgetComponent } from './mr-no-widget/mr-no-widget.component';
import { ImageWidgetComponent } from './image-widget/image-widget.component';
import {DialogModule} from 'primeng/dialog';
import { GlobalSearchComponent } from './global-search/global-search.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { UserLevelDashboardFiltersComponent } from './user-level-dashboard-filters/user-level-dashboard-filters.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonFilterComponent } from './radio-button-filter/radio-button-filter.component';
import { RadioButtonModule } from 'primeng/radiobutton';




@NgModule({
  declarations: [
    UserLevelFilterWidgetComponent,
    DateFilterWidgetComponent,
    UserListDropdownWidgetComponent,
    CnicWidgetComponent,
    MobileNoWidgetComponent,
    MrNoWidgetComponent,
    ImageWidgetComponent,
    GlobalSearchComponent,
    UserLevelDashboardFiltersComponent,
    RadioButtonFilterComponent

  ],
  imports: [
    CommonModule,
    InputTextModule,
    InputMaskModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    MultiSelectModule,
    InputMaskModule,
    DialogModule,
    ButtonModule,
    CardModule,
    TabViewModule,
    TableModule,
    BadgeModule,
    InputSwitchModule,
    RadioButtonModule
  ],
  exports: [
    UserLevelFilterWidgetComponent,
    UserListDropdownWidgetComponent,
    UserLevelDashboardFiltersComponent,
    CnicWidgetComponent,
    MobileNoWidgetComponent,
    MrNoWidgetComponent,
    GlobalSearchComponent,
    RadioButtonFilterComponent
  ]
})
export class CommonWidgetsModule { }
