import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';


/**
 * Service that serves as a wrapper for angular router to make finding a param easier.
 * It extracts a given param searching in every route from root to last child.
 */

@Injectable({
  providedIn: 'root'
})
export class ParamTrackerService {

  paramSubject = new BehaviorSubject<string>('');

  constructor(private router: Router, private route: ActivatedRoute) { }

  getParam(paramName: string) {
    const paramMaps = [];
    let currRoute = this.route.root;

    if (!currRoute) {
      return '';
    }

    do {
      // there is a case where no snapshot is added to activatedRoute
      if (currRoute.snapshot) {
        paramMaps.push(currRoute.snapshot.paramMap);
      }
      currRoute = currRoute.firstChild;
    }
    while (currRoute);

    for (const pMap of paramMaps) {
      if (pMap.has(paramName)) {
        return pMap.get(paramName);
      }
    }
    return '';
  }

  param$(paramName: string) {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getParam(paramName))
    );
  }

}
