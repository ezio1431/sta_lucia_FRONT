import { NgModule } from '@angular/core';
import { TenantRoutingModule } from './tenant-routing.module';
import { TenantComponent } from './tenant.component';
import { AddTenantComponent } from './add/add-tenant.component';
import { SharedModule } from '../shared/shared.module';
import {
    EntityDataService,
    EntityDefinitionService,
    EntityMetadataMap,
} from '@ngrx/data';
import { TenantDataService } from './data/tenant-data.service';
import { ViewTenantGeneralComponent } from './view/general/view-tenant-general.component';
import { ViewTenantComponent } from './view/view-tenant.component';
import { TenantUnitDetailsComponent } from './add/unit-details/tenant-unit-details.component';

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
        TenantRoutingModule
    ],
    declarations: [
        TenantComponent,
        AddTenantComponent,
        ViewTenantGeneralComponent,
        ViewTenantComponent,
        TenantUnitDetailsComponent
    ]
})

export class TenantModule {

    constructor (private eds: EntityDefinitionService, private entityDataService: EntityDataService,
                 private tenantDataService: TenantDataService) {
       // eds.registerMetadataMap(entityMetaData);
      //  entityDataService.registerService('Tenant', tenantDataService)
    }
}
