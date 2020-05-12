import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { LandlordEntityService } from '../../data/landlord-entity.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'robi-view-landlord-general',
    templateUrl: './view-landlord-general.component.html',
    styleUrls: ['./view-landlord-general.component.css']
})
export class ViewLandlordGeneralComponent implements OnInit {

    memberData: any;
    memberId = '';
    memberData$: any;

    profilePicUrl: string;
    profilePicFileToUpload: File = null;

    imageToShow: any;

    loader = false;
    memberShipForm = false;

    landlord$: Observable<any>;

    constructor(private landlordEntityService: LandlordEntityService, private notification: NotificationService,
                private dialog: MatDialog) {}

    ngOnInit() {
      //  this.landlord$ = this.landlordEntityService.selectedLandlordChanges$;

        this.landlordEntityService.selectedLandlordChanges$.subscribe(landlord =>
            this.landlord$ = this.landlordEntityService.entities$
                .pipe(
                    map(entities => entities.find(entity => entity.id === landlord.id))
                )
        );

      /*  this.landlord$ = this.landlordEntityService.entities$
            .pipe(
                map(entities => entities.find(landlord => landlord.id === this.id))
            );*/
    }
}
