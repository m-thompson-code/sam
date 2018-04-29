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

	urls: any;

	@ViewChild("linksContainer") linksContainer: ElementRef;
	@ViewChild("topUrlsSpan") topUrlsSpan: ElementRef;

	constructor() {
  	}

	ngOnInit() {
		this.mode = 'light';

		this.urls = [
			{y: 0, text: 'PRIME', href: 'https://www.instagram.com/explore/tags/pr02_prime/'},
			{y: 0, text: 'SPARROW', href: 'https://www.dwell.com/article/a-designer-completely-transforms-a-little-1950s-house-with-dollar125k-a5e9d1d6'},
			{y: 0, text: 'SISTERCITY', href: 'https://www.architecturaldigest.com/story/ace-hotel-sister-city-bowery-manhattan-lower-east-side'},
			{y: 0, text: 'USEMBASSY', href: 'https://alliedworks.com/projects/us-embassy-mozambique'},
			{y: 0, text: "VETERANS'MEMORIAL", href: 'https://alliedworks.com/projects/ohio-veterans-memorial-and-museum'},
			{y: 0, text: 'ARVOPÄRTCENTER', href: 'https://alliedworks.com/projects/arvo-part-centre'},
		// ];

		// this.bottomUrls = [
			{y: 0, text: 'UCSANTACRUZ', href: 'https://alliedworks.com/projects/institute-of-arts-and-sciences-ucsc'},
			{y: 0, text: 'CLEMSONUNIVERSITY', href: 'https://alliedworks.com/projects/spaulding-paolozzi-center'},
			{y: 0, text: 'PRESERVE24', href: 'https://www.urbandaddy.com/articles/23858/new-york/preserve-24-preserve-the-right-a-massive-den-made-of-pianos-and-boats'},
			{y: 0, text: 'THESTEINWAY', href: 'https://hotpads.com/1-bed-800-sqft-2395-los-angeles-ca-90026-1m2mh4q/pad'},
		];

		// this.urls = [];

		// for (var i = 0; i < this.topUrls.length; i++) {
		// 	this.urls.push(this.topUrls[i]);
		// }
		// for (var i = 0; i < this.bottomUrls.length; i++) {
		// 	this.urls.push(this.bottomUrls[i]);
		// }

		console.log(this.urls);
	}

	// getUrlWordSpacing() {
	// 	if (!this.linksContainer || !this.topUrlsSpan || this.topUrls) {
	// 		return -1;
	// 	}

	// 	return (this.linksContainer.nativeElement.offsetWidth - this.topUrlsSpan.nativeElement.offsetWidth) / (this.topUrls.length - 1);
	// }

	toggleMode() {
		// clearTimeout(this.modeTimeout);

		if (this.mode === 'light') {
			this.mode = '';
			this.modeTimeout = setTimeout(() => {
				this.mode = 'dark';
				this.modeTimeout = setTimeout(() => {
					this.showOthers = true;
				}, 2000);
			}, 500);
		} else {
			this.mode = '';
			this.modeTimeout = setTimeout(() => {
				this.mode = 'light';
				this.showOthers = false;
			}, 1000);
		}
	}

	getUrlColCount(y: number) {
		var count = 0;

		if (y === 0) {
			return 1;
		}

		for (var i = 0; i < this.urls.length; i++) {
			if (this.urls[i].y === y) {count += 1};
		}

		return count || 1;
	}

	// https://scotch.io/tutorials/responsive-equal-height-with-angular-directive
	@HostListener('window:resize')
    onResize() {
        // // call our matchHeight function here
        // this.matchHeight(this.el.nativeElement, this.myMatchHeight);
        // console.log(this.getUrlWordSpacing());
    }
}
