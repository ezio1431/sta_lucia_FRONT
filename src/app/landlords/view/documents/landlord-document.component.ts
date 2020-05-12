import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from '../../../shared/notification.service';


@Component({
    selector: 'robi-landlord-document',
    templateUrl: './landlord-document.component.html',
    styleUrls: ['./landlord-document.component.css']
})
export class LandlordDocumentComponent implements OnInit, AfterViewInit {
    guarantorColumns = [
        'loan_application_id',
        'loan_type',
        'guarantee_amount',
        'member_id',
        'loan_status',
        'reviewed_on'
    ];

    // Data for the list table display
    // pagination
    @ViewChild(MatPaginator, {static: true }) paginator: MatPaginator;
    // Search field
    @ViewChild('search', {static: true}) search: ElementRef;

    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    loader = false;

    memberData: any;
    memberId = '';

    constructor(private notification: NotificationService,
                private dialog: MatDialog) {}

    ngOnInit() {
    }
    /**
     * Handle search and pagination
     */
    ngAfterViewInit() {
    }
}
