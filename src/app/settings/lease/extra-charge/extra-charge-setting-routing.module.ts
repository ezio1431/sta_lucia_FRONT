import { Routes, RouterModule } from '@angular/router';
import { ExtraChargeSettingComponent } from './extra-charge-setting.component';

export const ROUTES: Routes = [
    { path: '', component: ExtraChargeSettingComponent },
];

export const ExtraChargeSettingRoutingModule = RouterModule.forChild(ROUTES);
