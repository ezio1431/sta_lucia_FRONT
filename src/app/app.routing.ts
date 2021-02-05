import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './authentication/auth.guard';
import { PermissionGuardService as PermGuard } from './authentication/permission-guard-service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'landlords',
        // loadChildren: './settings/setting.module#SettingModule',
        loadChildren: () => import('./landlords/landlord.module').then(m => m.LandlordModule),
      },
      {
        path: 'properties',
        // loadChildren: './settings/setting.module#SettingModule',
        loadChildren: () => import('./properties/property.module').then(m => m.PropertyModule),
      },
      {
        path: 'tenants',
        // loadChildren: './settings/setting.module#SettingModule',
        loadChildren: () => import('./tenants/tenant.module').then(m => m.TenantModule),
      },
      {
        path: 'leases',
        // loadChildren: './settings/setting.module#SettingModule',
        loadChildren: () => import('./leases/lease.module').then(m => m.LeaseModule),
       /* canActivate: [AuthGuard],
        canLoad: [PermGuard],
        data: {
          permissions: ['dashboard-view']
        }*/
      },
      {
        path: 'utility_bills',
        // loadChildren: './settings/setting.module#SettingModule',
        loadChildren: () => import('./utility-bills/utility-bill.module').then(m => m.UtilityBillModule),
      },
      {
        path: 'invoices',
        // loadChildren: './settings/setting.module#SettingModule',
        loadChildren: () => import('./invoices/invoice.module').then(m => m.InvoiceModule),
      },
      {
        path: 'payments',
        // loadChildren: './settings/setting.module#SettingModule',
        loadChildren: () => import('./payments/payment.module').then(m => m.PaymentModule),
      },
      {
        path: 'settings',
        // loadChildren: './settings/setting.module#SettingModule',
        loadChildren: () => import('./settings/setting.module').then(m => m.SettingModule),
      },
      {
        path: 'profile',
        // loadChildren: './settings/setting.module#SettingModule',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'tasks',
        loadChildren: () => import('./tasks/task.module').then(m => m.TaskModule),
      },
      {
        path: 'landlord',
        loadChildren: () => import('./landlord-area/landlord-area.module').then(m => m.LandlordAreaModule),
        canActivate: [AuthGuard],
        canLoad: [PermGuard],
        data: {
          permissions: ['landlord']
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
    useHash: true,
    relativeLinkResolution: 'legacy'
})
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
