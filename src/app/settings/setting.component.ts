import { Component, OnInit } from '@angular/core';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    permission?: any;
    activeOption?: any;
}
export const ROUTES: RouteInfo[] = [
    { path: '/settings', title: 'settings.menu.system',  icon: '', class: '', permission: ['settings-general'], activeOption: true },
    { path: 'property', title: 'settings.menu.property',  icon: '', class: '', permission: ['settings-users'], activeOption: false },
    { path: 'lease', title: 'settings.menu.lease',  icon: '', class: '', permission: ['settings-users'], activeOption: false },
    { path: 'tenant', title: 'settings.menu.tenant',  icon: '', class: '', permission: ['settings-users'], activeOption: false },
    { path: 'email', title: 'settings.menu.notifications',  icon: '', class: '', permission: ['settings-users'], activeOption: false },
    { path: 'payments', title: 'settings.menu.payment',  icon: '', class: '', permission: ['settings-users'], activeOption: false },
    { path: 'user', title: 'settings.menu.users_roles',  icon: '', class: '', permission: ['settings-users'], activeOption: false }
];

@Component({
    selector: 'robi-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

    settingMenuItems: any[];


    constructor() { }

    ngOnInit() {
        this.settingMenuItems = ROUTES.filter(menuItem => menuItem);
    }

}
