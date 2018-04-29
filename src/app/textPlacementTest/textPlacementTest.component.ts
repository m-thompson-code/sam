import { Component, HostListener, Input, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';

import { SpacedComponent } from '../spaced/spaced.component';

@Component({
  selector: 'moo-text-placement-test',
  styleUrls: [ './textPlacementTest.style.css' ],
  templateUrl: './textPlacementTest.template.html',
  providers: [ ]
})
export class TextPlacementTestComponent {
 	@Input() urls: any[];

	@ViewChild("container") container: ElementRef;

	// source: https://stackoverflow.com/questions/40165294/access-multiple-viewchildren-using-viewchild
	@ViewChildren('strComponent', {read: ElementRef}) strViewChildren: QueryList<SpacedComponent>;
	strComponents: any[];
	// s: any[];

	viewLoaded: boolean;

	JSON: any;

	@Input() containerWidth: number;
	@Input() marginRight: number;

	constructor() {
	}

	ngOnInit() {
		this.JSON = JSON;
		this.viewLoaded = false;
	}

	ngAfterViewInit() {
		console.log(this.container);
		console.log(this.container.nativeElement.getBoundingClientRect().y);

		console.log(this.strViewChildren);
		
		setTimeout(() => {
			this.strComponents = [];
			// this.s = [];

			this.strViewChildren.forEach(str => {
				this.strComponents.push(str);
				// this.s.push(0);

				// console.log(str);
				// console.log(str.nativeElement.getBoundingClientRect().y);
			});

			this.getStringRows();
			setTimeout(() => {
				this.viewLoaded = true;
			}, 1);
		}, 1);
	}

	getStringRows() {
		this.viewLoaded = false;
		setTimeout(() => {
			if (this.strViewChildren && this.strComponents) {
				var y = 0, rowHeight = 0;
				for (var i = 0; i < this.strComponents.length; i++) {
					if (this.strComponents[i].nativeElement.getBoundingClientRect().y > rowHeight) {
						y += 1;
						rowHeight = this.strComponents[i].nativeElement.getBoundingClientRect().y;
					}

					this.urls[i].y = y;
					console.log(this.urls[i].y);
				}	
			}

			setTimeout(() => {
				this.viewLoaded = true;
			}, 1);
		}, 1);
	}

	// https://scotch.io/tutorials/responsive-equal-height-with-angular-directive
	@HostListener('window:resize')
    onResize() {
        // // call our matchHeight function here
        // this.matchHeight(this.el.nativeElement, this.myMatchHeight);
        console.log(this.getStringRows());
    }
}
