import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
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
        path: 'settings',
        // loadChildren: './settings/setting.module#SettingModule',
        loadChildren: () => import('./settings/setting.module').then(m => m.SettingModule),
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
       useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
