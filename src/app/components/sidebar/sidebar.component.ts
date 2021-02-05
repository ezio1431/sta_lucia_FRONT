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
    { path: '/landlords', title: 'robi.sidebar.landlords',  icon: 'people_outline', class: '', permission: ['dashboard-view'] },
    { path: '/properties', title: 'robi.sidebar.properties',  icon: 'business', class: '', permission: ['dashboard-view'] },
    { path: '/tenants', title: 'robi.sidebar.tenants',  icon: 'group_add', class: '', permission: ['dashboard-view'] },
    { path: '/leases', title: 'robi.sidebar.leases',  icon: 'format_list_numbered', class: '', permission: ['dashboard-view'] },
    { path: '/utility_bills', title: 'robi.sidebar.utility-bills',  icon: 'ev_station', class: '', permission: ['dashboard-view'] },
    { path: '/invoices', title: 'robi.sidebar.invoices',  icon: 'post_add', class: '', permission: ['dashboard-view'] },
    { path: '/payments', title: 'robi.sidebar.payments',  icon: 'payment', class: '', permission: ['dashboard-view'] },
    { path: '/tasks', title: 'Tasks',  icon: 'format_paint', class: '', permission: ['dashboard-view'] },
    { path: '/settings', title: 'robi.sidebar.setting',  icon: 'settings', class: '', permission: ['dashboard-view'] },
    { path: '/profile', title: 'sidebar.profile',  icon: 'person', class: '', permission: ['dashboard-view'] }
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
