import { NgModule } from '@angular/core';
import { LeaseRoutingModule } from './lease-routing.module';
import { LeaseComponent } from './lease.component';
import { AddLeaseComponent } from './add/add-lease.component';
import { SharedModule } from '../shared/shared.module';
import {
    EntityDataService,
    EntityDefinitionService,
    EntityMetadataMap,
} from '@ngrx/data';
import { LeaseDataService } from './data/lease-data.service';
import { ViewLeaseGeneralComponent } from './view/general/view-lease-general.component';
import { ViewLeaseComponent } from './view/view-lease.component';
import { LeaseUnitDetailsComponent } from './add/unit-details/lease-unit-details.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { StatementComponent } from '../accounting/statement/statement.component';

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
        LeaseRoutingModule,
        NgxMatSelectSearchModule,
        AngularMultiSelectModule
    ],
    declarations: [
        LeaseComponent,
        AddLeaseComponent,
        ViewLeaseGeneralComponent,
        ViewLeaseComponent,
        LeaseUnitDetailsComponent,
        StatementComponent
    ]
})

export class LeaseModule {

    constructor (private eds: EntityDefinitionService, private entityDataService: EntityDataService,
                 private tenantDataService: LeaseDataService) {
       // eds.registerMetadataMap(entityMetaData);
      //  entityDataService.registerService('Tenant', tenantDataService)
    }
}
