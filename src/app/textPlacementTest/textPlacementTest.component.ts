import { Component, HostListener, Input, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';

import { SpacedComponent } from '../spaced/spaced.component';

@Component({
  selector: 'moo-text-placement-test',
  styleUrls: [ './textPlacementTest.style.scss' ],
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
		this.strComponents = [];

		this.strViewChildren.forEach(str => {
			this.strComponents.push(str);
		});

		this.getStringRows();
		this.viewLoaded = true;
	}

	getStringRows() {
		if (this.strViewChildren && this.strComponents) {
			var y = 0, rowHeight = 0;
			for (var i = 0; i < this.strComponents.length; i++) {
				this.urls[i].width = this.strComponents[i].nativeElement.getBoundingClientRect().width;
			}
		}

		this.viewLoaded = true;
	}

	// https://scotch.io/tutorials/responsive-equal-height-with-angular-directive
	@HostListener('window:resize')
    onResize() {
        // // call our matchHeight function here
        // this.matchHeight(this.el.nativeElement, this.myMatchHeight);
		// console.log(this.getStringRows());
		this.getStringRows();
    }
}
