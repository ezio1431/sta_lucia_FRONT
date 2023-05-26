import { NgModule } from '@angular/core';
import { LandlordDocumentRoutingModule } from './landlord-document-routing.module';
import { LandlordDocumentComponent } from './landlord-document.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        LandlordDocumentRoutingModule
    ],
    declarations: [
        LandlordDocumentComponent
    ]
})

export class LandlordDocumentModule {
    constructor () {
    }
}
