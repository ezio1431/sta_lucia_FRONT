import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { PaymentFrequencySettingRoutingModule } from './payment-frequency-setting-routing.module';
import { PaymentFrequencySettingComponent } from './payment-frequency-setting.component';
import { AddPaymentFrequencyComponent } from './add/add-payment-frequency.component';


@NgModule({
    imports: [
        SharedModule,
        PaymentFrequencySettingRoutingModule,
    ],
    declarations: [
        PaymentFrequencySettingComponent,
        AddPaymentFrequencyComponent
    ],
    entryComponents: [
        AddPaymentFrequencyComponent
    ]
})

export class PaymentFrequencySettingModule {

}
