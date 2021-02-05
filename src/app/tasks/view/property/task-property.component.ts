import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from '../../../shared/notification.service';
import { PropertyService } from '../../../properties/data/property.service';
import { PropertyDataSource } from '../../../properties/data/property-data.source';
import { TaskService } from '../../data/task.service';


@Component({
    selector: 'robi-landlord-property',
    templateUrl: './task-property.component.html',
    styleUrls: ['./task-property.component.css']
})
export class TaskPropertyComponent implements OnInit, AfterViewInit {
    propertyColumns = [
        'member_id',
        'id_number'
    ];

    // Data for the list table display
    propertyDataSource: PropertyDataSource;

    // pagination
    @ViewChild(MatPaginator, {static: true }) paginator: MatPaginator;

    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    // Search field
    @ViewChild('search', {static: true}) search: ElementRef;

    loader = false;

    landlordData: any;
    landlordId: string;

    constructor(private notification: NotificationService, private propertyService: PropertyService,
                private landlordService: TaskService) {}

    ngOnInit() {
        this.landlordService.selectedLandlordChanges$.subscribe(data => {
            if (data) {
                console.log('this.landlordService.selectedLandlordChanges$', data);
                this.landlordData = data;
                this.landlordId = data.id;
            }
        });

        this.propertyDataSource = new PropertyDataSource(this.propertyService);
        // Load pagination data
        this.propertyDataSource.meta$.subscribe((res) => this.meta = res);
        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.propertyDataSource.load('', 0, 0, 'created_at',
            'desc', 'landlord_id', this.landlordId);
    }

    /**
     * Fetch data from data lead
     */
    loadData() {
        this.propertyDataSource.load(
            this.search.nativeElement.value,
            (this.paginator.pageIndex + 1),
            (this.paginator.pageSize),
            this.sort.active,
            this.sort.direction,
            'landlord_id', this.landlordId
        );
    }

    /**
     * Handle search and pagination
     */
    ngAfterViewInit() {
        this.paginator.page.pipe(
            tap(() => this.loadData() )
        ).subscribe();

        // reset the paginator after sorting
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.loadData())
            )
            .subscribe();
    }

    /**
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData()
    }
}
