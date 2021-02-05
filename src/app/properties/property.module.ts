import { NgModule } from '@angular/core';
import { PropertyRoutingModule } from './property-routing.module';
import { PropertyComponent } from './property.component';
import { AddPropertyComponent } from './add/add-property.component';
import { SharedModule } from '../shared/shared.module';
import {
    EntityDataService,
    EntityDefinitionService,
    EntityMetadataMap,
} from '@ngrx/data';
import { PropertyDataService } from './data/property-data.service';
import { ViewPropertyGeneralComponent } from './view/general/view-property-general.component';
import { ViewPropertyComponent } from './view/view-property.component';
import { PropertyUnitDetailsComponent } from './add/unit-details/property-unit-details.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const entityMetaData: EntityMetadataMap = {
    Property: {
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
        PropertyRoutingModule,
        NgxMatSelectSearchModule
    ],
    declarations: [
        PropertyComponent,
        AddPropertyComponent,
        ViewPropertyGeneralComponent,
        ViewPropertyComponent,
        PropertyUnitDetailsComponent
    ]
})

export class PropertyModule {

    constructor (private eds: EntityDefinitionService, private entityDataService: EntityDataService,
                 private landlordDataService: PropertyDataService) {
     //   eds.registerMetadataMap(entityMetaData);
     //   entityDataService.registerService('Property', landlordDataService)
    }
}
