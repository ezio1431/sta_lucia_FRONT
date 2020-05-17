import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from './setting.component';
import { GeneralSettingResolverService } from './general/data/general-setting-resolver.service';
export const ROUTES: Routes = [
    {
        path: '',
        component: SettingComponent,
        children: [
            {
                path: '',
               // loadChildren: 'app/settings/general/general-setting.module#GeneralSettingModule',
                loadChildren: () => import('app/settings/general/general-setting.module').then(m => m.GeneralSettingModule)
               // resolve : { setting: GeneralSettingResolverService}
            },
           /* {
                path: 'account',
               // loadChildren: 'app/settings/account/account-setting.module#AccountSettingModule'
                loadChildren: () => import('../settings/account/account-setting.module').then(m => m.AccountSettingModule)
            },
            {
                path: 'borrower',
               // loadChildren: 'app/settings/borrower/borrower-setting.module#BorrowerSettingModule'
                loadChildren: () => import('app/settings/borrower/borrower-setting.module').then(m => m.BorrowerSettingModule)
            },
            {
                path: 'branch',
               // loadChildren: 'app/settings/branch/branch-setting.module#BranchSettingModule'
                loadChildren: () => import('app/settings/branch/branch-setting.module').then(m => m.BranchSettingModule),
               // loadChildren: () => import('app/settings/general/general-setting.module').then(m => m.GeneralSettingModule)
            },
            {
                path: 'employee',
              //  loadChildren: 'app/settings/employee/employee-setting.module#EmployeeSettingModule'
                loadChildren: () => import('app/settings/employee/employee-setting.module').then(m => m.EmployeeSettingModule)
            },
            {
                path: 'general',
               // loadChildren: 'app/settings/general/general-setting.module#GeneralSettingModule'
                loadChildren: () => import('app/settings/general/general-setting.module').then(m => m.GeneralSettingModule)
            },
            {
                path: 'loan',
               // loadChildren: 'app/settings/loan/loan-setting.module#LoanSettingModule'
                loadChildren: () => import('app/settings/loan/loan-setting.module').then(m => m.LoanSettingModule)
            },
            {
                path: 'communication',
              //  loadChildren: 'app/settings/communication/communication-setting.module#CommunicationSettingModule'
                loadChildren: () => import('./communication/communication-setting.module').then(m => m.CommunicationSettingModule)
            },
            {
                path: 'expense',
               // loadChildren: 'app/settings/expense/expense-setting.module#ExpenseSettingModule'
                loadChildren: () => import('app/settings/expense/expense-setting.module').then(m => m.ExpenseSettingModule)
            },
            {
                path: 'payment',
               // loadChildren: 'app/settings/payment/payment-setting.module#PaymentSettingModule'
                loadChildren: () => import('app/settings/payment/payment-setting.module').then(m => m.PaymentSettingModule)
            },*/
            {
                path: 'system',
                // loadChildren: 'app/settings/user/user-setting.module#UserSettingModule',
                loadChildren: () => import('app/settings/system/system-setting.module')
                    .then(m => m.SystemSettingModule)
            },
            {
                path: 'property',
                // loadChildren: 'app/settings/user/user-setting.module#UserSettingModule',
                loadChildren: () => import('app/settings/property/property-setting.module')
                    .then(m => m.PropertySettingModule)
            },
            {
                path: 'lease',
                // loadChildren: 'app/settings/user/user-setting.module#UserSettingModule',
                loadChildren: () => import('app/settings/lease/lease-setting.module')
                    .then(m => m.LeaseSettingModule)
            },
            {
                path: 'user',
               // loadChildren: 'app/settings/user/user-setting.module#UserSettingModule',
                loadChildren: () => import('app/settings/user/user-setting.module').then(m => m.UserSettingModule)
            }
        ]
    }
];

export const SettingRoutingModule = RouterModule.forChild(ROUTES);
