import { TypeService } from './type.service';
import { BaseDataSource } from '../../../../shared/base-data-source';

export class TypeDataSource extends BaseDataSource {
    constructor(service: TypeService) {
        super(service);
    }
}
