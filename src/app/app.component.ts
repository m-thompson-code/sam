import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';

import * as firebase from "firebase";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	mode: string;
	modeTimeout: any;

	showOthers: boolean;

	topUrls: any;
	bottomUrls: any;

	@ViewChild("linksContainer") linksContainer: ElementRef;
	@ViewChild("topUrlsSpan") topUrlsSpan: ElementRef;

	constructor() {
  	}

	ngOnInit() {
		this.mode = 'light';

		this.topUrls = [
			{text: 'PRIME', href: 'https://www.instagram.com/explore/tags/pr02_prime/'},
			{text: 'SPARROW', href: 'https://www.dwell.com/article/a-designer-completely-transforms-a-little-1950s-house-with-dollar125k-a5e9d1d6'},
			{text: 'SISTERCITY', href: 'https://www.architecturaldigest.com/story/ace-hotel-sister-city-bowery-manhattan-lower-east-side'},
			{text: 'USEMBASSY', href: 'https://alliedworks.com/projects/us-embassy-mozambique'},
			{text: "VETERANS'MEMORIAL", href: 'https://alliedworks.com/projects/ohio-veterans-memorial-and-museum'},
			{text: 'ARVOPARTCENTER', href: 'https://alliedworks.com/projects/arvo-part-centre'},
		];

		this.bottomUrls = [
			{text: 'UCSANTACRUZ', href: 'https://alliedworks.com/projects/institute-of-arts-and-sciences-ucsc'},
			{text: 'CLEMSONUNIVERSITY', href: 'https://alliedworks.com/projects/spaulding-paolozzi-center'},
			{text: 'PRESERVE24', href: 'https://www.urbandaddy.com/articles/23858/new-york/preserve-24-preserve-the-right-a-massive-den-made-of-pianos-and-boats'},
			{text: 'THESTEINWAY', href: 'https://hotpads.com/1-bed-800-sqft-2395-los-angeles-ca-90026-1m2mh4q/pad'},
		];
	}

	getUrlWordSpacing() {
		if (!this.linksContainer || !this.topUrlsSpan || this.topUrls) {
			return -1;
		}

		return (this.linksContainer.nativeElement.offsetWidth - this.topUrlsSpan.nativeElement.offsetWidth) / (this.topUrls.length - 1);
	}

	toggleMode() {
		// clearTimeout(this.modeTimeout);

		if (this.mode === 'light') {
			this.mode = '';
			this.modeTimeout = setTimeout(() => {
				this.mode = 'dark';
				this.modeTimeout = setTimeout(() => {
					this.showOthers = true;
				}, 1000);
			}, 500);
		} else {
			this.mode = '';
			this.modeTimeout = setTimeout(() => {
				this.mode = 'light';
				this.showOthers = false;
			}, 1000);
		}
	}

	// https://scotch.io/tutorials/responsive-equal-height-with-angular-directive
	@HostListener('window:resize')
    onResize() {
        // // call our matchHeight function here
        // this.matchHeight(this.el.nativeElement, this.myMatchHeight);
        console.log(this.getUrlWordSpacing());
    }
}
