import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { AuthenticationService } from '../../authentication/authentication.service';
import { AuthActions } from '../../authentication/action-types';
import {
    selectorCompanyName,
    selectorIsAgent,
    selectorIsLandlord,
    selectorIsTenant,
    selectorUserScopes
} from '../../authentication/authentication.selectors';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    permission?: any;
}
export const ADMIN_ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'robi.sidebar.dashboard',  icon: 'dashboard', class: '', permission: ['test1'] },
    { path: '/landlords', title: 'robi.sidebar.landlords',  icon: 'people_outline', class: '', permission: ['test1'] },
    { path: '/properties', title: 'robi.sidebar.properties',  icon: 'business', class: '', permission: ['test1', 'am-landlord'] },
    { path: '/tenants', title: 'robi.sidebar.tenants',  icon: 'group_add', class: '', permission: ['test1'] },
    { path: '/leases', title: 'robi.sidebar.leases',  icon: 'gavel', class: '', permission: ['test1'] },
    { path: '/readings', title: 'robi.sidebar.utilities',  icon: 'pool', class: '', permission: ['test1'] },
    { path: '/invoices', title: 'robi.sidebar.invoices',  icon: 'receipt', class: '', permission: ['test1'] },
    { path: '/payments', title: 'robi.sidebar.payments',  icon: 'payment', class: '', permission: ['test1'] },
   // { path: '/tasks', title: 'Maintenance Tasks',  icon: 'format_paint', class: '', permission: ['test1'] },
    { path: '/notices', title: 'Vacate Notice',  icon: 'lock_open', class: '', permission: ['test1'] },
    { path: '/settings', title: 'robi.sidebar.setting',  icon: 'settings', class: '', permission: ['test1'] },
    { path: '/profile', title: 'sidebar.profile',  icon: 'person', class: '', permission: ['test1'] },
    { path: '/reports', title: 'Reports',  icon: 'account_tree', class: '', permission: ['test1'] }
];

export const LANDLORD_ROUTES: RouteInfo[] = [
    { path: '/landlord/dashboard', title: 'robi.sidebar.dashboard',  icon: 'dashboard', class: '', permission: ['am-landlord'] },
  //  { path: '/landlord/dashboard', title: 'robi.sidebar.dashboard',  icon: 'dashboard', class: '', permission: ['am-landlord'] },
    { path: '/properties', title: 'robi.sidebar.properties',  icon: 'business', class: '', permission: ['am-landlord', 'test1'] },
    { path: '/leases', title: 'robi.sidebar.leases',  icon: 'gavel', class: '', permission: ['am-landlord'] },
    { path: '/payments', title: 'robi.sidebar.payments',  icon: 'payment', class: '', permission: ['am-landlord'] },
    { path: '/invoices', title: 'robi.sidebar.invoices',  icon: 'receipt', class: '', permission: ['am-landlord'] },
    { path: '/landlord/profile', title: 'sidebar.profile',  icon: 'person', class: '', permission: ['am-landlord'] },
];

export const TENANT_ROUTES: RouteInfo[] = [
    { path: '/tenant/dashboard', title: 'robi.sidebar.dashboard',  icon: 'dashboard', class: '', permission: ['am-tenant'] },
    { path: '/leases', title: 'robi.sidebar.leases',  icon: 'gavel', class: '', permission: ['am-tenant'] },
   // { path: '/invoices', title: 'robi.sidebar.invoices',  icon: 'receipt', class: '', permission: ['am-tenant'] },
    { path: '/payments', title: 'robi.sidebar.payments',  icon: 'payment', class: '', permission: ['am-tenant'] },
    { path: '/notices', title: 'Vacate Notice',  icon: 'lock_open', class: '', permission: ['am-tenant'] },
    { path: '/tenant/profile', title: 'sidebar.profile',  icon: 'person', class: '', permission: ['am-tenant'] },
];

@Component({
  selector: 'robi-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItemsAdmin: any[];
  menuItemsLandlord: any[];
  menuItemsTenant: any[];
    loading = false;

    scopes$: any;
    isLandlord$: any;
    isTenant$: any;
    isAgent$: any;
    companyName: string;
  constructor(private store: Store<AppState>, private auth: AuthenticationService) {
      this.scopes$ = this.store.pipe(select(selectorUserScopes));
      this.store.pipe(select(selectorCompanyName)).subscribe(name => this.companyName = name);
      this.isAgent$ = this.store.pipe(select(selectorIsAgent));
      this.isLandlord$ = this.store.pipe(select(selectorIsLandlord));
      this.isTenant$ = this.store.pipe(select(selectorIsTenant));
  }

  ngOnInit() {
    this.menuItemsAdmin = ADMIN_ROUTES.filter(menuItem => menuItem);
    this.menuItemsLandlord = LANDLORD_ROUTES.filter(menuItem => menuItem);
    this.menuItemsTenant = TENANT_ROUTES.filter(menuItem => menuItem);
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
