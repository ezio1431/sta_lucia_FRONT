import { Routes, RouterModule } from '@angular/router';
import { LeaseSettingComponent } from './lease-setting.component';
import { LeaseTypeResolverService } from './lease-type/data/lease-type-resolver.service';
import { UtilityResolverService } from '../property/utility/data/utility-resolver.service';

export const ROUTES: Routes = [
    {
        path: '',
        component: LeaseSettingComponent,
        children: [
            /*{
                path: '',
              //  loadChildren: 'app/settings/user/general/user-general-setting.module#UserGeneralSettingModule'
                loadChildren: () => import('app/settings/property/general/property-general-setting.module')
                    .then(m => m.PropertyGeneralSettingModule)
            },*/
            {
                path: '',
                //  loadChildren: 'app/settings/user/permissions/user-permissions-setting.module#UserPermissionsSettingModule'
                loadChildren: () => import('app/settings/lease/lease-type/lease-type-setting.module')
                    .then(m => m.LeaseTypeSettingModule),
               /* resolve: {
                    utilities: LeaseTypeResolverService
                }*/
            },
            {
                path: 'lease_mode',
                //  loadChildren: 'app/settings/user/permissions/user-permissions-setting.module#UserPermissionsSettingModule'
                loadChildren: () => import('app/settings/lease/lease-mode/lease-mode-setting.module')
                    .then(m => m.LeaseModeSettingModule),
                /*resolve: {
                    utilities: UtilityResolverService
                }*/
            },
            {
                path: 'tenant_type',
                //  loadChildren: 'app/settings/user/permissions/user-permissions-setting.module#UserPermissionsSettingModule'
                loadChildren: () => import('app/settings/lease/tenant-type/tenant-type-setting.module')
                    .then(m => m.TenantTypeSettingModule),
                /*resolve: {
                    utilities: UtilityResolverService
                }*/
            },
        ]
    }
];

export const LeaseSettingRoutingModule = RouterModule.forChild(ROUTES);
