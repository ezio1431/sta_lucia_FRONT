import { NgModule } from '@angular/core';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { AddPaymentComponent } from './add/add-payment.component';
import { SharedModule } from '../shared/shared.module';
import {
    EntityDataService,
    EntityDefinitionService,
    EntityMetadataMap,
} from '@ngrx/data';
import { PaymentDataService } from './data/payment-data.service';
import { ViewPaymentGeneralComponent } from './view/general/view-payment-general.component';
import { ViewPaymentComponent } from './view/view-payment.component';
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
        PaymentRoutingModule,
        NgxMatSelectSearchModule
    ],
    declarations: [
        PaymentComponent,
        AddPaymentComponent,
        ViewPaymentGeneralComponent,
        ViewPaymentComponent,
        UtilityBillUnitDetailsComponent
    ]
})

export class PaymentModule {

    constructor (private eds: EntityDefinitionService, private entityDataService: EntityDataService,
                 private tenantDataService: PaymentDataService) {
       // eds.registerMetadataMap(entityMetaData);
      //  entityDataService.registerService('Tenant', tenantDataService)
    }
}
