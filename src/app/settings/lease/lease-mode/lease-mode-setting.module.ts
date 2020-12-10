import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { LeaseModeSettingRoutingModule } from './lease-mode-setting-routing.module';
import { LeaseModeSettingComponent } from './lease-mode-setting.component';
import { AddLeaseModeComponent } from './add/add-lease-mode.component';


@NgModule({
    imports: [
        SharedModule,
        LeaseModeSettingRoutingModule,
    ],
    declarations: [
        LeaseModeSettingComponent,
        AddLeaseModeComponent
    ],
    entryComponents: [
        AddLeaseModeComponent
    ]
})

export class LeaseModeSettingModule {

}
