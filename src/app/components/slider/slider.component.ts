import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import * as Hammer from 'hammerjs';

@Component({
  selector: 'moo-slider',
  styleUrls: [ './slider.style.scss' ],
  templateUrl: './slider.template.html',
  providers: [ ]
})
export class SliderComponent implements OnInit, AfterViewInit {
	timer: any;// Node.Timer

	velocity: number = 0;
	delta: number = 0;

	@Input() assets: any[];
	activeSlide: number = 0;

	@ViewChild("outerContainer", { static: true }) outerContainer: ElementRef;
	@ViewChild("sliderContainer", { static: true }) sliderContainer: ElementRef;

	@Input() container: HTMLElement;

	// margin: number = 0;
	marginPercent: number = 0;

	swipV: number = .25;

	@Output() activeSlideSet: EventEmitter<number> = new EventEmitter();

	constructor() {
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
        this.init();
	}

	init(): void {
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

	limitMarginPercent() {
		if (this.marginPercent < 0) {
			this.marginPercent = 0;
		} else if (this.marginPercent > this.assets.length - 1) {
			this.marginPercent = this.assets.length - 1;
		}
	}

	setActiveSlide(value: number) {
		this.activeSlide = value;
		this.activeSlideSet.emit(value);
	}

	gotoNextSlide() {
		// console.log("gotoNextSlide");
		this.setActiveSlide(this.activeSlide += 1);

		if (this.activeSlide > this.assets.length - 1) {
			this.setActiveSlide(this.assets.length - 1);

		}
		
		this.nextToSlide();
	}
	
	gotoPrevSlide() {
		// console.log("gotoPrevSlide");
		this.setActiveSlide(this.activeSlide -= 1);


		if (this.activeSlide < 0) {
			this.setActiveSlide(0);
		}
		
		this.nextToSlide();
	}

	returnToSlide() {
		this.nextToSlide();
	}

	nextToSlide() {
		const goal = this.activeSlide;
		// console.log('nextToSlide', goal, this.margin);

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
