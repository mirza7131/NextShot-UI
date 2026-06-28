import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { LocalService } from 'src/app/_services/local.service';
import { AuthService } from '../auth.service';
import { AuthUtils } from '../auth.utils';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    /**
     * Constructor
     */
    public loginUserDetail: any = {};
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _localService: LocalService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const isValidOTPEntered = localStorage.getItem('isValidOTPEntered');
        this.loginUserDetail = this._authService.getLoginUser();

        let permissionsList = this._localService.getValue('userPermissions');
        let redirectUrl = state.url === '/sign-out' ? '/' : state.url;



        if (isValidOTPEntered === 'false') {
            this._router.navigate(['auth'])
        }

        if (this._authService.accessToken && AuthUtils.isTokenExpired(this._authService.accessToken)) {
            localStorage.clear();
            this._router.navigate(['auth'])
        }

        if (this._authService.accessToken && !AuthUtils.isTokenExpired(this._authService.accessToken)) {
            if (state.url != '/') {

                if (this.loginUserDetail.IsUserLoginFirstTime) {
                    this._router.navigate(['/'])
                }
            }
        }


        if (permissionsList) {
            let userPermissions = permissionsList;
            let hasAccess = userPermissions.filter((x: any) => x.Url.includes(state.url));
            if (hasAccess.length > 0) {
                return this._check(redirectUrl);
            }
            else {
                this._router.navigate(['noaccess'])
            }
        }



        return this._check(redirectUrl);
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this._check('/');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param redirectURL
     * @private
     */
    private _check(redirectURL: string): Observable<boolean> {
        // Check the authentication status


        return this._authService.check()
            .pipe(
                switchMap((authenticated) => {

                    // If the user is not authenticated...
                    if (!authenticated) {
                        // Redirect to the sign-in page
                        this._router.navigate(['auth'], { queryParams: { redirectURL } });

                        // Prevent the access
                        return of(false);
                    }

                    // Allow the access
                    return of(true);
                })
            );
    }
}
