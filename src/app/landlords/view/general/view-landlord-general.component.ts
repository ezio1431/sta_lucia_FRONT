import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LandlordService } from '../../data/landlord.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandlordModel } from '../../models/landlord-model';

@Component({
    selector: 'robi-view-landlord-general',
    templateUrl: './view-landlord-general.component.html',
    styleUrls: ['./view-landlord-general.component.css']
})
export class ViewLandlordGeneralComponent implements OnInit {

    loader = false;
    landlordID: string;
    landlord$: Observable<LandlordModel>;
    landlordData$: Observable<LandlordModel>;

    constructor(private landlordService: LandlordService,
                private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.landlord$ = this.landlordService.selectedLandlordChanges$;

        this.landlordID = this.route.snapshot.paramMap.get('id');
        this.landlordData$ = this.landlordService.selectedLandlordChanges$;

        this.landlordService.selectedLandlordChanges$.subscribe(data => {
            if (!data) {
                this.landlordData$ = this.landlordService.getById(this.landlordID);
            }
        });


        this.landlordID = this.route.snapshot.paramMap.get('id');
        this.landlordService.selectedLandlordChanges$.subscribe(data => {
            if (data) {
                this.landlordData$ = of(data);
            }
            if (!data) {
                this.landlordService.getById(this.landlordID).subscribe(landlord => {
                    this.landlordData$ = of(landlord);
                    this.landlordService.changeSelectedLandlord(landlord);
                });
            }
        });
    }
}
