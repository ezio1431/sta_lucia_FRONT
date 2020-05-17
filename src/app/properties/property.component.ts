import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, filter, first, map, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../shared/delete/confirmation-dialog-component';
import { AddPropertyComponent } from './add/add-property.component';
import { PropertyModel } from './models/property-model';
import { PropertyDataSource } from './data/property-data.source';
import { NotificationService } from '../shared/notification.service';
import { PropertyEntityService } from './data/property-entity.service';
import { UtilityEntityService } from '../settings/property/utility/data/utility-entity.service';
import { AmenityEntityService } from '../settings/property/amenity/data/amenity-entity.service';
import { UtilityModel } from '../settings/property/utility/model/utility-model';
import { TypeEntityService } from '../settings/property/type/data/type-entity.service';

@Component({
    selector: 'robi-properties',
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit, AfterViewInit {

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    // Search field
    @ViewChild('search') search: ElementRef;

    // Data for the list table display
    selectedRowIndex = '';

    loading$: Observable<boolean>;
    meta$: Observable<any>;
    landlords$: Observable<any>;
    nextPage = 1;
    loaded: boolean;

   // utilities$: Observable<UtilityModel>;
    utilities$: any;
    isLoaded: boolean;
    amenities$: Observable<any>;
    properties$: Observable<any>;
    propertyTypes$: Observable<any>;

    constructor(private propertyEntityService: PropertyEntityService,
                private propertyTypeEntityService: TypeEntityService,
                private notification: NotificationService,
                private dialog: MatDialog, private utilityEntityService: UtilityEntityService,
                private amenityEntityService: AmenityEntityService) {
    }

    /**
     * Initialize data lead
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        // load properties
        this.loadProperties();


        this.loadPropertyTypes();

        // fetch utilities
        this.loadUtilities ();
       /*this.utilityEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.utilityEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
               this.utilities$ = this.utilityEntityService.entities$;
           });*/

        // fetch amenities
        this.loadAmenities();
       /* this.amenityEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.amenityEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.amenities$ = this.amenityEntityService.entities$;
        });*/

    /*    this.amenities$ = this.amenityEntityService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                        this.amenityEntityService.getAll();
                    }
                }),
                filter(loaded => !!loaded),
                first()
            );*/



        const loadedx = this.propertyEntityService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                         this.propertyEntityService.getAll();
                    }
                }),
                  filter(loaded => !!loaded),
                  first()
            );

     /*   this.landlords$ = this.propertyEntityService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                        return this.propertyEntityService.getAll();
                    }
                })
              //  filter(loaded => !!loaded),
              //  first()
            );*/

     if (loadedx) {
         this.landlords$ = this.propertyEntityService.entities$
             .pipe(
                 map(landlords => {
                     this.nextPage++;
                     return landlords;
                 })
             );

         this.meta$ = this.propertyEntityService.meta$;

         // this.initialLoad();

         // Loading indicator
         this.loading$ = this.propertyEntityService.loading$.pipe(
             delay(0)
         );
     }

        // Load pagination data
    //    this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
       // this.dataSource.load('', 0, 0, 'updated_at', 'desc');
    }

    initialLoad() {
        this.landlords$ = this.propertyEntityService.entities$
            .pipe(
                map(landlords => {
                   // this.nextPage++;
                    return landlords;
                })
            );
    }

    /**
     * Load Property entities either from store or API
     */
    loadProperties() {
        this.propertyEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.propertyEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.properties$ = this.propertyEntityService.entities$;
        });
    }

    /**
     * Load property Types
     */
    loadPropertyTypes() {
        this.propertyTypeEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.propertyTypeEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.propertyTypes$ = this.propertyTypeEntityService.entities$;
        });
    }

    /**
     * Load Amenity entities either from store or API
     */
    loadAmenities() {
        this.amenityEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.amenityEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.amenities$ = this.amenityEntityService.entities$;
        });
    }

    /**
     * Load Utility entities either from API or store
     */
    loadUtilities () {
        this.utilityEntityService.loaded$
            .pipe(
                tap(loaded => {
                    this.isLoaded = loaded;
                    if (!loaded) {
                        this.utilityEntityService.getAll();
                    }
                }),
            ).subscribe(data => {
            this.utilities$ = this.utilityEntityService.entities$;
        });
    }


    load(currentPage) {
        const page = currentPage + 1;

        this.propertyEntityService.getWithQuery({
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

            this.propertyEntityService.getWithQuery({
                'filter': this.search.nativeElement.value,
                'page': page.toString(),
                'limit': '',
                'sortField': 'updated_at',
                'sortDirection': 'desc'
            });
    }

    /**
     * Load data from Api
     */
   loadData() {
        this.propertyEntityService.getWithQuery({
           'filter': this.search.nativeElement.value,
           'page': this.nextPage.toString(),
           'limit': '3',
           'sortField': 'updated_at',
           'sortDirection': 'desc'
       });

       this.nextPage++;
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
                   // this.nextPage = 0;
                    this.filter(0);
                   // this.load(0);
                })
            ).subscribe();

        /* this.paginator.page.pipe(
             tap(() => this.loadData() )
         ).subscribe();*/

        // reset the paginator after sorting
        //  this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        /*  merge(this.sort.sortChange, this.paginator.page)
              .pipe(
                  tap(() => this.loadData())
              )
              .subscribe();*/
    }

    /**
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        // this.loadData()
        // this.initialLoad();
        this.filter(0);
      //  this.load(0);
    }

    /**
     * Add dialog launch
     */
    addDialog(mode: string, landlord?: PropertyModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {landlord,
            mode: mode
        };

        const dialogRef = this.dialog.open(AddPropertyComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                   // this.loadData();
                }
            }
        );
    }

    /**
     * When a landlord is selected for view
     * @param landlord
     */
    onSelected(landlord: PropertyModel): void {
        this.selectedRowIndex = landlord.id;
        this.propertyEntityService.changeSelectedLandlord(landlord);
    }

    /**
     * Fetch data from data lead
     */
   /* loadData() {
        this.dataSource.load(
            this.search.nativeElement.value,
            (this.paginator.pageIndex + 1),
            (this.paginator.pageSize),
            this.sort.active,
            this.sort.direction
        );
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
     * @param landlord
     */
    openConfirmationDialog(landlord: PropertyModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });

        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(landlord);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param landlord
     */
   delete(landlord: PropertyModel) {
       // this.loader = true;
        this.propertyEntityService.delete(landlord);
     /*   this.service.delete(lead)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.showNotification('success', 'Success !! Lead has been deleted.');
                },
                (error) => {
                    this.loader = false;
                    if (!error.error['error']) {
                        this.notification.showNotification('danger', 'Connection Error !! Nothing deleted.' +
                            ' Check Connection and retry. ');
                    } else {
                        this.notification.showNotification('danger', 'Delete Error !! ');
                    }
                });*/
    }
}
