import { Routes, RouterModule } from '@angular/router';
import { PropertyComponent } from './property.component';
import { AddPropertyComponent } from './add/add-property.component';
import { PropertyResolverService } from './data/property-resolver.service';
import { ViewPropertyComponent } from './view/view-property.component';
import { ViewPropertyGeneralComponent } from './view/general/view-property-general.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: PropertyComponent,
       /* resolve: {
            landlords: PropertyResolverService
        }*/
    },
    { path: 'create', component: AddPropertyComponent },
    {
        path: ':id',
        component: ViewPropertyComponent,
        /*resolve : { member: LandlordResolverService},*/
        children: [
            { path: '', component: ViewPropertyGeneralComponent }
        ]
    },
];


export const PropertyRoutingModule = RouterModule.forChild(ROUTES);
