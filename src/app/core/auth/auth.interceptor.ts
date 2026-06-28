import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,HttpResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthUtils } from './auth.utils';
import { MessageService } from 'primeng/api';
import { map } from 'rxjs/operators';
import { MessageConstant } from '../constants/message.constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{

    omitCalls = ['Authenticate'];
    skipInterceptor = false;

    /**
     * Constructor
     */
    constructor(private _authService: AuthService, private messageService: MessageService)
    {
    }

    /**
     * Intercept
     *
     * @param req
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
      debugger
        // Clone the request object
        let newReq = req.clone();

        // Request
        //
        // If the access token didn't expire, add the Authorization header.
        // We won't add the Authorization header if the access token expired.
        // This will force the server to return a "401 Unauthorized" response
        // for the protected API routes which our response interceptor will
        // catch and delete the access token from the local storage while logging
        // the user out from the app.
        // if ( this._authService.accessToken && !AuthUtils.isTokenExpired(this._authService.accessToken) )
          if ( this._authService.accessToken )
        {
            newReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + this._authService.accessToken)
            });
        }


        // if ( localStorage.getItem('token') )
        //   {
        //       newReq = req.clone({
        //           headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
        //       });
        //   }

        // Response
        // return next.handle(newReq).pipe(
        //     catchError((error) => {

        //         // Catch "401 Unauthorized" responses
        //         if ( error instanceof HttpErrorResponse && error.status === 401 )
        //         {
        //             // Sign out
        //             this._authService.signOut();

        //             // Reload the app
        //             location.reload();
        //         }

        //         return throwError(error);
        //     })
        // );


        this.omitCalls.forEach(api => {
            if (req.url.includes(api)) {
              this.skipInterceptor = true;
            }
        });

        return next.handle(newReq)
              .pipe(
                  map((event: HttpEvent<any>) => {

                    if (event instanceof HttpResponse) {
                      if (event.status === 200)
                      {
                        if(event.body.status)
                        {
                          if(event.body.message)
                            this.messageService.add({ severity: 'success', summary: 'Successful', detail: event.body.message, life: 3000 });

                          if(event.body.pageCount)
                            return event.clone({ body: event.body })
                          else
                            return event.clone({ body: event.body.data })
                        }
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: event.body.message, life: 3000 });
                      }

                      if (event.status === 400)
                      {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: event.body.message, life: 3000 });
                      }

                    }

                    return event;

                  }),

                  catchError((error) => {
                    // Catch "401 Unauthorized" responses
                    if ( error instanceof HttpResponse && error.status === 401 )
                    {
                        // Sign out
                        this._authService.signOut();

                        // Reload the app
                        location.reload();
                    }
                    else if ( error instanceof HttpErrorResponse  && error.status === 400)
                    {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 3000 });
                    }
                    else if ( error instanceof HttpErrorResponse  && error.status === 500)
                    {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 3000 });
                    }
                    else if ( error instanceof HttpErrorResponse  && error.status === 1000)
                    {
                        this.messageService.add({ severity: 'info', summary: 'Info', detail: error.error.message, life: 3000 });
                    }
                    else
                    {
                    // Catch "400 Validation" responses
                    // if ( error.error instanceof HttpErrorResponse && error.status === 400 )
                    // {
                      this.messageService.add({ severity: 'error', summary: 'Error', detail: MessageConstant.InternalServerError, life: 3000 });

                      if(!navigator.onLine)
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: MessageConstant.CheckYourInternetConnection, life: 3000 });
                    // }
                    }

                    return throwError(error.error);
                  })
              )
    }
}
