import { Routes, RouterModule } from '@angular/router';
import { LandlordAreaComponent } from './landlord-area.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: LandlordAreaComponent
    },
];


export const LandlordAreaRoutingModule = RouterModule.forChild(ROUTES);
