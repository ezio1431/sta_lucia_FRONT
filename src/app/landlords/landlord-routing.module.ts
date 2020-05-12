import { Routes, RouterModule } from '@angular/router';
import { LandlordComponent } from './landlord.component';
import { AddLandlordComponent } from './add/add-landlord.component';
import { LandlordResolverService } from './data/landlord-resolver.service';
import { ViewLandlordComponent } from './view/view-landlord.component';
import { ViewLandlordGeneralComponent } from './view/general/view-landlord-general.component';
import { LandlordDocumentComponent } from './view/documents/landlord-document.component';
import { LandlordPropertyComponent } from './view/property/landlord-property.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: LandlordComponent,
        resolve: {
            landlords: LandlordResolverService
        }
    },
    {
        path: ':id',
        component: ViewLandlordComponent,
        /*resolve : { member: LandlordResolverService},*/
        children: [
            { path: '', component: ViewLandlordGeneralComponent },
            { path: 'documents', component: LandlordDocumentComponent },
            { path: 'properties', component: LandlordPropertyComponent }
        ]
    },
    { path: 'create', component: AddLandlordComponent },
];


export const LandlordRoutingModule = RouterModule.forChild(ROUTES);
