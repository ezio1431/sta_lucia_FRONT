import { AmenityService } from './amenity.service';
import { BaseDataSource } from '../../../../shared/base-data-source';
import { Store } from '@ngrx/store';
import { UtilityService } from '../../utility/data/utility.service';
import { UtilityEntityService } from '../../utility/data/utility-entity.service';
import { AmenityEntityService } from './amenity-entity.service';

export class AmenityDataSource extends BaseDataSource {
   /* constructor(service: AmenityService) {
        super(service);
    }*/

    constructor(store: Store, service?: AmenityService, amenityEntityService?: AmenityEntityService) {
        super(service, store, null, amenityEntityService);
    }
}
