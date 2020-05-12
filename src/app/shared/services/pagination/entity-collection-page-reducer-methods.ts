import {
    EntityAction,
    EntityCollection,
    EntityCollectionReducerMethodMap,
    EntityCollectionReducerMethods,
    EntityDefinition,
    EntityDefinitionService
} from '@ngrx/data';
import { Injectable } from '@angular/core';

@Injectable()
export class EntityCollectionPageReducerMethodsFactory {
    constructor(private entityDefinitionService: EntityDefinitionService) { }

    /** Create the  {EntityCollectionReducerMethods} for the named entity type */
    create<T>(entityName: string): EntityCollectionReducerMethodMap<T> {
        const definition = this.entityDefinitionService.getDefinition<T>(entityName);
        const methodsClass = new EntityCollectionPageReducerMethods(entityName, definition);

        return methodsClass.methods;
    }
}

export class EntityCollectionPageReducerMethods<T> extends EntityCollectionReducerMethods<T> {
    constructor(public entityName: string, public definition: EntityDefinition<T>) {
        super(entityName, definition);
    }

    protected queryAllSuccess(collection: EntityCollection<T>, action: EntityAction<T[]>): EntityCollection<T> {
        const ec = super.queryAllSuccess(collection, action);
        console.log('action', action);
        if ((action.payload as any).meta) {
            (ec as any).meta = (action.payload as any).meta;
        }
        return ec;
    }

    protected queryManySuccess(collection: EntityCollection<T>, action: EntityAction<T[]>): EntityCollection<T> {
        const ec = super.queryManySuccess(collection, action);
        if ((action.payload as any).meta) {
            (ec as any).meta = (action.payload as any).meta;
        }
        return ec;
    }


    protected removeAll(collection: EntityCollection<T>, action: EntityAction<T>): EntityCollection<T> {
        const ec = super.removeAll(collection, action);
        (ec as any).meta = undefined;
        return ec;
    }
}
