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
	urlFontSize: number;

	urlRows: any[];
	urlsMaxWidth: number;
	maxUrls: number;

	h: number;
	w: number;

	footerUrls: any[];

	constructor() {
  	}

	ngOnInit() {
		
		// source: https://stackoverflow.com/questions/4917664/detect-viewport-orientation-if-orientation-is-portrait-display-alert-message-ad
		// alert(window.orientation);

		// window.addEventListener("orientationchange", function() {
		//   // Announce the new orientation number
		//   alert(window.orientation);
		// }, false);

		this.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		this.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		this.mode = '';
		this.modeTimeout = setTimeout(() => {
			this.mode = 'light';
			this.showOthers = false;
		}, 1000);

		this.maxUrls = 6;

		this.urlRows = [[]];

		this.urls = [
			{width: 0, text: 'PRIME', href: 'https://www.instagram.com/explore/tags/pr02_prime/'},
			{width: 0, text: 'SPARROW', href: 'https://www.dwell.com/article/a-designer-completely-transforms-a-little-1950s-house-with-dollar125k-a5e9d1d6'},
			{width: 0, text: 'SISTER CITY', href: 'https://www.architecturaldigest.com/story/ace-hotel-sister-city-bowery-manhattan-lower-east-side'},
			{width: 0, text: 'EX NIHILO', href: 'https://www.instagram.com/explore/tags/pr00_exnihilo/'},
			{width: 0, text: 'US EMBASSY', href: 'https://alliedworks.com/projects/us-embassy-mozambique'},
			{width: 0, text: "VETERANS\\sMEMORIAL", href: 'https://alliedworks.com/projects/ohio-veterans-memorial-and-museum'},
			{width: 0, text: 'ARVOPÄRT\\sCENTER', href: 'https://alliedworks.com/projects/arvo-part-centre'},
			{width: 0, text: 'UC SANTA CRUZ', href: 'https://alliedworks.com/projects/institute-of-arts-and-sciences-ucsc'},
			{width: 0, text: 'CLEMSON\\sUNIVERSITY', href: 'https://alliedworks.com/projects/spaulding-paolozzi-center'},
			{width: 0, text: 'PRESERVE 24', href: 'https://www.urbandaddy.com/articles/23858/new-york/preserve-24-preserve-the-right-a-massive-den-made-of-pianos-and-boats'},
			// {width: 0, text: 'THESTEINWAY', href: 'https://hotpads.com/1-bed-800-sqft-2395-los-angeles-ca-90026-1m2mh4q/pad'},
		];

		this.footerUrls = [
			{width: 0, text: 'contact@\\nsamanthamink.com', href: 'mailto:contact@samanthamink.com'},
			{width: 0, text: '@_samanthamink_', href: 'https://www.instagram.com/_samanthamink_/'},
			{width: 0, text: '+13109682148', href: 'tel:+13109682148'},
			{width: 0, text: 'culvercity,ca', href: 'https://goo.gl/maps/EDdHuFLuv882'},
		];

		console.log(this.urls);
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.getLinksContainerWidth();
        	this.alignUrls();
		});
		
	}

	toggleMode() {
		if (this.mode === 'light') {
			this.mode = '';
			this.modeTimeout = setTimeout(() => {
				this.mode = 'dark';
				this.modeTimeout = setTimeout(() => {
					if (this.mode === 'dark') {
						this.showOthers = true;
					}
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

	getLinksContainerWidth() {
		if (this.linksContainer && this.linksContainer.nativeElement) {
			this.urlFontSize = parseFloat(window.getComputedStyle(this.linksContainer.nativeElement).fontSize) || 9.33;
			this.urlsMaxWidth = this.linksContainer.nativeElement.getBoundingClientRect().width;
		}
	}

	alignUrls() {
		var y = 0;

		var width = this.urlsMaxWidth;

		var i = 0;
		var count = 0;

		var topWidth = 0;

		this.urlRows = [];

		this.urlRows.push([]);

		var margin = 0;

		while (i < this.urls.length) {
			console.log(width);

			if (y === 0) {
				margin = this.urlFontSize * 2;
			} else {
				margin = (this.urlsMaxWidth - topWidth) / (this.urlRows[0].length - 1);
			}

			var url = this.urls[i];

			console.log(url.width);

			if ((y > 0 || count < this.maxUrls) && url.width < width) {
				url.margin = margin;
				this.urlRows[y].push(url);
				width -= url.width + margin;

				if (y === 0) {
					topWidth += url.width;
				} else {
					url.marginRight = topWidth;
				}

				i += 1;
				count += 1;
			} else {
				if (width === this.urlsMaxWidth) {
					url.margin = margin;
					this.urlRows[y].push(url);

					if (y === 0) {
						topWidth += url.width
					} else {
						url.marginRight = topWidth;
					}

					i += 1;
					count += 1;
				}

				width = this.urlsMaxWidth;
				this.urlRows.push([]);
				y += 1;
				count = 0;
			}

			if (i > 99) {
				console.log("oops", i);
				break;
			}
		}

		
	}

	ptToPx(pt: number) {
    	return pt * 96 / 72;
    }

    getActive(el: any) {
    	// alert("test");
    	el.classList.add("active");
    }

    getNotActive(el: any) {
    	// alert("test2");
    	el.classList.remove("active");
    }

  //   removehover(el: any) {
  //   	// source: https://plainjs.com/javascript/events/binding-and-unbinding-of-event-handlers-12/
  //   	function addEvent(el, type, handler) {
		//     if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
		// }
  //   	function removeEvent(el, type, handler) {
		//     if (el.detachEvent) el.detachEvent('on'+type, handler); else el.removeEventListener(type, handler);
		// }

		// removeEvent(el, 'mouseenter', ()=>{console.log("No more hover")});
		// // removeEvent(el, 'mouseleave', ()=>{console.log("No more hover")});
  //   }

    recalcEvertyhing() {
    	this.getLinksContainerWidth();
        this.alignUrls();

        this.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		this.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }

	// https://scotch.io/tutorials/responsive-equal-height-with-angular-directive
	@HostListener('window:resize')
    onResize() {
    	// '{
       this.recalcEvertyhing();
    }

    @HostListener('window:orientationchange')
    onOrientationChange() {
    	// '{
    	setTimeout(() => {
       		this.recalcEvertyhing();
    	}, 1);
    }
}
