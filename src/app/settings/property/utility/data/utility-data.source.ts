import { UtilityService } from './utility.service';
import { BaseDataSource } from '../../../../shared/base-data-source';
import { select, Store } from '@ngrx/store';
import { PageQuery } from '../utility-setting.component';
import { selectorUtilityPage } from './ulitity-selectors';
import { tap } from 'rxjs/operators';
import { UtilityEntityService } from './utility-entity.service';

export class UtilityDataSource extends BaseDataSource {
    constructor(store: Store, service?: UtilityService, utilityEntityService?: UtilityEntityService) {
        super(service, store, utilityEntityService);
    }


}
