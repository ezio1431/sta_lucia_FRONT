import { Routes, RouterModule } from '@angular/router';
import { SystemSettingComponent } from './system-setting.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: SystemSettingComponent,
        children: [
            {
                path: '',
              //  loadChildren: 'app/settings/user/general/user-general-setting.module#UserGeneralSettingModule'
                loadChildren: () => import('app/settings/system/general/system-general-setting.module')
                    .then(m => m.SystemGeneralSettingModule)
            }
        ]
    }
];

export const SystemSettingRoutingModule = RouterModule.forChild(ROUTES);
