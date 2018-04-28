import { Component, Input, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';

import { SpacedComponent } from '../spaced/spaced.component';

@Component({
  selector: 'moo-text-placement-test',
  styleUrls: [ './textPlacementTest.style.css' ],
  templateUrl: './textPlacementTest.template.html',
  providers: [ ]
})
export class TextPlacementTestComponent {
 	@Input() strs[];

	@ViewChild("container") container: ElementRef;

	// source: https://stackoverflow.com/questions/40165294/access-multiple-viewchildren-using-viewchild
	@ViewChildren('strComponent', {read: ElementRef}) strViewChildren: QueryList<SpacedComponent>;
	strCompents: any[];

	viewLoaded: boolean;

	JSON: any;

	constructor() {
	}

	ngOnInit() {
		this.JSON = JSON;
		this.viewLoaded = false;
	}

	ngAfterViewInit() {
		// this.viewLoaded = true;
		// this.strComponents = [];


		setTimeout(() => {
			// this.viewLoaded = true;
			// console.log(this.strViewChildren);
		// }, 1);
		setTimeout(() => {
			this.viewLoaded = true;
			
			console.log(this.container);
			console.log(this.container.nativeElement.getBoundingClientRect().y);
			this.strComponents = [];
			this.strViewChildren.forEach(str => {
				this.strComponents.push(str);
				// console.log(str);
				console.log(str.nativeElement.getBoundingClientRect().y);
			});
		}, 1);
	}
}
