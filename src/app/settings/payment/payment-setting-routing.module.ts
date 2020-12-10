import { Routes, RouterModule } from '@angular/router';
import { PaymentSettingComponent } from './payment-setting.component';
import { PaymentMethodResolverService } from './payment-method/data/payment-method-resolver.service';
import { UtilityResolverService } from '../property/utility/data/utility-resolver.service';

export const ROUTES: Routes = [
    {
        path: '',
        component: PaymentSettingComponent,
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
                loadChildren: () => import('app/settings/payment/payment-method/payment-method-setting.module')
                    .then(m => m.PaymentMethodSettingModule),
               /* resolve: {
                    utilities: LeaseTypeResolverService
                }*/
            },
            {
                path: 'payment_method',
                //  loadChildren: 'app/settings/user/permissions/user-permissions-setting.module#UserPermissionsSettingModule'
                loadChildren: () => import('app/settings/payment/payment-method/payment-method-setting.module')
                    .then(m => m.PaymentMethodSettingModule),
                /*resolve: {
                    utilities: UtilityResolverService
                }*/
            },
            {
                path: 'payment_frequency',
                //  loadChildren: 'app/settings/user/permissions/user-permissions-setting.module#UserPermissionsSettingModule'
                loadChildren: () => import('app/settings/payment/payment-frequency/payment-frequency-setting.module')
                    .then(m => m.PaymentFrequencySettingModule),
                /*resolve: {
                    utilities: UtilityResolverService
                }*/
            },
        ]
    }
];

export const PaymentSettingRoutingModule = RouterModule.forChild(ROUTES);
