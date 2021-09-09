import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './authentication/auth.guard';
import { PermissionGuardService as PermGuard } from './authentication/permission-guard-service';
import { AuthGuardAdmin } from './authentication/auth.guard-admin';
import { AuthGuardLandlord } from './authentication/auth.guard-landlord';
import { AuthGuardTenant } from './authentication/auth.guard-tenant';
import { TenantDashResolverService } from './tenant-area/data/tenant-dash-resolver.service';
import { LandlordDashResolverService } from './landlord-area/data/landlord-dash-resolver.service';
import { AdminDashResolverService } from './dashboard/data/admin-dash-resolver.service';

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
        resolve : {adminData: AdminDashResolverService},
        canActivate: [AuthGuardAdmin]
      },
      {
        path: 'landlords',
        loadChildren: () => import('./landlords/landlord.module').then(m => m.LandlordModule),
        canActivate: [AuthGuardAdmin],
      },
      {
        path: 'properties',
        loadChildren: () => import('./properties/property.module').then(m => m.PropertyModule),
         canActivate: [AuthGuard]
      },
      {
        path: 'tenants',
        loadChildren: () => import('./tenants/tenant.module').then(m => m.TenantModule),
        canActivate: [AuthGuardAdmin]
      },
      {
        path: 'leases',
        loadChildren: () => import('./leases/lease.module').then(m => m.LeaseModule),
        canActivate: [AuthGuard]
       /* canActivate: [AuthGuard],
        canLoad: [PermGuard],
        data: {
          permissions: ['dashboard-view']
        }*/
      },
      {
        path: 'readings',
        loadChildren: () => import('./readings/reading.module').then(m => m.ReadingModule),
        canActivate: [AuthGuardAdmin]
      },
      {
        path: 'invoices',
        loadChildren: () => import('./invoices/invoice.module').then(m => m.InvoiceModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'payments',
        loadChildren: () => import('./payments/payment.module').then(m => m.PaymentModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/setting.module').then(m => m.SettingModule),
        canActivate: [AuthGuardAdmin]
      },
      {
        path: 'reports',
        loadChildren: () => import('./accounting/accounting.module').then(m => m.AccountingModule),
        canActivate: [AuthGuardAdmin]
       // canActivate: [AuthGuard],
       // data: { preload: true, delay: true }
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/user-profile.module').then(m => m.UserProfileModule),
        canActivate: [AuthGuardAdmin]
      },
      {
        path: 'notices',
        loadChildren: () => import('./vacate/vacate.module').then(m => m.VacateModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'landlord/dashboard',
        loadChildren: () => import('./landlord-area/landlord-area.module').then(m => m.LandlordAreaModule),
        resolve : {landlordData: LandlordDashResolverService},
        canActivate: [AuthGuardLandlord]
        /*canActivate: [AuthGuard],
        canLoad: [PermGuard],
        data: {
          permissions: ['landlord']
        }*/
      },
      {
        path: 'landlord/profile',
        loadChildren: () => import('./landlord-area/profile/landlord-profile.module')
            .then(m => m.LandlordProfileModule),
        canActivate: [AuthGuardLandlord]
        /*canActivate: [AuthGuard],
        canLoad: [PermGuard],
        data: {
          permissions: ['landlord']
        }*/
      },
      {
        path: 'tenant/dashboard',
        loadChildren: () => import('./tenant-area/tenant-area.module').then(m => m.TenantAreaModule),
        resolve : {tenantData: TenantDashResolverService},
        canActivate: [AuthGuardTenant]
        /*canActivate: [AuthGuard],
        canLoad: [PermGuard],
        data: {
          permissions: ['landlord']
        }*/
      },
      {
        path: 'tenant/profile',
        loadChildren: () => import('./tenant-area/profile/tenant-profile.module')
            .then(m => m.TenantProfileModule),
        canActivate: [AuthGuardTenant]
        /*canActivate: [AuthGuard],
        canLoad: [PermGuard],
        data: {
          permissions: ['landlord']
        }*/
      },
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
