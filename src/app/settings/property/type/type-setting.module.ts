import { NgModule } from '@angular/core';

import { TypeSettingRoutingModule } from './type-setting-routing.module';
import { TypeSettingComponent } from './type-setting.component';
import { AddTypeComponent } from './add/add-type.component';
import { EditTypeComponent } from './edit/edit-type.component';
import { SharedModule } from '../../../shared/shared.module';
import { EntityDataService, EntityDefinitionService, EntityMetadataMap } from '@ngrx/data';
import { LandlordDataService } from '../../../landlords/data/landlord-data.service';
import { TypeDataService } from './data/type-data.service';


@NgModule({
    imports: [
        SharedModule,
        TypeSettingRoutingModule,
    ],
    declarations: [
        TypeSettingComponent,
        AddTypeComponent,
        EditTypeComponent
    ],
    entryComponents: [
        AddTypeComponent,
        EditTypeComponent
    ]
})

export class TypeSettingModule {

}
