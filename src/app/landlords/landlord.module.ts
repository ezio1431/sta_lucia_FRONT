import { NgModule } from '@angular/core';
import { LandlordRoutingModule } from './landlord-routing.module';
import { LandlordComponent } from './landlord.component';
import { AddLandlordComponent } from './add/add-landlord.component';
import { SharedModule } from '../shared/shared.module';
import {
    EntityDataService,
    EntityDefinitionService,
    EntityMetadataMap,
} from '@ngrx/data';
import { LandlordDataService } from './data/landlord-data.service';
import { LandlordDocumentComponent } from './view/documents/landlord-document.component';
import { ViewLandlordGeneralComponent } from './view/general/view-landlord-general.component';
import { LandlordPropertyComponent } from './view/property/landlord-property.component';
import { ViewLandlordComponent } from './view/view-landlord.component';

const entityMetaData: EntityMetadataMap = {
    Landlord: {
        additionalCollectionState: {
            meta: {
                current_page: 1,
                from: 1,
                last_page: '',
                path: '',
                per_page: '',
                to: '',
                total: ''
            }
        }
    }
};

@NgModule({
    imports: [
        SharedModule,
        LandlordRoutingModule
    ],
    declarations: [
        LandlordComponent,
        AddLandlordComponent,
        LandlordDocumentComponent,
        ViewLandlordGeneralComponent,
        LandlordPropertyComponent,
        ViewLandlordComponent
    ],
    entryComponents: [
        AddLandlordComponent
    ]
})

export class LandlordModule {

    constructor (private eds: EntityDefinitionService, private entityDataService: EntityDataService,
                 private landlordDataService: LandlordDataService) {
        eds.registerMetadataMap(entityMetaData);
        entityDataService.registerService('Landlord', landlordDataService)
    }
}
