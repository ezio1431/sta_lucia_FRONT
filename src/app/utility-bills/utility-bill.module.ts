import { NgModule } from '@angular/core';
import { UtilityBillRoutingModule } from './utility-bill-routing.module';
import { UtilityBillComponent } from './utility-bill.component';
import { AddUtilityBillComponent } from './add/add-utility-bill.component';
import { SharedModule } from '../shared/shared.module';
import {
    EntityDataService,
    EntityDefinitionService,
    EntityMetadataMap,
} from '@ngrx/data';
import { UtilityBillDataService } from './data/utility-bill-data.service';
import { ViewUtilityBillGeneralComponent } from './view/general/view-utility-bill-general.component';
import { ViewUtilityBillComponent } from './view/view-utility-bill.component';
import { UtilityBillUnitDetailsComponent } from './add/unit-details/utility-bill-unit-details.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const entityMetaData: EntityMetadataMap = {
    Tenant: {
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
        UtilityBillRoutingModule,
        NgxMatSelectSearchModule
    ],
    declarations: [
        UtilityBillComponent,
        AddUtilityBillComponent,
        ViewUtilityBillGeneralComponent,
        ViewUtilityBillComponent,
        UtilityBillUnitDetailsComponent
    ]
})

export class UtilityBillModule {

    constructor (private eds: EntityDefinitionService, private entityDataService: EntityDataService,
                 private tenantDataService: UtilityBillDataService) {
       // eds.registerMetadataMap(entityMetaData);
      //  entityDataService.registerService('Tenant', tenantDataService)
    }
}
