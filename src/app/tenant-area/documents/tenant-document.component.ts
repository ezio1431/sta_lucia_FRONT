import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TenantDocumentDataSource } from '../../tenants/view/document/data/tenant-document-data.source';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/delete/confirmation-dialog-component';
import { Observable } from 'rxjs';
import { TenantService } from '../../tenants/data/tenant.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { TenantDocumentService } from '../../tenants/view/document/data/tenant-document.service';
import { select, Store } from '@ngrx/store';
import { selectorIsLandlord, selectorUserID } from '../../authentication/authentication.selectors';
import { AppState } from '../../reducers';
import { TenantDocumentModel } from '../../tenants/view/document/models/tenant-document-model';
import { NotificationService } from '../../core/core.module';

@Component({
  selector: 'robi-user-profile',
  templateUrl: './tenant-document.component.html',
  styleUrls: ['./tenant-document.component.css']
})
export class TenantDocumentComponent implements OnInit {
  displayedColumns = [
    'created_at',
    'document',
    'actions'
  ];

  tenantDocumentDataSource: TenantDocumentDataSource;
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
  tenantID: string;

  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  isAdmin$: Observable<boolean>;
  constructor(private notification: NotificationService,
              private store: Store<AppState>,
              private tenantService: TenantService,
              private translateService: TranslateService,
              private dialog: MatDialog,
              private authenticationService: AuthenticationService,
              private tenantDocumentService: TenantDocumentService) {
    this.isAdmin$ = this.authenticationService.isAdmin();
    this.store.pipe(select(selectorUserID)).subscribe(userID => this.tenantID = userID);
  }

  ngOnInit() {
    /*this.tenantService.selectedTenantChanges$.subscribe(data => {
      if (data) {
        this.tenantID = data.id;
      }
    });*/

    this.tenantDocumentDataSource = new TenantDocumentDataSource(this.tenantDocumentService);
    this.tenantDocumentDataSource.meta$.subscribe((res) => this.meta = res);
    this.tenantDocumentDataSource.load('', 0, 0, 'updated_at',
        'desc', 'tenant_id', this.tenantID);
  }

  loadData() {
    this.tenantDocumentDataSource.load(
        this.search.nativeElement.value,
        (this.paginator.pageIndex + 1),
        (this.paginator.pageSize),
        this.sort.active,
        this.sort.direction, 'tenant_id', this.tenantID
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
      formData.append('tenant_id', this.tenantID);
      this.uploadDocument(formData);
    }
  }

  /**
   * Upload profile image to server
   * @param formData
   */
  private uploadDocument(formData: FormData) {
    this.tenantDocumentService.uploadDocument(formData)
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
    this.tenantDocumentService.fetchDocument(documentID).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
      this.loader = false;
    }, error => {
      this.loader = false;
    });
  }

  openConfirmationDialog(document: TenantDocumentModel) {

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

  delete(document: TenantDocumentModel) {
    this.loader = true;
    this.tenantDocumentService.delete(document)
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
