import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { ExtraChargeSettingRoutingModule } from './extra-charge-setting-routing.module';
import { ExtraChargeSettingComponent } from './extra-charge-setting.component';
import { AddExtraChargeComponent } from './add/add-extra-charge.component';


@NgModule({
    imports: [
        SharedModule,
        ExtraChargeSettingRoutingModule,
    ],
    declarations: [
        ExtraChargeSettingComponent,
        AddExtraChargeComponent
    ],
    entryComponents: [
        AddExtraChargeComponent
    ]
})

export class ExtraChargeSettingModule {

}
