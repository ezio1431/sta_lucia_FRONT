import { NgModule } from '@angular/core';

import { SystemSettingRoutingModule } from './system-setting-routing.module';
import { SystemSettingComponent } from './system-setting.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        SystemSettingRoutingModule,
    ],
    declarations: [
        SystemSettingComponent,
    ]
})

export class SystemSettingModule {}
