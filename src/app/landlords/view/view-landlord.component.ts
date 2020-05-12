import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../shared/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandlordEntityService } from '../data/landlord-entity.service';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { LandlordModel } from '../models/landlord-model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddLandlordComponent } from '../add/add-landlord.component';

@Component({
    selector: 'robi-view-landlord',
    styleUrls: ['./view-landlord.component.scss'],
    templateUrl: './view-landlord.component.html'
})
export class ViewLandlordComponent implements OnInit, AfterViewInit  {

    form: FormGroup;
    generalForm: FormGroup;
    guarantorForm: FormGroup;
    assetForm: FormGroup;

    formErrors: any;

    loader = false;

    memberStatuses: any = [];
    members: any = [];
    guarantorStatues: any = [];

    id: string;

    routeData: any;

    memberData: any;
    memberId = '';
    memberData$: any;

    imageToShow: any;

    landlord$: Observable<any>;

    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private landlordEntityService: LandlordEntityService,
                private notification: NotificationService,
                private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');

      /*  this.landlord$ = this.landlordEntityService.entities$
            .pipe(
                map(landlords => {
                   return landlords.find(landlord => landlord.id === this.id);
                })
            );*/

     //   this.landlord$ = this.landlordEntityService.selectedLandlordChanges$;
    //    this.landlord$ = this.landlordEntityService.getByKey(this.id);


        /*this.landlord$ = this.landlordEntityService.entities$
            .pipe(
                map(landlords => {
                    this.nextPage++;
                    return landlords;
                })
            );*/

        this.landlord$ = this.landlordEntityService.entities$
            .pipe(
                map(entities => entities.find(landlord => landlord.id === this.id))
            );
    }

    /**
     * Add dialog launch
     */
    addDialog(mode: string, landlord?: LandlordModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {landlord,
            mode: mode
        };

        const dialogRef = this.dialog.open(AddLandlordComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    // this.loadData();
                }
            }
        );
    }

    onOutletActivated(componentReference) {
    }

    ngAfterViewInit(): void {}

}
