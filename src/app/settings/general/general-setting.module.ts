import { NgModule } from '@angular/core';

import { GeneralSettingRoutingModule } from './general-setting-routing.module';
import { GeneralSettingComponent } from './general-setting.component';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';


@NgModule({
    imports: [
        SharedModule,
        GeneralSettingRoutingModule,
    ],
    declarations: [
        GeneralSettingComponent,
    ]
})

export class GeneralSettingModule {}
