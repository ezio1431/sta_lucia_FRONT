import { NgModule } from '@angular/core';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';
import { AddInvoiceComponent } from './add/add-invoice.component';
import { SharedModule } from '../shared/shared.module';
import {
    EntityDataService,
    EntityDefinitionService,
    EntityMetadataMap,
} from '@ngrx/data';
import { InvoiceDataService } from './data/invoice-data.service';
import { ViewInvoiceGeneralComponent } from './view/general/view-invoice-general.component';
import { ViewInvoiceComponent } from './view/view-invoice.component';
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
        InvoiceRoutingModule,
        NgxMatSelectSearchModule
    ],
    declarations: [
        InvoiceComponent,
        AddInvoiceComponent,
        ViewInvoiceGeneralComponent,
        ViewInvoiceComponent,
        UtilityBillUnitDetailsComponent
    ]
})

export class InvoiceModule {

    constructor (private eds: EntityDefinitionService, private entityDataService: EntityDataService,
                 private tenantDataService: InvoiceDataService) {
       // eds.registerMetadataMap(entityMetaData);
      //  entityDataService.registerService('Tenant', tenantDataService)
    }
}
