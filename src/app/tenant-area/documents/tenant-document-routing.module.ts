import { Routes, RouterModule } from '@angular/router';
import { TenantDocumentComponent } from './tenant-document.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: TenantDocumentComponent
    }
];


export const TenantDocumentRoutingModule = RouterModule.forChild(ROUTES);
