import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TaskEntityService } from './task-entity.service';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TaskResolverService implements Resolve<boolean> {

    constructor(private landlordService: TaskEntityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.landlordService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                         this.landlordService.getAll();
                    }
                }),
               filter(loaded => !!loaded),
               first()
            );
    }
}
