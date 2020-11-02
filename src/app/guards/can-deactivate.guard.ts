// source: https://angular.io/guide/router#cancel-and-save
// source: Search 'src/app/can-deactivate-guard.service.ts' at https://angular.io/guide/router#cancel-and-save;
import { Router } from '@angular/router';

import { Injectable }    from '@angular/core';
import { CanDeactivate } from '@angular/router';
// import { Observable }    from 'rxjs';
import { OverlayGalleryService } from '@app/services/overlay-gallery.service';
 
export interface CanComponentDeactivate {
//  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
 	canDeactivate: () => Promise<boolean>;
}
 
@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
	constructor(private router: Router, private overlayGalleryService: OverlayGalleryService) {
		this.router = router;
	}

  	// public canDeactivate(component: CanComponentDeactivate): boolean {
	// // 	return this._canDeactivate(component).then(_canDeactivate => {
	// // 	});
	// //   	if (component.canDeactivate ? component.canDeactivate() : true) {
	// //   		return true;
	// //   	} else {
	// // 		// TODO: This shouldn't be needed anymore for Angular 9+
	// //   		// source: https://github.com/angular/angular/issues/12851
	// //   		// This allows for the deactivate guard to work twice+ in a row
	// //   		window.history.pushState({}, "", this.router.url);
	// //   	}

	// //     return false;
	// //   }
	  
	public canDeactivate(component?: CanComponentDeactivate): Promise<boolean> {
		return this._canDeactivate(component).then(_canDeactivate => {
			if (!_canDeactivate) {
				// Fix history state
				//
				// TODO: This shouldn't be needed anymore for Angular 9+
				// source: https://github.com/angular/angular/issues/12851
				// This allows for the deactivate guard to work twice+ in a row
				window.history.pushState({}, "", this.router.url);
			}

			return _canDeactivate;
		})
	}

	public _canDeactivate(component?: CanComponentDeactivate): Promise<boolean> {
		if (this.overlayGalleryService.active) {
			this.overlayGalleryService.deactivate();
			return Promise.resolve(false);
		}

		if (!component || !component.canDeactivate) {
			return Promise.resolve(true);
		}

		return component.canDeactivate();
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
