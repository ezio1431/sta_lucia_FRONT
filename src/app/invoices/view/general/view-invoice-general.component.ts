import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceEntityService } from '../../data/invoice-entity.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'robi-view-property-general',
    templateUrl: './view-invoice-general.component.html',
    styleUrls: ['./view-invoice-general.component.css']
})
export class ViewInvoiceGeneralComponent implements OnInit {

    memberData: any;
    memberId = '';
    memberData$: any;

    profilePicUrl: string;
    profilePicFileToUpload: File = null;

    imageToShow: any;

    loader = false;
    memberShipForm = false;

    landlord$: Observable<any>;

    constructor(private propertyEntityService: InvoiceEntityService, private notification: NotificationService) {}

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
