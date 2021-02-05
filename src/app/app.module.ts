import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { DashboardComponent } from './dashboard/dashboard.component';
/*import {
  AgmCoreModule
} from '@agm/core';*/
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { ConfirmationDialogComponent } from './shared/delete/confirmation-dialog-component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {
  DefaultDataServiceConfig,
  EntityCollectionReducerMethodsFactory,
  EntityDataModule, EntityDataService, EntityDefinitionService, EntityMetadataMap,
  HttpUrlGenerator,
  PersistenceResultHandler
} from '@ngrx/data';
import { JwtInterceptor } from './core/jwt.interceptor';
import { AppHttpUrlGenerator } from './core/app-http-url-generator';
import { PagePersistenceResultHandler } from './shared/services/pagination/page-persistence-result-handler';
import {
  EntityCollectionPageReducerMethods,
  EntityCollectionPageReducerMethodsFactory
} from './shared/services/pagination/entity-collection-page-reducer-methods';
import { ErrorInterceptor } from './core/error-handler/error.interceptor';
import { UtilityDataService } from './settings/property/utility/data/utility-data.service';
import { AmenityDataService } from './settings/property/amenity/data/amenity-data.service';
import { TypeDataService } from './settings/property/type/data/type-data.service';
import { PropertyDataService } from './properties/data/property-data.service';
import { TenantDataService } from './tenants/data/tenant-data.service';
import { UnitTypeDataService } from './settings/property/unit-type/data/unit-type-data.service';
import { LeaseTypeDataService } from './settings/lease/lease-type/data/lease-type-data.service';
import { LeaseModeDataService } from './settings/lease/lease-mode/data/lease-mode-data.service';
import { TenantTypeDataService } from './settings/lease/tenant-type/data/tenant-type-data.service';
import { PaymentMethodDataService } from './settings/payment/payment-method/data/payment-method-data.service';
import { PaymentFrequencyDataService } from './settings/payment/payment-frequency/data/payment-frequency-data.service';
import { LeaseDataService } from './leases/data/lease-data.service';
import { UtilityBillDataService } from './utility-bills/data/utility-bill-data.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: 'http://localhost/2020/Rental/api/public/api/v1',
  timeout: 1000 * 60, // request timeout }
};

export function sortByUpdatedAtField(item1: any, item2: any) {
 return item2.updated_at - item1.updated_at;
}

const meta = {
  current_page: 1,
  from: 1,
  last_page: '',
  path: '',
  per_page: '',
  to: '',
  total: ''
};

const utilityEntityMetaData: EntityMetadataMap = {
  Utility: {
      sortComparer: sortByUpdatedAtField,
    additionalCollectionState: {
      meta: meta
    }
  }
};

const amenityEntityMetaData: EntityMetadataMap = {
  Amenity: {
    additionalCollectionState: {
      meta: meta
    }
  }
};

const propertyTypeEntityMetaData: EntityMetadataMap = {
  PropertyType: {
    additionalCollectionState: {
      meta: meta
    }
  }
};

const unitTypeEntityMetaData: EntityMetadataMap = {
  UnitType: {
    additionalCollectionState: {
      meta: meta
    }
  }
};

const propertyEntityMetaData: EntityMetadataMap = {
  Property: {
    additionalCollectionState: {
      meta: meta
    }
  }
};

const tenantEntityMetaData: EntityMetadataMap = {
  Tenant: {
    additionalCollectionState: {
      meta: meta
    }
  }
};

const leaseEntityMetaData: EntityMetadataMap = {
  Lease: {
    additionalCollectionState: {
      meta: meta
    }
  }
};

const leaseTypeEntityMetaData: EntityMetadataMap = {
  LeaseType: {
    additionalCollectionState: {
      meta: meta
    }
  }
};

const leaseModeEntityMetaData: EntityMetadataMap = {
  LeaseMode: {
    additionalCollectionState: {
      meta: meta
    }
  }
};

const tenantTypeEntityMetaData: EntityMetadataMap = {
  TenantType: {
    additionalCollectionState: {
      meta: meta
    }
  }
};

const paymentMethodEntityMetaData: EntityMetadataMap = {
  PaymentMethod: {
    additionalCollectionState: {
      meta: meta
    }
  }
};

const paymentFrequencyEntityMetaData: EntityMetadataMap = {
  PaymentFrequency: {
    additionalCollectionState: {
      meta: meta
    }
  }
};

const utilityBillEntityMetaData: EntityMetadataMap = {
  UtilityBill: {
    additionalCollectionState: {
      meta: meta
    }
  }
};

@NgModule({
  imports: [
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    AuthenticationModule,
  /*  AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    }),*/
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EntityDataModule.forRoot({})
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    ConfirmationDialogComponent
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    },

    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HttpUrlGenerator, useClass: AppHttpUrlGenerator },

    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig },
    { provide: PersistenceResultHandler, useClass: PagePersistenceResultHandler },
    { provide: EntityCollectionReducerMethodsFactory, useClass: EntityCollectionPageReducerMethodsFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor (private eds: EntityDefinitionService,
               private entityDataService: EntityDataService,
               private utilityDataService: UtilityDataService,
               private propertyTypeDataService: TypeDataService,
               private unitTypeDataService: UnitTypeDataService,
               private propertyDataService: PropertyDataService,
               private tenantDataService: TenantDataService,
               private leaseTypeDataService: LeaseTypeDataService,
               private leaseModeDataService: LeaseModeDataService,
               private tenantTypeDataService: TenantTypeDataService,
               private paymentMethodDataService: PaymentMethodDataService,
               private paymentFrequencyDataService: PaymentFrequencyDataService,
               private leaseDataService: LeaseDataService,
               private utilityBillDataService: UtilityBillDataService,
               private amenityDataService: AmenityDataService) {

    eds.registerMetadataMap({
          Utility: utilityEntityMetaData,
          Amenity: amenityEntityMetaData,
          PropertyType: propertyTypeEntityMetaData,
          UnitType: unitTypeEntityMetaData,
          Property: propertyEntityMetaData,
          Tenant: tenantEntityMetaData,
          LeaseType: leaseTypeEntityMetaData,
          LeaseMode: leaseModeEntityMetaData,
          TenantType: tenantTypeEntityMetaData,
          PaymentMethod: paymentMethodEntityMetaData,
          PaymentFrequency: paymentFrequencyEntityMetaData,
          UtilityBill: utilityBillEntityMetaData,
          Lease: leaseEntityMetaData,
        });

    entityDataService.registerService('Utility', utilityDataService);
    entityDataService.registerService('Amenity', amenityDataService);
    entityDataService.registerService('PropertyType', propertyTypeDataService);
    entityDataService.registerService('UnitType', unitTypeDataService);
    entityDataService.registerService('Property', propertyDataService);
    entityDataService.registerService('Tenant', tenantDataService);
    entityDataService.registerService('LeaseType', leaseTypeDataService);
    entityDataService.registerService('LeaseMode', leaseModeDataService);
    entityDataService.registerService('TenantType', tenantTypeDataService);
    entityDataService.registerService('PaymentMethod', paymentMethodDataService);
    entityDataService.registerService('PaymentFrequency', paymentFrequencyDataService);
    entityDataService.registerService('Lease', leaseDataService);
    entityDataService.registerService('UtilityBill', utilityBillDataService);



  }
}
