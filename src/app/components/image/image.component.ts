import { Component, Input, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { Mode } from 'src/app/home/home.component';

@Component({
  selector: 'moo-image',
  styleUrls: [ './image.style.scss' ],
  templateUrl: './image.template.html',
  providers: [ ]
})
export class ImageComponent implements OnInit, OnChanges {
	// @Input() href: string;

	public thref: string;
	public mhref: string;
	public dhref: string;

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

	public loading: boolean;

	public image?: HTMLImageElement;

	public errored: boolean;

	@Input() public mode: Mode;

	@Input() public container?: HTMLElement;

	public defaultWidth: string;
	public defaultHeight: string;

	@Input() public calcSize?: boolean;

	@Input() public thumbnail?: boolean;

	constructor() {
		this.thref = "";
		this.mhref = "";
		this.dhref = "";
		this._href = "";

		this.loading = true;
		this.errored = false;

		this.defaultWidth = "";
		this.defaultHeight = "";
	}

	public ngOnInit(): void {
		this.loading = true;
		this.errored = false;
	}
	
	public handleEvents(): void {
		if (!this.image) {
			return;
		}
		
		this.image.removeEventListener('load', this.onload.bind(this));
		this.image.removeEventListener('error', this.onerror.bind(this));
		
		this.image.addEventListener('load', this.onload.bind(this));
		this.image.addEventListener('error', this.onerror.bind(this));
	}

	public onload(): void {
		// console.log('onload finished');
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
	
	public onerror(error: any): void {
		console.error("errored", error);

		this.loading = false;
		this.errored = true;
	}

	public getMaxHeight(): {width: string, height: string} {
		if (this.container && this.image) {
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

			return {
				width: width + "px",
				height: height + "px"
			};
		}

		return {
			width: "auto",
			height: "auto"
		};
	}

	// public getMaxWidth(): string {
	// 	// console.log("getMaxWidth", this.container, this.container.offsetWidth);

	// 	if (this.container && this.image) {
	// 		if (this.container.offsetWidth > this.container.offsetHeight) {
	// 			// console.log(this.container.offsetWidth + "px");
	// 			return this.container.offsetWidth + "px";
	// 		} else {
	// 			// console.log("auto");
	// 		}
	// 	}

	// 	return "auto";
	// }

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.href) {
			this.image = new Image();

			this.handleEvents();

			this.loading = true;
			this.errored = false;

			if (!this.calcSize) {
				this.image.src = this.mhref;
			} else if (this.thumbnail) {
				this.image.src = this.thref;
			} else {
				this.image.src = this.dhref;
			}
		}
	}
}
