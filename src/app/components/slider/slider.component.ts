import { Component, Input, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import * as Hammer from 'hammerjs';
import { Asset } from 'src/app/app.component';

export interface AssetClickEvent {
	asset: Asset;
	index: number;
}

@Component({
  selector: 'moo-slider',
  styleUrls: [ './slider.style.scss' ],
  templateUrl: './slider.template.html',
  providers: [ ]
})
export class SliderComponent implements AfterViewInit {
	public velocity: number = 0;
	public delta: number = 0;

	@Input() public assets?: Asset[];
	public activeSlide: number = 0;

	@ViewChild("outerContainer", { static: true }) private outerContainer!: ElementRef;
	@ViewChild("sliderContainer", { static: true }) private sliderContainer!: ElementRef;

	@Input() public container?: HTMLElement;

	// margin: number = 0;
	public marginPercent: number = 0;

	private swipV: number = .25;

	@Output() public activeSlideSet: EventEmitter<number> = new EventEmitter();
	@Output() public assetClicked: EventEmitter<AssetClickEvent> = new EventEmitter();

	constructor() {
	}

	public ngAfterViewInit() {
        this.init();
	}

	public init(): void {
		const hammerOptions: HammerOptions = {
			inputClass: Hammer.TouchInput,
            touchAction: 'pan-y'  // If using horizontal gestures - http://hammerjs.github.io/touch-action/
		}
		var sliderManager = new Hammer.Manager(this.sliderContainer.nativeElement, hammerOptions);
		const options: RecognizerOptions = {
			threshold: 10, 
			pointers: 1,
			direction: Hammer.DIRECTION_HORIZONTAL,
		}
		sliderManager.add( new Hammer.Pan(options));

		sliderManager.on( 'pan', (e: HammerInput) => {
			// if (e.direction === Hammer.DIRECTION_UP || e.direction === Hammer.DIRECTION_DOWN) {
			// 	return;
			// }

			// console.log(e);

			this.velocity = e.velocityX || 0;
			this.delta = e.deltaX || 0;

			// console.log(e.direction);
			if (e.isFinal) {
				const _delta = this.delta;
				this.marginPercent = (this.marginPercent * this.outerContainer.nativeElement.offsetWidth - this.delta) / this.outerContainer.nativeElement.offsetWidth;
				// -= this.delta;
				this.limitMarginPercent();
				this.delta = 0;
				
				if (this.velocity > this.swipV) {
					this.gotoPrevSlide();
				} else if (this.velocity < -this.swipV) {
					this.gotoNextSlide();
				} else {
					if (!this.container) {
						console.warn("Unexpected missing container");
						return;
					}

					if (_delta < -this.container.offsetWidth / 2) {
						this.gotoNextSlide();
					} else if (_delta > this.container.offsetWidth / 2) {
						this.gotoPrevSlide();
					} else {
						this.returnToSlide();
					}
				}
			}
		});
	}

	public limitMarginPercent(): void {
		if (!this.assets) {
			this.marginPercent = 0;
			return;
		}

		if (this.marginPercent < 0) {
			this.marginPercent = 0;
		} else if (this.marginPercent > this.assets.length - 1) {
			this.marginPercent = this.assets.length - 1;
		}
	}

	public setActiveSlide(value: number): void {
		this.activeSlide = value;
		this.activeSlideSet.emit(value);
	}

	public gotoNextSlide(): void {
		if (!this.assets) {
			this.setActiveSlide(0);
			return;
		}
		
		this.setActiveSlide(this.activeSlide += 1);

		if (this.activeSlide > this.assets.length - 1) {
			this.setActiveSlide(this.assets.length - 1);

		}
		
		this.nextToSlide();
	}
	
	public gotoPrevSlide(): void {
		this.setActiveSlide(this.activeSlide -= 1);


		if (this.activeSlide < 0) {
			this.setActiveSlide(0);
		}
		
		this.nextToSlide();
	}

	public returnToSlide(): void {
		this.nextToSlide();
	}

	public nextToSlide(): void {
		const goal = this.activeSlide;

		if (this.marginPercent === goal) {
			this.velocity = 0;
			this.limitMarginPercent();
			return;
		}

		if (this.marginPercent < goal) {
			if (this.velocity > -this.swipV) {
				this.velocity = -this.swipV;
			}

			let margin = this.marginPercent * this.outerContainer.nativeElement.offsetWidth;
			margin -= this.velocity;
			this.marginPercent = margin / this.outerContainer.nativeElement.offsetWidth;

			if (this.marginPercent >= goal) {
				this.marginPercent = goal;
				this.velocity = 0;
				this.limitMarginPercent();
				return;
			}

			this.velocity *= 1.1;

			if (this.velocity > 50) {
				this.velocity = 50;
			}

			setTimeout(() => {
				this.nextToSlide();
			}, 0);
		} else if (this.marginPercent > goal) {
			if (this.velocity < this.swipV) {
				this.velocity = this.swipV;
			}

			let margin = this.marginPercent * this.outerContainer.nativeElement.offsetWidth;
			margin -= this.velocity;
			this.marginPercent = margin / this.outerContainer.nativeElement.offsetWidth;

			if (this.marginPercent <= goal) {
				this.marginPercent = goal;
				this.velocity = 0;
				this.limitMarginPercent();
				return;
			}

			this.velocity *= 1.1;

			if (this.velocity < -50) {
				this.velocity = -50;
			}

			setTimeout(() => {
				this.nextToSlide();
			}, 0);
		}
	}
}
