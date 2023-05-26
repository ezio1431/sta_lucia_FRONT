import { Routes, RouterModule } from '@angular/router';
import { LandlordDocumentComponent } from './landlord-document.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: LandlordDocumentComponent
    }
];


export const LandlordDocumentRoutingModule = RouterModule.forChild(ROUTES);
