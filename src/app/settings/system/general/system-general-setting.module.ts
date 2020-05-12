import { NgModule } from '@angular/core';

import { SystemGeneralSettingRoutingModule } from './system-general-setting-routing.module';
import { SystemGeneralSettingComponent } from './system-general-setting.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        SystemGeneralSettingRoutingModule,
    ],
    declarations: [
        SystemGeneralSettingComponent,
    ],
    entryComponents: [
    ]
})

export class SystemGeneralSettingModule {}
