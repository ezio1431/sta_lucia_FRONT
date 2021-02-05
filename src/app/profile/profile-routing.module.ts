import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileResolverService } from './data/profile-resolver.service';

export const ROUTES: Routes = [
    {
        path: '',
        component: ProfileComponent,
        resolve: {
            landlords: ProfileResolverService
        }
    }
];


export const ProfileRoutingModule = RouterModule.forChild(ROUTES);
