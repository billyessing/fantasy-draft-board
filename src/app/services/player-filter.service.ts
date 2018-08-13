import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayerModel } from '../models/player.model';
import { distinctUntilChanged, map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerFilterService {

  constructor() { }

  getFilteredStream(stream$: Observable<any>, query: string, includeProps?: string|string[]): Observable<any> {
    return stream$.pipe(
      // TODO: figure out difference between => { } and plain => 
      map(items => items.filter(item => this.filterStream(item, query, includeProps))));
  }

  filterStream(item: object, query: string, includeProps?: string | string[]): boolean {
    const lowerQuery = query.toLowerCase();

    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        
        // third check automatically filters by position
        if (!includeProps || includeProps.indexOf(key) !== -1 || item['position'] == includeProps[0]) {
          const val = item[key];
          
          if (val != null && val.toString().toLowerCase().indexOf(lowerQuery) !== -1) {
            return true;
          }
        }
      }
    }
    return false;
  }
}
