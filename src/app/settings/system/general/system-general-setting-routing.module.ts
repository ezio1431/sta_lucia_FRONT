import { Routes, RouterModule } from '@angular/router';
import { SystemGeneralSettingComponent } from './system-general-setting.component';

export const ROUTES: Routes = [
    { path: '', component: SystemGeneralSettingComponent },
];

export const SystemGeneralSettingRoutingModule = RouterModule.forChild(ROUTES);
