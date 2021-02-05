import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskEntityService } from '../../data/task-entity.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'robi-view-landlord-general',
    templateUrl: './view-task-general.component.html',
    styleUrls: ['./view-task-general.component.css']
})
export class ViewTaskGeneralComponent implements OnInit {

    memberData: any;
    memberId = '';
    memberData$: any;

    profilePicUrl: string;
    profilePicFileToUpload: File = null;

    imageToShow: any;

    loader = false;
    memberShipForm = false;

    landlord$: Observable<any>;

    constructor(private landlordEntityService: TaskEntityService, private notification: NotificationService,
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
