import { NgModule } from '@angular/core';

import { PropertyGeneralSettingRoutingModule } from './property-general-setting-routing.module';
import { PropertyGeneralSettingComponent } from './property-general-setting.component';
import { AddPropertyComponent } from './add/add-property.component';
import { EditPropertyComponent } from './edit/edit-property.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        PropertyGeneralSettingRoutingModule,
    ],
    declarations: [
        PropertyGeneralSettingComponent,
        AddPropertyComponent,
        EditPropertyComponent
    ],
    entryComponents: [
        AddPropertyComponent,
        EditPropertyComponent
    ]
})

export class PropertyGeneralSettingModule {}
