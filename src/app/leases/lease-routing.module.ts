import { Routes, RouterModule } from '@angular/router';
import { LeaseComponent } from './lease.component';
import { AddLeaseComponent } from './add/add-lease.component';
import { LeaseResolverService } from './data/lease-resolver.service';
import { ViewLeaseComponent } from './view/view-lease.component';
import { ViewLeaseGeneralComponent } from './view/general/view-lease-general.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: LeaseComponent,
       /* resolve: {
            landlords: PropertyResolverService
        }*/
    },
    { path: 'create', component: AddLeaseComponent },
    {
        path: ':id',
        component: ViewLeaseComponent,
        /*resolve : { member: LandlordResolverService},*/
        children: [
            { path: '', component: ViewLeaseGeneralComponent }
        ]
    },
];


export const LeaseRoutingModule = RouterModule.forChild(ROUTES);
