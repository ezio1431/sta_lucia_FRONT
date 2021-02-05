import { Routes, RouterModule } from '@angular/router';
import { PropertyComponent } from './property.component';
import { AddPropertyComponent } from './add/add-property.component';
import { PropertyResolverService } from './data/property-resolver.service';
import { ViewPropertyComponent } from './view/view-property.component';
import { ViewPropertyGeneralComponent } from './view/general/view-property-general.component';
import { CreatePropertyResolverService } from './data/create-property-resolver.service';

export const ROUTES: Routes = [
    {
        path: '',
        component: PropertyComponent,
       /* resolve: {
            landlords: PropertyResolverService
        }*/
    },
    {
        path: 'create',
        component: AddPropertyComponent,
        resolve: {
            landlords: CreatePropertyResolverService
        }
    },
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
