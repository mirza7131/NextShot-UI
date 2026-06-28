import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderInterceptor } from './loader.interceptor';


@NgModule({
    imports  : [
        HttpClientModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true
        }
    ]
})
export class LoaderModule
{
}
