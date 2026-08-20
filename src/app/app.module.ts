import { NgModule } from '@angular/core';
import { CommonModule, DATE_PIPE_DEFAULT_OPTIONS, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { MessageService } from 'primeng/api';
import { AuthService } from './core/auth/auth.service';
import { CoreModule } from './core/core.module';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { UAE_DATE_PIPE_TIME_ZONE } from './shared/uae-date-time';


@NgModule({
    declarations: [
        AppComponent, NotfoundComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        ToastModule,
        CommonModule,
        CoreModule,
        MessagesModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy},
        { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: UAE_DATE_PIPE_TIME_ZONE } },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService,MessageService,AuthService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
