import { Component, HostListener, ViewChild, ElementRef, NgZone } from '@angular/core';

declare var M;


@Component({
    selector: 'moo-project',
    templateUrl: './project.template.html',
    styleUrls: ['./project.style.scss']
})
export class ProjectComponent {
	projects = [1, 2, 3, 4, 5, 6];
	activeSlide: number = 0;

	constructor() {
	}

	ngOnDestroy() {
		// destroy all the subscriptions at once
		// this.subs.unsubscribe();
	}
}
