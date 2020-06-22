// source: https://angular.io/guide/router#cancel-and-save
// source: Search 'src/app/can-deactivate-guard.service.ts' at https://angular.io/guide/router#cancel-and-save;
import { Router } from '@angular/router';

import { Injectable }    from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable }    from 'rxjs';
 
export interface CanComponentDeactivate {
 canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
 
@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
	constructor(private router: Router) {
		this.router = router;
	}

  	public canDeactivate(component: CanComponentDeactivate): boolean {
	  	if (component.canDeactivate ? component.canDeactivate() : true) {
	  		return true;
	  	} else {
			// TODO: This shouldn't be needed anymore for Angular 9+
	  		// source: https://github.com/angular/angular/issues/12851
	  		// This allows for the deactivate guard to work twice+ in a row
	  		window.history.pushState({}, "", this.router.url);
	  	}

	    return false;
  	}
}

// Add this to whatever component that uses this guard
//
// canDeactivate(): Observable<boolean> | boolean {
//   return !this.formHasChanges || window.confirm('Do you really want to discard your changes?'));
// }
//
// Also add `, canDeactivate:[CanDeactivateGuard]` to its routes
// i.e.:   { path: 'home',  component: HomeContainerComponent, canActivate: [LoggedInGuard], canDeactivate:[CanDeactivateGuard] },
