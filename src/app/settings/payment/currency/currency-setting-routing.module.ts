import { Routes, RouterModule } from '@angular/router';
import { CurrencySettingComponent } from './currency-setting.component';

export const ROUTES: Routes = [
    { path: '', component: CurrencySettingComponent },
];

export const CurrencySettingRoutingModule = RouterModule.forChild(ROUTES);
