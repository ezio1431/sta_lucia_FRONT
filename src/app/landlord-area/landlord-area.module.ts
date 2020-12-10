import { NgModule } from '@angular/core';
import { LandlordAreaRoutingModule } from './landlord-area-routing.module';
import { LandlordAreaComponent } from './landlord-area.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        LandlordAreaRoutingModule
    ],
    declarations: [
        LandlordAreaComponent
    ]
})

export class LandlordAreaModule {

    constructor () {
    }
}
