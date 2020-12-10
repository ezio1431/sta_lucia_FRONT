import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { PaymentMethodSettingRoutingModule } from './payment-method-setting-routing.module';
import { PaymentMethodSettingComponent } from './payment-method-setting.component';
import { AddPaymentMethodComponent } from './add/add-payment-method.component';


@NgModule({
    imports: [
        SharedModule,
        PaymentMethodSettingRoutingModule,
    ],
    declarations: [
        PaymentMethodSettingComponent,
        AddPaymentMethodComponent
    ],
    entryComponents: [
        AddPaymentMethodComponent
    ]
})

export class PaymentMethodSettingModule {

}
