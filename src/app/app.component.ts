import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';

import * as firebase from "firebase";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	aLength: number;

	topUrls: any;
	bottomUrls: any;

	@ViewChild("linksContainer") linksContainer: ElementRef;
	@ViewChild("topUrlsSpan") topUrlsSpan: ElementRef;

	constructor() {
  	}

	ngOnInit() {
		this.topUrls = [
			{text: 'PRIME', url: ''},
			{text: 'SPARROW', url: ''},
			{text: 'SISTERCITY', url: ''},
			{text: 'USEMBASSY', url: ''},
			{text: "VETERANS'MEMORIAL", url: ''},
			{text: 'ARVOPARTCENTER', url: ''},
		];

		this.bottomUrls = [
			{text: 'UCSANTACRUZ', url: ''},
			{text: 'CLEMSONUNIVERSITY', url: ''},
			{text: 'PRESERVE24', url: ''},
			{text: 'THESTEINWAY', url: ''},
		];
		// this.aLength = 70;
		// firebase.database().ref().update({moo: 'cow'});
	}

	getUrlWordSpacing() {
		if (!this.linksContainer || !this.topUrlsSpan || this.topUrls) {
			return -1;
		}

		return (this.linksContainer.nativeElement.offsetWidth - this.topUrlsSpan.nativeElement.offsetWidth) / (this.topUrls.length - 1);
	}
	// https://scotch.io/tutorials/responsive-equal-height-with-angular-directive
	@HostListener('window:resize')
    onResize() {
        // // call our matchHeight function here
        // this.matchHeight(this.el.nativeElement, this.myMatchHeight);
        console.log(this.getUrlWordSpacing());
    }
}
