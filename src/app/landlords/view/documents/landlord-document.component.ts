import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../../../core/core.module';
import { LandlordDocumentService } from './data/landlord-document.service';
import { TranslateService } from '@ngx-translate/core';
import { LandlordService } from '../../data/landlord.service';
import { LandlordDocumentDataSource } from './data/landlord-document-data.source';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';
import { LandlordDocumentModel } from './models/landlord-document-model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../authentication/authentication.service';

@Component({
    selector: 'robi-landlord-document',
    templateUrl: './landlord-document.component.html',
    styleUrls: ['./landlord-document.component.css']
})
export class LandlordDocumentComponent implements OnInit {
    displayedColumns = [
        'created_at',
        'document',
        'actions'
    ];

    landlordDocumentDataSource: LandlordDocumentDataSource;
    @ViewChild('search') search: ElementRef;
    @ViewChild(MatPaginator, {static: true }) paginator: MatPaginator;
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    loader = false;
    documentToUpload: File = null;
    photoUrl = '';
    landlordID: string;

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;
    isAdmin$: Observable<boolean>;
    constructor(private notification: NotificationService,
                private landlordService: LandlordService,
                private translateService: TranslateService,
                private dialog: MatDialog,
                private authenticationService: AuthenticationService,
                private landlordDocumentService: LandlordDocumentService) {
        this.isAdmin$ = this.authenticationService.isAdmin();
    }

    ngOnInit() {
        this.landlordService.selectedLandlordChanges$.subscribe(data => {
            if (data) {
                this.landlordID = data.id;
            }
        });

        this.landlordDocumentDataSource = new LandlordDocumentDataSource(this.landlordDocumentService);
        this.landlordDocumentDataSource.meta$.subscribe((res) => this.meta = res);
        this.landlordDocumentDataSource.load('', 0, 0, 'updated_at',
            'desc', 'landlord_id', this.landlordID);
    }

    loadData() {
        this.landlordDocumentDataSource.load(
            this.search.nativeElement.value,
            (this.paginator.pageIndex + 1),
            (this.paginator.pageSize),
            this.sort.active,
            this.sort.direction, 'landlord_id', this.landlordID
        );
    }

    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData()
    }

    /**
     * @param file
     */
    onDocumentSelect(file: FileList) {
        if (file.length > 0) {
            this.documentToUpload = file.item(0);
            const reader = new FileReader();
            reader.onload = (event: any) => {
                this.photoUrl = event.target.result;
            };
            reader.readAsDataURL(this.documentToUpload);

            this.loader = true;
            // upload to server
            const formData = new FormData();
            formData.append('document', this.documentToUpload);
            formData.append('landlord_id', this.landlordID);
            this.uploadDocument(formData);
        }
    }

    /**
     * Upload profile image to server
     * @param formData
     */
    private uploadDocument(formData: FormData) {
        this.landlordDocumentService.uploadDocument(formData)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.success(this.translateService.instant('documents.list.create'));
                },
                (error) => {
                    this.loader = false;
                    if (error.payment === 0) {
                        return;
                    }
                });
    }

    downloadDocument(documentID: string) {
        console.log(documentID);
        this.loader = true;
            this.landlordDocumentService.fetchDocument(documentID).subscribe(res => {
                const fileURL = URL.createObjectURL(res);
                window.open(fileURL, '_blank');
                this.loader = false;
            }, error => {
                this.loader = false;
            });
    }

    openConfirmationDialog(document: LandlordDocumentModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });
        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(document);
            }
            this.dialogRef = null;
        });
    }

    delete(document: LandlordDocumentModel) {
        this.loader = true;
        this.landlordDocumentService.delete(document)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.success(this.translateService.instant('documents.list.delete'));
                },
                (error) => {
                    this.loader = false;
                });
    }
}
