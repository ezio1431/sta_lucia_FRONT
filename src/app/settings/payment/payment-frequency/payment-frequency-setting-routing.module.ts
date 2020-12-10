import { Routes, RouterModule } from '@angular/router';
import { PaymentFrequencySettingComponent } from './payment-frequency-setting.component';

export const ROUTES: Routes = [
    { path: '', component: PaymentFrequencySettingComponent },
];

export const PaymentFrequencySettingRoutingModule = RouterModule.forChild(ROUTES);
