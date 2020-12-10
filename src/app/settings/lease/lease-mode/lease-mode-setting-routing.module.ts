import { Routes, RouterModule } from '@angular/router';
import { LeaseModeSettingComponent } from './lease-mode-setting.component';

export const ROUTES: Routes = [
    { path: '', component: LeaseModeSettingComponent },
];

export const LeaseModeSettingRoutingModule = RouterModule.forChild(ROUTES);
