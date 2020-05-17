import { Routes, RouterModule } from '@angular/router';
import { PropertySettingComponent } from './property-setting.component';
import { UtilityResolverService } from './utility/data/utility-resolver.service';
import { AmenityResolverService } from './amenity/data/amenity-resolver.service';

export const ROUTES: Routes = [
    {
        path: '',
        component: PropertySettingComponent,
        children: [
            {
                path: '',
              //  loadChildren: 'app/settings/user/general/user-general-setting.module#UserGeneralSettingModule'
                loadChildren: () => import('app/settings/property/general/property-general-setting.module')
                    .then(m => m.PropertyGeneralSettingModule)
            },
            {
                path: 'roles',
              //  loadChildren: 'app/settings/user/roles/user-roles-setting.module#UserRolesSettingModule'
                loadChildren: () => import('app/settings/user/roles/user-roles-setting.module')
                    .then(m => m.UserRolesSettingModule)
            },
            {
                path: 'permissions',
              //  loadChildren: 'app/settings/user/permissions/user-permissions-setting.module#UserPermissionsSettingModule'
                loadChildren: () => import('app/settings/user/permissions/user-permissions-setting.module')
                    .then(m => m.UserPermissionsSettingModule)
            },
            {
                path: 'property_types',
                //  loadChildren: 'app/settings/user/permissions/user-permissions-setting.module#UserPermissionsSettingModule'
                loadChildren: () => import('app/settings/property/type/type-setting.module')
                    .then(m => m.TypeSettingModule),
                resolve: {
                    amenities: AmenityResolverService
                }
            },
            {
                path: 'amenities',
                //  loadChildren: 'app/settings/user/permissions/user-permissions-setting.module#UserPermissionsSettingModule'
                loadChildren: () => import('app/settings/property/amenity/amenity-setting.module')
                    .then(m => m.AmenitySettingModule),
                resolve: {
                    amenities: AmenityResolverService
                }
            },
            {
                path: 'utilities',
                //  loadChildren: 'app/settings/user/permissions/user-permissions-setting.module#UserPermissionsSettingModule'
                loadChildren: () => import('app/settings/property/utility/utility-setting.module')
                    .then(m => m.UtilitySettingModule),
                resolve: {
                    utilities: UtilityResolverService
                }
            }
        ]
    }
];

export const PropertySettingRoutingModule = RouterModule.forChild(ROUTES);
