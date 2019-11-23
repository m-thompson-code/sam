import { Component, NgZone, OnInit } from '@angular/core';

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
export class AppComponent implements OnInit {
	constructor(private dragulaService: DragulaService, private ngZone: NgZone, public appService: AppService) {
	}

	ngOnInit() {
		this.appService.loadProjects();
		// Waves.init()
	}
}
