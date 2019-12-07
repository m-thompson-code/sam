import { Component, NgZone, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { AppService } from './app.service';

import { DragulaService } from 'ng2-dragula';

export interface TagElement {
	text: string;
	href?: string;
}

export interface Tag {
	text: string;
	elements: TagElement[];
}

export interface DBProject {
	text: string; // Dispaly text
	href: string; // Href on click
	useSlideshow: boolean; // Use slideshow instead of href on click
	imageUrls: string[];
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
	@ViewChild("backgroundImageHolder") backgroundImageHolder: ElementRef;

	loading : boolean;

	dataLoading: boolean;
	backgroundImageLoading: boolean;

	constructor(private dragulaService: DragulaService, private ngZone: NgZone, public appService: AppService) {
	}

	ngOnInit() {
		this.dataLoading = true;
		this.backgroundImageLoading = true;
		this.loading = true;

		this.loadProjects();
	}

	loadProjects() {
		return this.appService.loadProjects().then(() => {
			this.dataLoading = false;

			this.loading = this.backgroundImageLoading || this.dataLoading;
		});
	}

	ngAfterViewInit() {
		setTimeout(() => {
			try {
				// console.log(window.getComputedStyle(this.backgroundImageHolder.nativeElement)['background-image']);
				var src = window.getComputedStyle(this.backgroundImageHolder.nativeElement)['background-image'];

				var url = src.match(/\((.*?)\)/)[1].replace(/('|")/g,'');

				var img = new Image();

				img.onload = () => {
					this.backgroundImageLoading = false;
					this.loading = this.backgroundImageLoading || this.dataLoading;
					
					console.log("background loaded");
				};

				img.src = url;

				// setTimeout(() => {
				// 	this.backgroundImageLoading = false;
				// 	this.loading = this.backgroundImageLoading || this.dataLoading;
				// }, 3 * 1000);

			}catch(error) {
				console.error(error);
				this.backgroundImageLoading = false;
				this.loading = this.backgroundImageLoading || this.dataLoading;
			}
			
		}, 1);
	}
}
