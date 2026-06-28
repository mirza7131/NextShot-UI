import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DetailsComponent } from './details/details.component';
import { ScruitnyapplicationsComponent } from './scruitnyapplications/scruitnyapplications.component';


@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '', component: DashboardComponent, pathMatch: 'full'
        },
        { path: '',  component: DashboardComponent},
        { path: 'scrutiny',  component: ScruitnyapplicationsComponent},
        { path: 'details/:appId', component: DetailsComponent },
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
