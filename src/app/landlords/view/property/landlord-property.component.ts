import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from '../../../shared/notification.service';


@Component({
    selector: 'robi-landlord-property',
    templateUrl: './landlord-property.component.html',
    styleUrls: ['./landlord-property.component.css']
})
export class LandlordPropertyComponent implements OnInit, AfterViewInit {
    constructor(private notification: NotificationService) {}

    ngOnInit() {
    }

    /**
     * Handle search and pagination
     */
    ngAfterViewInit() {
    }
}
