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
    { path: '/settings', title: 'Appearance',  icon: '', class: '', permission: ['settings-general'], activeOption: true },
    { path: 'system', title: 'System',  icon: '', class: '', permission: ['settings-users'], activeOption: false },
    { path: 'users', title: 'Users & Roles',  icon: '', class: '', permission: ['settings-users'], activeOption: false }
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
