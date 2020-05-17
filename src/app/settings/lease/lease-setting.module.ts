import { NgModule } from '@angular/core';

import { LeaseSettingRoutingModule } from './lease-setting-routing.module';
import { LeaseSettingComponent } from './lease-setting.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        LeaseSettingRoutingModule,
    ],
    declarations: [
        LeaseSettingComponent,
    ]
})

export class LeaseSettingModule {}
