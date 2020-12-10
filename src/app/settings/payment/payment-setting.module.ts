import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { PaymentSettingRoutingModule } from './payment-setting-routing.module';
import { PaymentSettingComponent } from './payment-setting.component';

@NgModule({
    imports: [
        SharedModule,
        PaymentSettingRoutingModule,
    ],
    declarations: [
        PaymentSettingComponent,
    ]
})

export class PaymentSettingModule {}
