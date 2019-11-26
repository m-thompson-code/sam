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

	velocity: number;
	delta: number;

	@Input() slides: any[];
	activeSlide: number = 1;

	@ViewChild("sliderContainer") sliderContainer: ElementRef;

	@Input() container: HTMLElement;

	margin: number = 0;

	swipV: number = .25;

	@Output() activeSlideSet: EventEmitter<number> = new EventEmitter();

	constructor() {
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
        this.init( '#slider' );
	}

	init(selector): void {
		// 4d. Set up HammerJS
		var sliderManager = new Hammer.Manager(this.sliderContainer.nativeElement);
		sliderManager.add( new Hammer.Pan({ threshold: 0, pointers: 0 }) );
		sliderManager.on( 'pan', (e: HammerInput) => {
			this.velocity = e.velocityX;
			this.delta = e.deltaX;

			if (e.isFinal) {
				const _delta = this.delta;
				this.margin -= this.delta;
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

	setActiveSlide(value: number) {
		this.activeSlide = value;
		this.activeSlideSet.emit(value);
	}

	gotoNextSlide() {
		console.log("gotoNextSlide");
		this.setActiveSlide(this.activeSlide += 1);

		if (this.activeSlide > this.slides.length - 1) {
			this.setActiveSlide(this.slides.length - 1);

		}
		
		this.nextToSlide();
	}
	
	gotoPrevSlide() {
		console.log("gotoPrevSlide");
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
		const goal = this.container.offsetWidth * this.activeSlide;
		console.log('nextToSlide', goal, this.margin);


		// if (this.velocity < 0) {
		// 	this.velocity = -50;
		// } else if (this.velocity > 0) {
		// 	this.velocity = 50;
		// }

		if (this.margin === goal) {
			return;
		}

		if (this.margin < goal) {
			if (this.velocity > -this.swipV) {
				this.velocity = -this.swipV;
			}

			this.margin -= this.velocity;

			if (this.margin >= goal) {
				this.margin = goal;
				this.velocity = 0;
				return;
			}

			this.velocity *= 1.1;

			if (this.velocity > 50) {
				this.velocity = 50;
			}

			setTimeout(() => {
				this.nextToSlide();
			}, 0);
		} else if (this.margin > goal) {
			if (this.velocity < this.swipV) {
				this.velocity = this.swipV;
			}

			this.margin -= this.velocity;

			if (this.margin <= goal) {
				this.margin = goal;
				this.velocity = 0;
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
