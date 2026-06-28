import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
// import { UserService } from 'app/core/user/user.service';
import { AuthUtils } from './auth.utils';
import { environment } from 'src/environments/environment';
import { MessageConstant } from '../constants/message.constants';
import { LocalService } from 'src/app/_services/local.service';
// import { tree } from 'd3';


@Injectable()
export class AuthService {
    private _authenticated: boolean = false;
    private authKey = '396ea9b3-d701-4370-8321-f9845d34c8f8';
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _localService: LocalService,
        // private _userService: UserService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
    */

    private getHeaders(): HttpHeaders {
        // You can add custom headers here if needed
        return new HttpHeaders({
          'Content-Type': 'application/json',
          'AuthKey': this.authKey
        });
      }

    setItemInLocalStorage(key: string, data: any) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    getItemInLocalStorage(key: string) {
        return JSON.parse(localStorage.getItem(key) || '{}');
    }

    set accessToken(token: string) {
         localStorage.setItem('accessToken', token);
       // this._localService.setEncryptedValue('accessToken', token);
    }

    get accessToken(): string {
         return localStorage.getItem('accessToken') ?? '';
       // return this._localService.getEncryptedValue('accessToken');
    }

    /**
     * Setter & getter for login user
     */
    set user(obj: any) {
       // this._localService.setEncryptedValue('response', obj);
         localStorage.setItem('response', JSON.stringify(obj));
    }

    get user(): any {
         return JSON.parse(localStorage.getItem('response') || '{}');
       // return this._localService.getEncryptedValue('response');
    }

    get userPermissions(): any {
        // return JSON.parse(localStorage.getItem('userPermissions') || '{}');
        return this._localService.getValue('userPermissions');
    }



    
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    getLoginUser() {
        return this.user;
    }

    isSuperAdmin() {
        // this.user.IsSuperAdmin = true;
        // return this.user.IsSuperAdmin;
        return true;
    }

    isAuthViaHR() {
        // return this.user.AuthViaHR;
        return true;
    }

    isUserCreationWithoutHR() {
        // return this.user.UserCreationWithoutHR;
        return true;
    }

    getPermissionsByUrl(url: string) {
        let count = 0;
        let index = 0;
        if(this.userPermissions){
            this.userPermissions.forEach(function (item: any, indexx: number) {
                if (item.Url.indexOf(url) != -1) {
                    count += 1;
                    index = indexx;
                }
            });
            if (count > 0) {
                return this.userPermissions[index];
            }
            return {};
        } else {
            return {};
        }
    }
    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { Email: string; Password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._localService.getValue('user')) {
            console.log(MessageConstant.UserAlreadyLoggedIn);
            return throwError('User is already logged in.');
        }
       
        const options = {headers: this.getHeaders() };
        return this._httpClient.post(`${environment.apiURL}/Authentication/Authenticate`, credentials, options).pipe(
            switchMap((response: any) => {
                debugger
                // Store the user in the local storage
                this.user = response;

                // Store the access token in the local storage
                this.accessToken = response.Token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                // this._userService.user = response.user;

                return of(response);

                // Return a new observable with the response

            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient.post('api/auth/sign-in-with-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                if (response.accessToken) {
                    this.accessToken = response.accessToken;
                }

                // Set the authenticated flag to true
                // this._authenticated = true;

                // Store the user on the user service
                // this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */

    signOut(): Observable<any> {
        let obj = {
          UserId: this.getLoginUser().UserId
        };
      
        return this._httpClient.post(`${environment.apiURL}/Authentication/Signout`, obj)
          .pipe(
            map((response: any) => {
              if (response) {
                localStorage.clear();
                this._authenticated = false;
                return true;
              } else {
                return false;
              }
            }),
            catchError(error => of(false))
          );
    }



    // signOut(): Observable<any> {

    //     // let userid = this.getLoginUser().UserId;
    //     let obj = {
    //         UserId:this.getLoginUser().UserId
    //     }

    //     this._httpClient.post(`${environment.apiURL}/Authentication/Signout`, obj).subscribe((response: any) => {
    //         if(response){
    //             // // Remove the user from the local storage
    //             // localStorage.removeItem('user');

    //             // // Remove the access token from the local storage
    //             // localStorage.removeItem('accessToken');

    //             // // Remove the permissions from the local storage
    //             // localStorage.removeItem('userPermissions');

    //             localStorage.clear();

    //             // Set the authenticated flag to false
    //             this._authenticated = false;

    //             // Return the observable
    //             return of(true);
    //         } else {
    //             return of(false);        
    //         }
    //     },
    //     error => {
    //         return of(false);
    //     }
    //     );

    //     // return of(res);



    //     // // Remove the user from the local storage
    //     // localStorage.removeItem('user');

    //     // // Remove the access token from the local storage
    //     // localStorage.removeItem('accessToken');

    //     // // Remove the permissions from the local storage
    //     // localStorage.removeItem('userPermissions');

    //     // localStorage.clear();

    //     // Set the authenticated flag to false
    //     // this._authenticated = false;

    //     // Return the observable
    //     // return of(true);
    // }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {

        // if (this._localService.getEncryptedValue('user')) {
            if (this._localService.getEncryptedValue('response')) {
            this._authenticated = true;
        }

        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        // return this.signInUsingToken();
        return of(true);
    }


    sendSms(userObj:any){
        return this._httpClient.post(`${environment.apiURL}/Authentication/SendSms`, userObj);
    }


    verifyOTP(Otp: number): Observable<any> {
        return this._httpClient.get<any>(`${environment.apiURL}/Authentication/VerifyOTP?Otp=${Otp}`);
    }
}
