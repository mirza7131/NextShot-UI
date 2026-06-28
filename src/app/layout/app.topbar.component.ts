import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    public user : any = {};
    
    tieredItems: MenuItem[] = [];

    constructor(public layoutService: LayoutService,private router: Router) { }

    ngOnInit()
    {
        this.user = JSON.parse(localStorage.getItem('response') || '{}');
        this.user.token = localStorage.getItem('token');
        this.user.username = localStorage.getItem('username');
        this.user.roles = localStorage.getItem('roles') || '[]';
        this.user.roles = JSON.parse(this.user.roles);
        this.user.email = localStorage.getItem('email');
        this.user.userId = localStorage.getItem('userId');

        this.tieredItems = [
            {
                label: 'Profile',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Settings',
                        icon: 'pi pi-fw pi-cog'
                    },
                    {
                        label: 'Billing',
                        icon: 'pi pi-fw pi-file'
                    }
                ]
            },
           
        ];
    }


    SignOut(){
        localStorage.clear();
        // window.location.href = '/auth/login'
        this.router.navigate(['/auth/login']);
    }
}
