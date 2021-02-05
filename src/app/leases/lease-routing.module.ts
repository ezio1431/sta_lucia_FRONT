import { Routes, RouterModule } from '@angular/router';
import { LeaseComponent } from './lease.component';
import { AddLeaseComponent } from './add/add-lease.component';
import { ViewLeaseComponent } from './view/view-lease.component';
import { ViewLeaseGeneralComponent } from './view/general/view-lease-general.component';
import { CreateLeaseResolverService } from './data/create-lease-resolver.service';

export const ROUTES: Routes = [
    {
        path: '',
        component: LeaseComponent,
       /* resolve: {
            landlords: PropertyResolverService
        }*/
    },
    {
        path: 'create',
        component: AddLeaseComponent,
        resolve: {
            properties: CreateLeaseResolverService
        }
    },
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
