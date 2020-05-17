import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { PropertyEntityService } from '../../data/property-entity.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'robi-view-property-general',
    templateUrl: './view-property-general.component.html',
    styleUrls: ['./view-property-general.component.css']
})
export class ViewPropertyGeneralComponent implements OnInit {

    memberData: any;
    memberId = '';
    memberData$: any;

    profilePicUrl: string;
    profilePicFileToUpload: File = null;

    imageToShow: any;

    loader = false;
    memberShipForm = false;

    landlord$: Observable<any>;

    constructor(private propertyEntityService: PropertyEntityService, private notification: NotificationService) {}

    ngOnInit() {
      //  this.landlord$ = this.propertyEntityService.selectedLandlordChanges$;

        this.propertyEntityService.selectedChanges$.subscribe(property =>
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
