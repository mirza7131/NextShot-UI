import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { el } from '@fullcalendar/core/internal-common';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/Services/api.service';
import { LocalService } from 'src/app/_services/local.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MenuService } from 'src/app/modules/ums/menu/menu.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ConfigService } from 'src/config/config.service';
import { environment } from 'src/environments/environment';
import { AuthUtils } from 'src/app/core/auth/auth.utils';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    providers: [MessageService],
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {
    valCheck: string[] = ['remember'];
    password!: string;
    login: any = {};
    loading = false;
    currentUsrer: any = {};
    IsSearch: boolean;
    signInForm!: UntypedFormGroup;
    tempResponse: any;
    LogInCheckDailog: boolean;
    otpDialog: boolean;
    constructor(public layoutService: LayoutService,
        private configService: ConfigService,
         private apiService: ApiService,
         private router: Router, 
         private _authService: AuthService,
         private _menuService: MenuService,
         private _localService: LocalService,
         private _activatedRoute: ActivatedRoute,
         private _router: Router,
         private _formBuilder: UntypedFormBuilder,
         private messageService: MessageService) { }


    ngOnInit() {
        debugger
        let a = 'asddas'
        debugger
        // document.domain = "hisdu.com";
        // console.log("Domains: ", document.cookie);



        this.signInForm = this._formBuilder.group({
            Cnic: ['', [Validators.required]],
            Password: ['', Validators.required],
            rememberMe: [false]
        });

        if (environment.production) {
            localStorage.setItem('isValidOTPEntered', 'false');
        }

        if (localStorage.getItem('user') && this._authService.accessToken && !AuthUtils.isTokenExpired(this._authService.accessToken)) {
            this.otpDialog = true;
            this.tempResponse = this._localService.getEncryptedValue('user')
            if (environment.production) {
               // this.getOtp(this.tempResponse);
            } else {
                this.routeToNextScreen();
            }
        }

        
    }


    // SignIn()
    // {
    //    this.loading = true;
    //     this.login.Username = this.login.CNIC;
    //     this.login.Username = this.login.Username.replace("-", '');
    //     this.apiService.post('Authentication', 'Authenticate', this.login).subscribe(response => {
    //         debugger

    //         console.log("response=>",response)
    //         if(response.status != undefined && response.status == false)
    //         {
    //             this.showErrorViaToast("Error", response.message)
    //             this.loading = false;
    //             return;
    //         }
    //         if(response.status)
    //         {
    //             debugger
    //             this.loading = false;
    //             this.showSuccessViaToast("Success", response.message)
    //             this.currentUsrer = response.data;

    //             localStorage.setItem('response', JSON.stringify(response.data));
    //             localStorage.setItem('accessToken', response.data.Token);
    //             localStorage.setItem('token', response.data.Token);
    //             localStorage.setItem('username', response.data.Username);
    //             localStorage.setItem('roles', JSON.stringify(response.data.UserRoleList));
    //             localStorage.setItem('email', response.data.Email);
    //             localStorage.setItem('userId', response.data.UserId);

    //             let token = response.data.Token;
    //             debugger
    //             // document.cookie = "token=" + response.data.Token + "; path=/; domain=hisdu.com;";
    //             // window.postMessage({ type: "setToken", token }, "http://hisdu.com");

                
                
    //             var role = response.data.UserRoleList.filter(item => item.Name === "Admin" || item.Name === "Scrutiny" || item.Name === "Super Admin");
                
    //             if(role != undefined &&  role !=null && role.length > 0)
    //             {

    //                 debugger
    //                 if(role[0].Name == "Super Admin")
    //                     {
    //                         this.router.navigate(['/dashboard']);
    //                     }
    //                 if(role[0].Name == "Admin")
    //                 {
    //                     this.router.navigate(['/dashboard']);
    //                 }
    //                 else if(role[0].Name == "Scrutiny")
    //                 {
    //                     this.router.navigate(['/dashboard/scrutiny']);
    //                 }
    //                 else
    //                 {
    //                     this.apiService.get('Application', 'CheckApplication', {username: this.currentUsrer.UserName}).subscribe(response => {
    //                         if(response != null && response != undefined)
    //                         {
    //                             this.router.navigate(['/Inbox']);
    //                             return;
    //                         }
    //                         else
    //                         {
    //                             this.router.navigate(['/application']);
    //                             return;
    //                         }
    //                     },
    //                     (error: any) => {
    //                         debugger
    //                         this.loading = false;
    //                         this.showErrorViaToast("Error", "Something Went Wrong !")        
    //                     });

    //                     this.router.navigate(['/application']);
    //                 }
    //             }
    //             else
    //             {
    //                 this.apiService.get('Application', 'CheckApplication', {username: this.currentUsrer.UserName}).subscribe(response => {
    //                     debugger
    //                     if(response != null && response != undefined)
    //                     {
    //                         this.router.navigate(['/application/Inbox']);
    //                         return;
    //                     }
    //                     else
    //                     {
    //                         this.router.navigate(['/application']);
    //                         return;
    //                     }
    //                 },
    //                 (error: any) => {
    //                     debugger
    //                     this.loading = false;
    //                     this.showErrorViaToast("Error", "Something Went Wrong !")        
    //                 });
                    
                    
                   
                    
    //             }
                
               

                

    //         }
    //         if(response.data.status == false)
    //         {
    //             this.loading = false;
    //             this.showErrorViaToast("Error", response.data.message)
    //            return;

    //         }
            
    //     },(error: any) => {
    //         // Handle other types of errors (e.g., network errors)
    //         this.loading = false;
    //         this.showErrorViaToast("Error", "Something Went Wrong !")        
    //     });
    // }



    SignIn(): void {
        debugger
        this.IsSearch = true;
        this.loading = true;

        if (this.signInForm.invalid) {
            return;
        }
        debugger
        // this.signInForm.disable();
        this._authService.signIn(this.signInForm.value)
       
            .subscribe(
                async (response) => {
                 //   this.tempResponse = structuredClone(response);
                    this.tempResponse = response;
                    debugger        
                    // if (environment.production) {
                    //   //  this.getOtp(response);
                    // } else {
                    //     this.routeToNextScreen();
                    // }
                  //  this.getAllUserPermissions();
                   // this.router.navigate(['/dashboard']);






                   console.log("response=>",response)
                   if(response.status != undefined && response.status == false)
                   {
                       this.showErrorViaToast("Error", response.message)
                       this.loading = false;
                       return;
                   }
                   if(response.status)
                   {
                       debugger
                       this.loading = false;
                       this.showSuccessViaToast("Success", 'Anthentication Successfull')
                       this.currentUsrer = response;
       
                       localStorage.setItem('responseData', JSON.stringify(response));
                     // this._authService.user(response);


                      // localStorage.setItem('accessToken', response.Token);
                       localStorage.setItem('token', response.Token);
                       localStorage.setItem('username', response.Username);
                       localStorage.setItem('roles', JSON.stringify(response.UserRoleList));
                       localStorage.setItem('email', response.Email);
                       localStorage.setItem('userId', response.UserId);
       
                       let token = response.Token;
                       debugger
                       // document.cookie = "token=" + response.data.Token + "; path=/; domain=hisdu.com;";
                       // window.postMessage({ type: "setToken", token }, "http://hisdu.com");
       
                       
                       
                       var role = response.UserRoleList.filter(item => item.Name === "Admin" || item.Name === "Scrutiny" || item.Name === "Super Admin");
                       
                       if(role != undefined &&  role !=null && role.length > 0)
                       {
       
                           debugger
                           if(role[0].Name == "Super Admin")
                               {
                                   this.router.navigate(['/dashboard']);
                               }
                           else if(role[0].Name == "Admin")
                           {
                               this.router.navigate(['/dashboard']);
                           }
                           else if(role[0].Name == "Scrutiny")
                           {
                               this.router.navigate(['/dashboard/scrutiny']);
                           }
                           else
                           {
                            //    this.apiService.get('Application', 'CheckApplication', {username: this.currentUsrer.UserName}).subscribe(response => {
                            //        if(response != null && response != undefined)
                            //        {
                            //            this.router.navigate(['/Inbox']);
                            //            return;
                            //        }
                            //        else
                            //        {
                            //            this.router.navigate(['/application']);
                            //            return;
                            //        }
                            //    },
                            //    (error: any) => {
                            //        debugger
                            //        this.loading = false;
                            //       // this.showErrorViaToast("Error", "Something Went Wrong !")        
                            //    });
       
                               this.router.navigate(['/application']);
                           }
                       }
                       else
                       {
                        //    this.apiService.get('Application', 'CheckApplication', {username: this.currentUsrer.UserName}).subscribe(response => {
                        //        debugger
                        //        if(response != null && response != undefined)
                        //        {
                        //            this.router.navigate(['/application/Inbox']);
                        //            return;
                        //        }
                        //        else
                        //        {
                        //            this.router.navigate(['/application']);
                        //            return;
                        //        }
                        //    },
                        //    (error: any) => {
                        //        debugger
                        //        this.loading = false;
                        //     //   this.showErrorViaToast("Error", "Something Went Wrong !")        
                        //    });
                           
                           
                        this.router.navigate(['/dashboard']);
                           
                       }
                       
                      
       
                       
       
                   }
                   if(response.status == false)
                   {
                       this.loading = false;
                       this.showErrorViaToast("Error", response.message)
                      return;
       
                   }
                   
               },(error: any) => {
                   // Handle other types of errors (e.g., network errors)
                   this.loading = false;
                   this.showErrorViaToast("Error", "Something Went Wrong !")        
               });



    }







  
//     login(): void {
//         this.IsSearch = true

//         if (this.signInForm.invalid) {
//             return;
//         }

//         // this.signInForm.disable();
//         this._authService.signIn(this.signInForm.value)
//             .subscribe(
//                 async (response) => {
//                     this.tempResponse = structuredClone(response);
// debugger
//                     if (environment.production) {
//                         this.getOtp(response);
//                     } else {
//                         this.routeToNextScreen();
//                     }
//                     this.getAllUserPermissions();

//                 }

//             );

//     }


async routeToNextScreen() {
    localStorage.setItem('isValidOTPEntered', 'true');
    if (this.tempResponse.data.IsDoctor) {
        if (this.tempResponse.data.DepartmentId == null || this.tempResponse.data.SectionId == null) {
            this.LogInCheckDailog = true;
            this._authService.signOut();
            // this.signInForm.enable();
            return
        }
    }
    if (this.tempResponse.data.UserRoleList?.length > 0) {
        const data = await this._menuService.getModulesListByRoleId(this.tempResponse.data.UserRoleList[0].RoleId).toPromise();

        let dashboardModuel;

        dashboardModuel = data.filter((item: any) => item.Name.toLowerCase().includes('dashboard'));

        let redirectURL = '';

        // if(dashboardModuel.length > 0 && dashboardModuel[0].Url)
        //     redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || dashboardModuel[0].Url;
        // else
        redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/';

        this._router.navigate([redirectURL]);
    }
}


getAllUserPermissions() {
    if (!this._localService.getValue('userPermissions')) {
        this._menuService.getAllUserPermissions().subscribe(data => {
            localStorage.setItem('userPermissions' , JSON.stringify(data))
            this._localService.setValue('userPermissions' , data)
        });
    }
}


    showInfoViaToast(summary: string, detail: string) {
        this.messageService.add({ key: 'tst', severity: 'info', summary, detail });
     }
    
      showWarnViaToast(summary: string, detail: string) {
        this.messageService.add({ key: 'tst', severity: 'warn', summary, detail });
      }
    
      showErrorViaToast(summary: string, detail: string) {
        this.messageService.add({ key: 'tst', severity: 'error', summary, detail });
      }
    
      showSuccessViaToast(summary: string, detail: string) {
        this.messageService.add({ key: 'tst', severity: 'success', summary, detail });
      }

    

}
