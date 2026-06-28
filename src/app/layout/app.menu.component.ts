import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { MenuService } from './app.menu.service';
import { LocalService } from '../_services/local.service';
export class MenuModel {
    label?:string;
    icon?:string;
    routerLink?:string[] = [];
    items?: MenuModel[] | undefined | null = [] ;
}

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    public user : any = {};
    public IsAdmin: Boolean = false;


    menu:any[] = [];

    menuModel : MenuModel[] = [];

    constructor(public layoutService: LayoutService, private router: Router,
      
        public menuService: MenuService,
        private _localService: LocalService

    ) { }

    ngOnInit() 
    {
        debugger
        this.user.token = localStorage.getItem('token');
        this.user.username = localStorage.getItem('username');
        this.user.roles = localStorage.getItem('roles') || '[]';
        this.user.roles = JSON.parse(this.user.roles);
        this.user.email = localStorage.getItem('email');
        this.user.userId = localStorage.getItem('userId');
        const targetId = "b74151c9-df31-45b0-9155-2a7b35c71159";
        const RoleId = this.user.roles.some(item => item.Id === targetId);
        const scrutinyId = "c9bdf180-a42f-4dbb-9c15-ca1b07782d4a"
        const scrutiny = this.user.roles.some(item => item.Id === scrutinyId);


        this.getAllMenuAccessByUserRole();
        this.getAllUserPermissions();


        if(RoleId)
        {
            
            this.IsAdmin = true;
            this.model = [
                {
                    label: 'Home',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }
                    ]
                },

                

                {
                    
                    label: 'UMS',
                    items: [
                        {
                            label: 'UMS', icon: 'pi pi-fw pi-plus', routerLink: ['/ums']
                        }
                    ]
                },


                {
                    label: 'LogOut',
                    items: [
                        {
                            label: 'SignOut', icon: 'pi pi-fw pi-power-off'
                        }
                    ]
                },


                // {
                //     label: 'UI Components',
                //     items: [
                //         { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                //         { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                //         { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
                //         { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
                //         { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'] },
                //         { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                //         { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                //         { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                //         { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                //         { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                //         { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                //         { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
                //         { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                //         { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                //         { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
                //     ]
                // },
                // {
                //     label: 'Prime Blocks',
                //     items: [
                //         { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
                //         { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank' },
                //     ]
                // },
                // {
                //     label: 'Utilities',
                //     items: [
                //         { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/utilities/icons'] },
                //         { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
                //     ]
                // },
                // {
                //     label: 'Pages',
                //     icon: 'pi pi-fw pi-briefcase',
                //     items: [
                //         {
                //             label: 'Landing',
                //             icon: 'pi pi-fw pi-globe',
                //             routerLink: ['/landing']
                //         },
                //         {
                //             label: 'Auth',
                //             icon: 'pi pi-fw pi-user',
                //             items: [
                //                 {
                //                     label: 'Login',
                //                     icon: 'pi pi-fw pi-sign-in',
                //                     routerLink: ['/auth/login']
                //                 },
                //                 {
                //                     label: 'Error',
                //                     icon: 'pi pi-fw pi-times-circle',
                //                     routerLink: ['/auth/error']
                //                 },
                //                 {
                //                     label: 'Access Denied',
                //                     icon: 'pi pi-fw pi-lock',
                //                     routerLink: ['/auth/access']
                //                 }
                //             ]
                //         },
                //         {
                //             label: 'Crud',
                //             icon: 'pi pi-fw pi-pencil',
                //             routerLink: ['/pages/crud']
                //         },
                //         {
                //             label: 'Timeline',
                //             icon: 'pi pi-fw pi-calendar',
                //             routerLink: ['/pages/timeline']
                //         },
                //         {
                //             label: 'Not Found',
                //             icon: 'pi pi-fw pi-exclamation-circle',
                //             routerLink: ['/notfound']
                //         },
                //         {
                //             label: 'Empty',
                //             icon: 'pi pi-fw pi-circle-off',
                //             routerLink: ['/pages/empty']
                //         },
                //     ]
                // },
                // {
                //     label: 'Hierarchy',
                //     items: [
                //         {
                //             label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
                //             items: [
                //                 {
                //                     label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
                //                     items: [
                //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                //                     ]
                //                 },
                //                 {
                //                     label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
                //                     items: [
                //                         { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
                //                     ]
                //                 },
                //             ]
                //         },
                //         {
                //             label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
                //             items: [
                //                 {
                //                     label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
                //                     items: [
                //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                //                     ]
                //                 },
                //                 {
                //                     label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
                //                     items: [
                //                         { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
                //                     ]
                //                 },
                //             ]
                //         }
                //     ]
                // },
                // {
                //     label: 'Get Started',
                //     items: [
                //         {
                //             label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
                //         },
                //         {
                //             label: 'View Source', icon: 'pi pi-fw pi-search', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank'
                //         }
                //     ]
                // },



            ]
    
        
        }
        else if(scrutiny)
        {
            this.IsAdmin = true;
            this.model = [
                {
                    label: 'In',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard/scrutiny'] }
                    ]
                },

                {
                    
                    label: 'UMS',
                    items: [
                        {
                            label: 'UMS', icon: 'pi pi-fw pi-plus', routerLink: ['/ums']
                        }
                    ]
                },

                {
                    label: 'LogOut',
                    items: [
                        {
                            label: 'SignOut', icon: 'pi pi-fw pi-power-off'
                        }
                    ]
                },
            ]
        }
        else
        {
            this.model = [
                // {
                //     label: 'UI Components',
                //     items: [
                //         { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                //         { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                //         { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
                //         { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
                //         { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'] },
                //         { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                //         { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                //         { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                //         { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                //         { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                //         { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                //         { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
                //         { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                //         { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                //         { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
                //     ]
                // },
                // {
                //     label: 'Prime Blocks',
                //     items: [
                //         { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
                //         { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank' },
                //     ]
                // },
                // {
                //     label: 'Utilities',
                //     items: [
                //         { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/utilities/icons'] },
                //         { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
                //     ]
                // },
                // {
                //     label: 'Pages',
                //     icon: 'pi pi-fw pi-briefcase',
                //     items: [
                //         {
                //             label: 'Landing',
                //             icon: 'pi pi-fw pi-globe',
                //             routerLink: ['/landing']
                //         },
                //         {
                //             label: 'Auth',
                //             icon: 'pi pi-fw pi-user',
                //             items: [
                //                 {
                //                     label: 'Login',
                //                     icon: 'pi pi-fw pi-sign-in',
                //                     routerLink: ['/auth/login']
                //                 },
                //                 {
                //                     label: 'Error',
                //                     icon: 'pi pi-fw pi-times-circle',
                //                     routerLink: ['/auth/error']
                //                 },
                //                 {
                //                     label: 'Access Denied',
                //                     icon: 'pi pi-fw pi-lock',
                //                     routerLink: ['/auth/access']
                //                 }
                //             ]
                //         },
                //         {
                //             label: 'Crud',
                //             icon: 'pi pi-fw pi-pencil',
                //             routerLink: ['/pages/crud']
                //         },
                //         {
                //             label: 'Timeline',
                //             icon: 'pi pi-fw pi-calendar',
                //             routerLink: ['/pages/timeline']
                //         },
                //         {
                //             label: 'Not Found',
                //             icon: 'pi pi-fw pi-exclamation-circle',
                //             routerLink: ['/notfound']
                //         },
                //         {
                //             label: 'Empty',
                //             icon: 'pi pi-fw pi-circle-off',
                //             routerLink: ['/pages/empty']
                //         },
                //     ]
                // },
                // {
                //     label: 'Hierarchy',
                //     items: [
                //         {
                //             label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
                //             items: [
                //                 {
                //                     label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
                //                     items: [
                //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                //                     ]
                //                 },
                //                 {
                //                     label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
                //                     items: [
                //                         { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
                //                     ]
                //                 },
                //             ]
                //         },
                //         {
                //             label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
                //             items: [
                //                 {
                //                     label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
                //                     items: [
                //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                //                     ]
                //                 },
                //                 {
                //                     label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
                //                     items: [
                //                         { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
                //                     ]
                //                 },
                //             ]
                //         }
                //     ]
                // },
                // {
                //     label: 'Get Started',
                //     items: [
                //         {
                //             label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
                //         },
                //         {
                //             label: 'View Source', icon: 'pi pi-fw pi-search', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank'
                //         }
                //     ]
                // },




                {
                    
                    label: 'Invoice',
                    items: [
                        {
                            label: 'New Invoice', icon: 'pi pi-fw pi-plus', routerLink: ['/application']
                        }
                    ]
                },
                {
                    label: 'Inbox',
                    items: [
                        {
                            label: 'Inbox', icon: 'pi pi-fw pi-folder', routerLink: ['/application/Inbox']
                        }
                    ]
                },
                // {
                //     label: 'Register',
                //     items: [
                //         {
                //             label: 'Register', icon: 'pi pi-fw pi-folder', routerLink: ['/application/RegisterCompany']
                //         }
                //     ]
                // },

                {
                    
                    label: 'UMS',
                    items: [
                        // {
                        //     label: 'UMS', icon: 'pi pi-fw pi-folder', routerLink: ['/ums']
                        // },
                        {
                            label: 'USER', icon: 'pi pi-fw pi-folder', routerLink: ['/ums/user']
                        },
                        {
                            label: 'ROLE', icon: 'pi pi-fw pi-folder', routerLink: ['/ums/role']
                        }

                        
                    ]
                },


                {
                    label: 'LogOut',
                    items: [
                        {
                            label: 'SignOut', icon: 'pi pi-fw pi-power-off'
                        }
                    ]
                }
            ];
        }
      
        

        
    
    }

    SignOut(){
        localStorage.clear();
        // window.location.href = '/auth/login'
        this.router.navigate(['/auth/login']);
    }




    getAllMenuAccessByUserRole(){
        this.menuService.getAllMenuAccessByUserRole().subscribe(data => {
            this.menu = data;
            this.menu.forEach(x =>{
                let obj = new MenuModel();
                if (x.IsModule && x.IsDisplayMenu) {
                    obj.label = x.DisplayName;
                }
                if (x.children.length > 0) {
                    x.children = x.children.sort((n1:any,n2:any) => n1.SeqNo - n2.SeqNo); // to sort menu
                    x.children.forEach((y: any) => {
                    let child = new MenuModel();
                        if (y.IsLabel) {
                            child.label = y.DisplayName;
                            if (y.children.length > 0) {
                                y.children.forEach((z: any) => {
                                    let subChild = new MenuModel();
                                    subChild.label = z.DisplayName,
                                    subChild.icon = z.Icon,
                                    subChild.routerLink?.push(z.Url),
                                    subChild.items = null
                                    child.items?.push(subChild);
                                });
                            }
                        }else{
                            child.label = y.DisplayName,
                            child.icon = y.Icon,
                            child.routerLink?.push(y.Url)
                            child.items = null
                        }
                        obj.items?.push(child);
                    });
                }
                this.menuModel.push(obj);
            })
            this.model = this.menuModel;
        });
    }

    getAllUserPermissions(){
        if (!this._localService.getValue('userPermissions')) {
            this.menuService.getAllUserPermissions().subscribe(data => {
                localStorage.setItem('userPermissions' , JSON.stringify(data))
                this._localService.setValue('userPermissions' , data)
            });
        }
    }






}
