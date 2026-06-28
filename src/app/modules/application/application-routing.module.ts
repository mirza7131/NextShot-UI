import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './application.component';
import { InboxComponent } from './inbox/inbox.component';
import { RegisterCompanyComponent } from './register-company/register-company.component';


const routes: Routes = [
  { path: '', component: ApplicationComponent },
  { path: 'Inbox', component: InboxComponent },
  { path: 'RegisterCompany', component: RegisterCompanyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }
