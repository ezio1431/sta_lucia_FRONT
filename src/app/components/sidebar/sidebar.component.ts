import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { AuthenticationService } from '../../authentication/authentication.service';
import { AuthActions } from '../../authentication/action-types';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    permission?: any;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'robi.sidebar.dashboard',  icon: 'dashboard', class: '', permission: ['dashboard-view'] },
    { path: '/landlord', title: 'robi.sidebar.dashboard',  icon: 'dashboard', class: '', permission: ['landlord'] },
    { path: '/landlords', title: 'robi.sidebar.landlords',  icon: 'people', class: '', permission: ['dashboard-view'] },
    { path: '/properties', title: 'robi.sidebar.properties',  icon: 'business', class: '', permission: ['dashboard-view'] },
    { path: '/tenants', title: 'robi.sidebar.tenants',  icon: 'people', class: '', permission: ['dashboard-view'] },
    { path: '/leases', title: 'robi.sidebar.leases',  icon: 'library_books', class: '', permission: ['dashboard-view'] },
    { path: '/utility_bills', title: 'robi.sidebar.utility-bills',  icon: 'library_books', class: '', permission: ['dashboard-view'] },
    { path: '/user-profile', title: 'sidebar.user-profile',  icon: 'person', class: '', permission: ['dashboard-view'] },
    { path: '/table-list', title: 'Table List',  icon: 'content_paste', class: '', permission: ['dashboard-view'] },
    { path: '/typography', title: 'Typography',  icon: 'library_books', class: '', permission: ['dashboard-view'] },
    { path: '/settings', title: 'robi.sidebar.setting',  icon: 'settings', class: '', permission: ['dashboard-view'] },
    { path: '/notifications', title: 'Notifications',  icon: 'notifications', class: '', permission: ['dashboard-view'] },
];

@Component({
  selector: 'robi-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
    loading = false;

  constructor(private store: Store<AppState>, private auth: AuthenticationService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

    /**
     * Logout user
     */
    logout() {
        this.loading = true;
        this.auth.logout()
            .pipe(
                tap(
                user => {
                    this.loading = false;
                    this.store.dispatch(AuthActions.actionLogout());
                }
            ))
            .subscribe(
                () => {},
                (error) => {
                    this.store.dispatch(AuthActions.actionLogout());
                    if (error.error.message) {
                    } else {
                    }
                    this.loading = false;
                });
    }
}
