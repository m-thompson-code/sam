import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { AppService } from './app.service';

export interface TagElement {
	text: string;
	href?: string;
}

export interface Tag {
	text: string;
	elements: TagElement[];
}

export interface Asset {
	type: 'image' | 'video';
	url: string;
}

export interface DBProject {
	text: string; // Dispaly text
	href: string; // Href on click
	useSlideshow: boolean; // Use slideshow instead of href on click
	assets: Asset[];
	desc: string;
	tags: Tag[];
}

export interface Project extends DBProject {
	width: number; // Width of text
	margin: number; // ?
	marginRight: number; // ?
}

@Component({
    selector: 'app-root',
    templateUrl: './app.template.html',
    styleUrls: ['./app.style.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
	@ViewChild("backgroundImageHolder", { static: true }) backgroundImageHolder?: ElementRef;

	public loading : boolean;

	public dataLoading: boolean;
	public backgroundImageLoading: boolean;

	constructor(public appService: AppService) {
		this.loading = false;
		this.dataLoading = false;
		this.backgroundImageLoading = false;
	}

	public ngOnInit(): void {
		this.dataLoading = true;
		this.backgroundImageLoading = true;
		this.loading = true;

		this.loadProjects();
	}

	public loadProjects(): Promise<void> {
		return this.appService.loadProjects().then(() => {
			this.dataLoading = false;

			this.loading = this.backgroundImageLoading || this.dataLoading;
		});
	}

	public ngAfterViewInit(): void {
		setTimeout(() => {
			try {
				if (!this.backgroundImageHolder) {
					throw {
						message: "Unexpected missing backgroundImageHolder",
					};
				}

				const _computedStyle: CSSStyleDeclaration = window.getComputedStyle(this.backgroundImageHolder.nativeElement);
				const src = _computedStyle && _computedStyle['backgroundImage'] || "";

				const urlMatches = src.match(/\((.*?)\)/);

				var url = urlMatches && urlMatches.length && urlMatches[1].replace(/('|")/g,'') || "";

				var img = new Image();

				img.onload = () => {
					this.backgroundImageLoading = false;
					this.loading = this.backgroundImageLoading || this.dataLoading;
				};

				img.onerror = (error) => {
					console.error(error);
					this.backgroundImageLoading = false;
					this.loading = this.backgroundImageLoading || this.dataLoading;
				};

				img.src = url;
			}catch(error) {
				console.error(error);
				this.backgroundImageLoading = false;
				this.loading = this.backgroundImageLoading || this.dataLoading;
			}
			
		}, 1);
	}
}
