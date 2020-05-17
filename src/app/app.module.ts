import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import {
  AgmCoreModule
} from '@agm/core';
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

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: 'http://localhost/2020/Rental/api/public/api/v1',
  timeout: 1000 * 60, // request timeout }
};

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

@NgModule({
  imports: [
    BrowserAnimationsModule,
    SharedModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    }),
    CoreModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EntityDataModule.forRoot({})
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
      ConfirmationDialogComponent

  ],
  providers: [
/*
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
*/
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
               private amenityDataService: AmenityDataService) {

    eds.registerMetadataMap({
          Utility: utilityEntityMetaData,
          Amenity: amenityEntityMetaData,
      PropertyType: propertyTypeEntityMetaData
        });

    entityDataService.registerService('Utility', utilityDataService);
    entityDataService.registerService('Amenity', amenityDataService);
    entityDataService.registerService('PropertyType', propertyTypeDataService);
  }
}
