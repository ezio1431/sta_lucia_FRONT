import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../shared/delete/confirmation-dialog-component';
import { AddTaskComponent } from './add/add-task.component';
import { TaskModel } from './models/task-model';
import { TaskDataSource } from './data/task-data.source';
import { NotificationService } from '../shared/notification.service';
import { TaskEntityService } from './data/task-entity.service';
import { TaskService } from './data/task.service';

@Component({
    selector: 'robi-tasks',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, AfterViewInit {

    displayedColumns = [
        'first_name',
        'last_name',
        'email'
    ];

    /*'actions',*/

    loader = false;

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    dataSource: TaskDataSource;

    // Pagination
    @ViewChild(MatPaginator, {static: true }) paginator: MatPaginator;
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;

    // Search field
    @ViewChild('search') search: ElementRef;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    // Data for the list table display
    selectedRowIndex = '';

    loading$: Observable<boolean>;
    meta$: Observable<any>;
    tasks$: Observable<any>;
    nextPage = 1;
    loaded: boolean;

    constructor(private taskService: TaskService, private taskEntityService: TaskEntityService,
                private notification: NotificationService, private dialog: MatDialog) {
    }

    /**
     * Initialize data lead
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {
        this.dataSource = new TaskDataSource(this.taskService);
        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);
        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'date', 'desc');
    }

    load(currentPage) {
        const page = currentPage + 1;

        this.taskEntityService.getWithQuery({
            'filter': this.search.nativeElement.value,
            'page': page.toString(),
            'limit': '',
            'sortField': 'updated_at',
            'sortDirection': 'desc'
        });
    }

    /**
     * Search
     */
    filter(currentPage) {
        const page = currentPage + 1;

            this.taskEntityService.getWithQuery({
                'filter': this.search.nativeElement.value,
                'page': page.toString(),
                'limit': '',
                'sortField': 'updated_at',
                'sortDirection': 'desc'
            });
    }

    /**
     * Fetch data from data lead
     */
    loadData() {
        this.dataSource.load(
            this.search.nativeElement.value,
            (this.paginator.pageIndex + 1),
            (this.paginator.pageSize),
            this.sort.active,
            this.sort.direction
        );
    }

    /**
     * Show or hide the load more button bar
     * @param presentPage
     * @param lastPage
     */
   showLoadMoreButton(presentPage, lastPage) {
       return (presentPage + 1) <= lastPage;
   }

    /**
     * Handle search and pagination
     */
    ngAfterViewInit() {
        fromEvent(this.search.nativeElement, 'keyup')
            .pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.loadData();
                })
            ).subscribe();

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

    /**
     * Add dialog launch
     */
    addDialog(mode: string, task?: TaskModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {task,
            mode: mode
        };

        const dialogRef = this.dialog.open(AddTaskComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    this.loadData();
                }
            }
        );
    }

    /**
     * When a task is selected for view
     * @param task
     */
    onSelected(task: TaskModel): void {
        this.selectedRowIndex = task.id;
        this.taskService.changeSelectedLandlord(task);
        this.taskEntityService.changeSelectedLandlord(task);
    }


  /*  onSelected(loan: LoanModel): void {
        this.selectedRowIndex = loan.id;
        this.service.changeSelectedLoan(loan);
    }*/


    /**
     *
     * @param blob
     */
    showFile(blob) {
        const newBlob = new Blob([blob], {type: 'application/pdf'});

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }
        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = 'statement.pdf';
        link.click();
        setTimeout(function() {
            window.URL.revokeObjectURL(data);
        }, 100);
    }

    /**
     * Open Edit form
     * @param task
     */
    openConfirmationDialog(task: TaskModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });

        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(task);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param task
     */
   delete(task: TaskModel) {
        this.loader = true;
        this.taskService.delete(task)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.showNotification('success', 'Success !! Landlord has been deleted.');
                },
                (error) => {
                    this.loader = false;
                    if (!error.error['error']) {
                        this.notification.showNotification('danger', 'Connection Error !! Nothing deleted.' +
                            ' Check Connection and retry. ');
                    } else {
                        this.notification.showNotification('danger', 'Delete Error !! ');
                    }
                });
    }
}
