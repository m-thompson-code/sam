import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';

import * as firebase from "firebase";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	@ViewChild("backgroundImageHolder") backgroundImageHolder: ElementRef;
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

	poem: string;
	poemCols: number;
	showPoem: boolean;

	spacedChars: any[];

	lightIconEncoded: string;
	darkIconEncoded: string;

	dataLoading: boolean;
	backgroundImageLoading: boolean;
	loading : boolean;

	header1: string;
	header2: string;

	constructor() {
  	}

	ngOnInit() {
		this.dataLoading = true;
		this.backgroundImageLoading = true;
		this.loading = true;

		this.header1 = "";
		this.header2 = "";

		this.urls = [];
		this.footerUrls = [];

		this.lightIconEncoded = `data:image/jpeg;base64,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`;
		this.darkIconEncoded = `data:image/jpeg;base64,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`;
	}

	ngAfterViewInit() {
		setTimeout(() => {
			console.log(window.getComputedStyle(this.backgroundImageHolder.nativeElement)['background-image']);
			var src = window.getComputedStyle(this.backgroundImageHolder.nativeElement)['background-image'];
			if (!src) {
				this.backgroundImageLoading = false;
				this.loading = this.backgroundImageLoading || this.dataLoading;
			}
			var url = src.match(/\((.*?)\)/)[1].replace(/('|")/g,'');

			if (!url) {
				this.backgroundImageLoading = false;
				this.loading = this.backgroundImageLoading || this.dataLoading;
			}

			var img = new Image();

			img.onload = () => {
			    this.backgroundImageLoading = false;
				this.loading = this.backgroundImageLoading || this.dataLoading;
			};

			img.src = url;
			// if (img.complete) {img.onload();}
		}, 1);
		
		var promises = [];

		this.header1 = '';
		this.header2 = '';

		promises.push(firebase.database().ref('header1').once('value').then(header1Snapshot => {
			if (header1Snapshot.exists()) {
				this.header1 = header1Snapshot.val();
			} else {
				console.error("no header1 found");
			}
		}));

		promises.push(firebase.database().ref('header2').once('value').then(header2Snapshot => {
			if (header2Snapshot.exists()) {
				this.header2 = header2Snapshot.val();
			} else {
				console.error("no header2 found");
			}
		}));

		promises.push(firebase.database().ref('projects').once('value').then(projectsSnapshot => {
			if (projectsSnapshot.exists() && projectsSnapshot.val().length) {
				var urls = projectsSnapshot.val();
				this.urls = [];

				for (var i = 0; i < urls.length; i++) {
					this.urls.push({width: 0, text: urls[i].text, href: urls[i].href});
				}
			} else {
				console.error("no projects found or length isn't defined");
			}
		}));

		promises.push(firebase.database().ref('footers').once('value').then(footersSnapshot => {
			if (footersSnapshot.exists() && footersSnapshot.val().length) {
				var footerUrls = footersSnapshot.val();
				this.footerUrls = [];

				for (var i = 0; i < footerUrls.length; i++) {
					this.footerUrls.push({width: 0, text: footerUrls[i].text, href: footerUrls[i].href});
				}
			} else {
				console.error("no footers found or length isn't defined");
			}
		}));

		Promise.all(promises).then(() => {
			this.showPoem = false;
			this.poemCols = 0;
			this.spacedChars = ['·'];
			// this.poem = `It would be nice if you were here with me, to see the material of time, a whisper spilled across the floor by moonlight, a sheet of light pressed gently on the warming stone. And how the cello came on the radio, just as it fell through the skylights in broad strokes, sneaking in and out again, without the courtesy of valediction. · I was hoping I could save for you the way the world outside was welcomed in, electrical wires cast delicately in the swath of morning, spread long across the wall, or the pepper tree stretching comfortably across the room by light of late afternoon, as if it’s always been there, as if it always will be. · I could tell you how I saw it in the scraping together of strangers, the blade brandishing black the wet flesh of wood, which was later met by the dry breeze of summer. Cracking, splitting, expanding like the universe. · I could even tell you how I saw it, just this morning, pouring through the door like rapture. But better if you see for yourself, the way the dust was caught visible in the stillness, the way today became tomorrow, the way that nothing changed and everything was different.`;

			this.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
			this.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

			this.mode = '';
			this.modeTimeout = setTimeout(() => {
				this.mode = 'light';
				this.showOthers = false;
			}, 1000);

			this.maxUrls = 6;

			this.urlRows = [[]];

			// {width: 0, text: 'THESTEINWAY', href: 'https://hotpads.com/1-bed-800-sqft-2395-los-angeles-ca-90026-1m2mh4q/pad'},
			// this.urls = [
			// 	{width: 0, text: 'PRIME', href: 'https://www.instagram.com/explore/tags/pr02_prime/'},
			// 	{width: 0, text: 'SPARROW', href: 'https://www.dwell.com/article/a-designer-completely-transforms-a-little-1950s-house-with-dollar125k-a5e9d1d6'},
			// 	{width: 0, text: 'SISTER CITY', href: 'https://www.architecturaldigest.com/story/ace-hotel-sister-city-bowery-manhattan-lower-east-side'},
			// 	{width: 0, text: 'EX NIHILO', href: 'https://www.instagram.com/explore/tags/pr00_exnihilo/'},
			// 	{width: 0, text: 'US EMBASSY', href: 'https://alliedworks.com/projects/us-embassy-mozambique'},
			// 	{width: 0, text: "VETERANS\\sMEMORIAL", href: 'https://alliedworks.com/projects/ohio-veterans-memorial-and-museum'},
			// 	{width: 0, text: 'ARVO\\sPÄRT\\sCENTER', href: 'https://alliedworks.com/projects/arvo-part-centre'},
			// 	{width: 0, text: 'UC SANTA CRUZ', href: 'https://alliedworks.com/projects/institute-of-arts-and-sciences-ucsc'},
			// 	{width: 0, text: 'CLEMSON\\sUNIVERSITY', href: 'https://alliedworks.com/projects/spaulding-paolozzi-center'},
			// 	{width: 0, text: 'PRESERVE 24', href: 'https://www.urbandaddy.com/articles/23858/new-york/preserve-24-preserve-the-right-a-massive-den-made-of-pianos-and-boats'},
			// ];

			// this.footerUrls = [
			// 	{width: 0, text: 'contact@\\nsamanthamink.com', href: 'mailto:contact@samanthamink.com'},
			// 	{width: 0, text: '@_samanthamink_', href: 'https://www.instagram.com/_samanthamink_/'},
			// 	{width: 0, text: '+13109682148', href: 'tel:+13109682148'},
			// 	{width: 0, text: 'culvercity,ca', href: 'https://goo.gl/maps/EDdHuFLuv882'},
			// ];

			// this.loading = false;
			this.dataLoading = false;
			this.loading = this.backgroundImageLoading || this.dataLoading;

			setTimeout(() => {
				this.getLinksContainerWidth();
	        	this.alignUrls();
			});
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
			this.showPoem = true;

			this.modeTimeout = setTimeout(() => {
				this.mode = 'light';
				this.showOthers = false;
			}, 1000);
		}
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

    pxToPt(px: number) {
    	return px * 72 / 96;
    }

    getTopPoemHeight(totalHeight: number, spanHeight: number, twoSpanHeight: number) {
    	if (!spanHeight || !twoSpanHeight) {
    		return totalHeight / 2;
    	}

    	console.log("getTopPoemHeight");
    	console.log("totalHeight",totalHeight);
    	console.log("spanHeight",spanHeight);
    	console.log("twoSpanHeight",twoSpanHeight);

    	var nextSpanHeight = twoSpanHeight - spanHeight;

    	var cols = 1;

    	var generatedHeight = spanHeight;
    	console.log(generatedHeight);
    	while(generatedHeight < totalHeight - spanHeight + 1) {
    		cols += 1;
    		generatedHeight += nextSpanHeight;
    		console.log(generatedHeight);
    	}

    	console.log(cols);
    	this.poemCols = cols;
    	if (cols % 2 == 0) {
    		return totalHeight / 2;
    	}

    	return (totalHeight - nextSpanHeight) / 2;
    }

    getBottomPoemHeight(totalHeight: number, spanHeight: number, twoSpanHeight: number) {
    	if (!spanHeight || !twoSpanHeight) {
    		return totalHeight / 2;
    	}

    	var nextSpanHeight = twoSpanHeight - spanHeight;

    	var cols = 1;
    	
    	var generatedHeight = spanHeight;
    	while(generatedHeight < totalHeight - spanHeight + 1) {
    		cols += 1;
    		generatedHeight += nextSpanHeight;
    	}

    	if (cols % 2 == 0) {
    		return totalHeight / 2;
    	}

    	return (totalHeight + nextSpanHeight) / 2;
    }

    getActive(el: any) {
    	el.classList.add("active");
    }

    getNotActive(el: any) {
    	el.classList.remove("active");
    }

    recalcEvertyhing() {
    	if (this.loading) {
    		return;
    	}

    	this.getLinksContainerWidth();
        this.alignUrls();

        this.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		this.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }

	// https://scotch.io/tutorials/responsive-equal-height-with-angular-directive
	@HostListener('window:resize')
    onResize() {
    	// '{
    	setTimeout(() => {
       		this.recalcEvertyhing();
       	}, 1);
    }

    @HostListener('window:orientationchange')
    onOrientationChange() {
    	// '{
    	setTimeout(() => {
       		this.recalcEvertyhing();
    	}, 1);
    }
}
