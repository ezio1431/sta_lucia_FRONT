import { NgModule } from '@angular/core';

import { UtilitySettingRoutingModule } from './utility-setting-routing.module';
import { UtilitySettingComponent } from './utility-setting.component';
import { AddUtilityComponent } from './add/add-utility.component';
import { EditUtilityComponent } from './edit/edit-utility.component';
import { SharedModule } from '../../../shared/shared.module';
import { EntityDataService, EntityDefinitionService, EntityMetadataMap } from '@ngrx/data';
import { LandlordDataService } from '../../../landlords/data/landlord-data.service';
import { UtilityDataService } from './data/utility-data.service';


@NgModule({
    imports: [
        SharedModule,
        UtilitySettingRoutingModule,
    ],
    declarations: [
        UtilitySettingComponent,
        AddUtilityComponent,
        EditUtilityComponent
    ],
    entryComponents: [
        AddUtilityComponent,
        EditUtilityComponent
    ]
})

export class UtilitySettingModule {

}
