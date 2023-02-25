import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TenantModel } from '../../models/tenant-model';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TenantService } from '../../data/tenant.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'robi-view-tenant-general',
    templateUrl: './view-tenant-general.component.html',
    styleUrls: ['./view-tenant-general.component.css']
})
export class ViewTenantGeneralComponent implements OnInit {
    loader = false;
    tenantID: string;
    tenantData$: Observable<TenantModel>;
    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private tenantService: TenantService,
                private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.tenantID = this.route.snapshot.paramMap.get('id');
        this.tenantService.selectedTenantChanges$.subscribe(data => {
            if (data) {
                this.tenantData$ = of(data);
            }
            if (!data) {
                this.tenantService.getById(this.tenantID).subscribe(tenant => {
                    this.tenantData$ = of(tenant);
                    this.tenantService.changeSelectedTenant(tenant);
                });
            }
        });
    }
}
