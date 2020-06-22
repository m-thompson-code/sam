import { Component, Input } from '@angular/core';

@Component({
  selector: 'moo-preloader',
  styleUrls: [ './preloader.style.scss' ],
  templateUrl: './preloader.template.html',
  providers: [ ]
})
export class PreloaderComponent {
	@Input() public mode: any;
	@Input() public delay?: number;

	@Input() public relative?: boolean;

	public active?: boolean;
	constructor() {
	}

	ngOnInit() {
		setTimeout(() => {
			this.active = true;
		}, this.delay || 1);
	}
}
