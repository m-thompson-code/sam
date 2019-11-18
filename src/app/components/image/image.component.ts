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

	@Input() container: HTMLElement;

	defaultWidth: string;
	defaultHeight: string;

	constructor() {
	}

	ngOnInit() {
		this.loading = true;
		this.errored = false;
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
		// console.log(this.image);
		// console.log(this.image.height);
		// console.log(this.image.width);
		if (this.image) {
			if (this.image.width > this.image.height) {
				this.defaultHeight = "auto";
				this.defaultWidth = "100%";
			} else {
				this.defaultHeight = "100%";
				this.defaultWidth = "auto";
			}
		} else {
			this.defaultHeight = "100%";
			this.defaultWidth = "auto";
		}
	}
	
	onerror(error: any) {
		console.error("errored", error);
		this.loading = false;
		this.errored = true;
	}

	getMaxHeight(): {width: string, height: string} {
		if (this.container && this.image) {
			// if (this.container.offsetWidth > this.container.offsetHeight) {
			// 	console.log("auto");
			// 	return "auto";
			// } else {
			// 	console.log(this.container.offsetHeight + "px");

			// 	return this.container.offsetHeight + "px";
			// }
			let height = this.image.height;
			let width = this.image.width;

			if (height < this.container.offsetHeight) {
				width = width * this.container.offsetHeight / height;
				height = this.container.offsetHeight;
			}

			if (width < this.container.offsetWidth) {
				height = height * this.container.offsetWidth / width;
				width = this.container.offsetWidth;
			}

			if (width > this.container.offsetWidth) {
				height = height * this.container.offsetWidth / width;
				let _widthRatio = 1;

				if (height > this.container.offsetHeight) {
					_widthRatio = this.container.offsetHeight / height;
					height = this.container.offsetHeight;
				}

				width = this.container.offsetWidth * _widthRatio;
			}

			if (height > this.container.offsetHeight) {
				width = width * this.container.offsetHeight / height;
				let _heightRatio = 1;

				if (width > this.container.offsetWidth) {
					_heightRatio = this.container.offsetWidth / width;
					width = this.container.offsetWidth;
				}

				height = this.container.offsetHeight * _heightRatio;
			}

			console.log(this.image.width, this.image.height, this.container.offsetWidth, this.container.offsetHeight, width, height);

			return {
				width: width + "px",
				height: height + "px"
			}
		}

		return {
			width: "auto",
			height: "auto"
		}
	}

	getMaxWidth(): string {
		console.log("getMaxWidth", this.container, this.container.offsetWidth);

		if (this.container && this.image) {
			if (this.container.offsetWidth > this.container.offsetHeight) {
				console.log(this.container.offsetWidth + "px");
				return this.container.offsetWidth + "px";
			} else {
				console.log("auto");
				return "auto";
			}
		}
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
