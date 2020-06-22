import { Component, HostListener, Input, ViewChildren, QueryList, ElementRef } from '@angular/core';

import { SpacedComponent } from '../spaced/spaced.component';

import { Project } from 'src/app/app.component';

@Component({
  selector: 'moo-text-placement-test',
  styleUrls: [ './textPlacementTest.style.scss' ],
  templateUrl: './textPlacementTest.template.html',
  providers: [ ]
})
export class TextPlacementTestComponent {
 	@Input() public projects?: Project[];

	// @ViewChild("container", { static: true }) private container!: ElementRef<HTMLDivElement>;

	// source: https://stackoverflow.com/questions/40165294/access-multiple-viewchildren-using-viewchild
	@ViewChildren('strComponent', {read: ElementRef}) strViewChildren!: QueryList<SpacedComponent>;
	private strComponents: any[];// TODO: rework to get past this issue of SpacedComponent doesn't have property of nativeElement

	@Input() containerWidth?: number;
	// @Input() marginRight?: number;

	constructor() {
		this.strComponents = [];
	}

	ngAfterViewInit() {
		this.strComponents = [];

		this.strViewChildren.forEach(str => {
			this.strComponents.push(str);
		});

		this.getStringRows();
	}

	public getStringRows(): void {
		if (!this.projects) {
			return;
		}

		if (this.strViewChildren && this.strComponents) {
			for (var i = 0; i < this.strComponents.length; i++) {
				if (!this.projects[i]) {
					return;
				}

				this.projects[i].width = this.strComponents[i].nativeElement.getBoundingClientRect().width;
			}
		}
	}

	// https://scotch.io/tutorials/responsive-equal-height-with-angular-directive
	@HostListener('window:resize')
    public onResize() {
        // // call our matchHeight function here
        // this.matchHeight(this.el.nativeElement, this.myMatchHeight);
		// console.log(this.getStringRows());
		this.getStringRows();
    }
}
