import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { BaseModel } from '../models/base-model';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export class BaseEntityService <T extends BaseModel> extends EntityCollectionServiceBase<T> {

    constructor(entity: string, serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super(entity, serviceElementsFactory);
    }

    fetchAll(filter = '', page = 1, limit = 3,
             sortField = '', sortDirection = '', whereField = '',
             whereValue = ''): any {
       // return true;
       this.getWithQuery({
            'filter': filter,
            'page': page.toString(),
            'limit': limit.toString(),
            'sortField': sortField,
            'sortDirection': sortDirection,
            'whereField': whereField,
            'whereValue': whereValue
        }).subscribe(data => {
            return data;
       });

        /*params: new HttpParams()
            .set('filter', filter)
            .set('page', page.toString())
            .set('limit', limit.toString())
            .set('sortField', sortField)
            .set('sortDirection', sortDirection)
            .set('whereField', whereField)
            .set('whereValue', whereValue)*/

    }

}
