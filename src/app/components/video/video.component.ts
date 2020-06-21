import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'moo-video',
  styleUrls: [ './video.style.scss' ],
  templateUrl: './video.template.html',
  providers: [ ]
})
export class VideoComponent implements OnChanges {
	// @Input() href: string;

	thref: string;
	mhref: string;
	dhref: string;

	private _href: string;
    @Input()
    set href(href: string) {
			this._href = href;

			const parts = href.split('/');
			parts[parts.length - 1] = parts[parts.length - 1].replace('.', 'm.');
			this.mhref = "";
			for (let part of parts) {
				if (this.mhref) {
					this.mhref += '/';
				}
				this.mhref += part;
			}

			const parts2 = href.split('/');
			parts2[parts2.length - 1] = parts2[parts2.length - 1].replace('.', 'h.');
			this.dhref = "";
			for (let part of parts2) {
				if (this.dhref) {
					this.dhref += '/';
				}
				this.dhref += part;
			}

			const parts3 = href.split('/');
			parts3[parts3.length - 1] = parts3[parts3.length - 1].replace('.', 'b.');
			this.thref = "";
			for (let part of parts3) {
				if (this.thref) {
					this.thref += '/';
				}
				this.thref += part;
			}
    }
    get href(): string {
        return this._href;
    };

	loading: boolean;

	private video: HTMLVideoElement;

	errored: boolean;

	@Input() mode: string;

	@Input() container: HTMLElement;

	defaultWidth: string;
	defaultHeight: string;

	@Input() calcSize: boolean;

	@Input() thumbnail: boolean;

	constructor() {
	}

	ngOnInit() {
		this.loading = true;
		this.errored = false;
	}
	
	handleEvents() {
		this.video.removeEventListener('loadedmetadata', this.onload.bind(this));
		this.video.removeEventListener('error', this.onerror.bind(this));
		
		this.video.addEventListener('loadedmetadata', this.onload.bind(this));
		this.video.addEventListener('error', this.onerror.bind(this));
	}

	onload() {
		// console.log('onload finished');
		this.loading = false;
		// console.log(this.video);
		// console.log(this.video.height);
		// console.log(this.video.width);
		if (this.video) {
			if (this.video.width > this.video.height) {
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
		if (this.container && this.video) {
			// if (this.container.offsetWidth > this.container.offsetHeight) {
			// 	console.log("auto");
			// 	return "auto";
			// } else {
			// 	console.log(this.container.offsetHeight + "px");

			// 	return this.container.offsetHeight + "px";
			// }
			let height = this.video.height;
			let width = this.video.width;

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

			// console.log(this.video.width, this.video.height, this.container.offsetWidth, this.container.offsetHeight, width, height);

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
		// console.log("getMaxWidth", this.container, this.container.offsetWidth);

		if (this.container && this.video) {
			if (this.container.offsetWidth > this.container.offsetHeight) {
				// console.log(this.container.offsetWidth + "px");
				return this.container.offsetWidth + "px";
			} else {
				// console.log("auto");
				return "auto";
			}
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		// console.log(changes);
		if (changes.href) {
			this.video = document.createElement('video');

			this.handleEvents();

			this.loading = true;
			this.errored = false;

			if (!this.calcSize) {
				this.video.src = this.mhref;
			} else if (this.thumbnail) {
				this.video.src = this.thref;
			} else {
				this.video.src = this.dhref;
			}
		}
	}
}
