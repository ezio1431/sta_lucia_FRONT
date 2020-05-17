import { NgModule } from '@angular/core';

import { AmenitySettingRoutingModule } from './amenity-setting-routing.module';
import { AmenitySettingComponent } from './amenity-setting.component';
import { AddAmenityComponent } from './add/add-amenity.component';
import { EditAmenityComponent } from './edit/edit-amenity.component';
import { SharedModule } from '../../../shared/shared.module';
import { EntityDataService, EntityDefinitionService, EntityMetadataMap } from '@ngrx/data';
import { LandlordDataService } from '../../../landlords/data/landlord-data.service';
import { AmenityDataService } from './data/amenity-data.service';


@NgModule({
    imports: [
        SharedModule,
        AmenitySettingRoutingModule,
    ],
    declarations: [
        AmenitySettingComponent,
        AddAmenityComponent,
        EditAmenityComponent
    ],
    entryComponents: [
        AddAmenityComponent,
        EditAmenityComponent
    ]
})

export class AmenitySettingModule {

}
