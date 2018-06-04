import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'moo-preloader',
  styleUrls: [ './preloader.style.css' ],
  templateUrl: './preloader.template.html',
  providers: [ ]
})
export class PreloaderComponent {
	@Input() mode: any;
	@Input() delay: any;

	active: boolean;
	constructor() {
	}

	ngOnInit() {
		setTimeout(() => {
			this.active = true;
		}, this.delay || 1);
	}
}
