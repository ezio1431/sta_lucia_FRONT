import { NgModule } from '@angular/core';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';
import { AddInvoiceComponent } from './add/add-invoice.component';
import { SharedModule } from '../shared/shared.module';
import { ViewInvoiceComponent } from './view/view-invoice.component';
import { UtilityBillUnitDetailsComponent } from './add/unit-details/utility-bill-unit-details.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { WaiveInvoiceComponent } from './view/waive/waive-invoice.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { PayComponent } from './pay/pay.component';

@NgModule({
    imports: [
        SharedModule,
        InvoiceRoutingModule,
        NgxMatSelectSearchModule,
        NgxPayPalModule
    ],
    declarations: [
        InvoiceComponent,
        AddInvoiceComponent,
        ViewInvoiceComponent,
        UtilityBillUnitDetailsComponent,
        WaiveInvoiceComponent,
        PayComponent
    ]
})

export class InvoiceModule {
    constructor () {
    }
}
