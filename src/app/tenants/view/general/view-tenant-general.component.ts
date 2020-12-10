import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { TenantEntityService } from '../../data/tenant-entity.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'robi-view-property-general',
    templateUrl: './view-tenant-general.component.html',
    styleUrls: ['./view-tenant-general.component.css']
})
export class ViewTenantGeneralComponent implements OnInit {

    memberData: any;
    memberId = '';
    memberData$: any;

    profilePicUrl: string;
    profilePicFileToUpload: File = null;

    imageToShow: any;

    loader = false;
    memberShipForm = false;

    landlord$: Observable<any>;

    constructor(private propertyEntityService: TenantEntityService, private notification: NotificationService) {}

    ngOnInit() {
      //  this.landlord$ = this.propertyEntityService.selectedLandlordChanges$;

        this.propertyEntityService.selectedOption$.subscribe(property =>
            this.landlord$ = this.propertyEntityService.entities$
                .pipe(
                    map(entities => entities.find(entity => entity.id === property.id))
                )
        );

      /*  this.landlord$ = this.propertyEntityService.entities$
            .pipe(
                map(entities => entities.find(property => property.id === this.id))
            );*/
    }
}
