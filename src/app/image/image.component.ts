import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'moo-image',
  styleUrls: [ './image.style.scss' ],
  templateUrl: './image.template.html',
  providers: [ ]
})
export class ImageComponent implements OnChanges {
	@Input() href: string;

	loading: boolean;

	image: HTMLImageElement;

	errored: boolean;

	@Input() mode: string;

	constructor() {
	}

	ngOnInit() {
	}
	
	handleEvents() {
		this.image.removeEventListener('load', this.onload.bind(this));
		this.image.removeEventListener('error', this.onerror.bind(this));
		
		this.image.addEventListener('load', this.onload.bind(this));
    	this.image.addEventListener('error', this.onerror.bind(this));
	}

	onload() {
		console.log('onload finished');
		this.loading = false;
		console.log(this.image);
		console.log(this.image.height);
		console.log(this.image.width);
	}
	
	onerror(error: any) {
		console.error("errored", error);
		this.loading = false;
		this.errored = true;
	}

	ngOnChanges(changes: SimpleChanges) {
		console.log(changes);
		if (changes.href) {
			this.image = new Image();

			this.handleEvents();

			this.loading = true;
			this.errored = false;

			this.image.src = this.href;
		}
	}
}
