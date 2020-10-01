import { Component, OnInit } from '@angular/core';

// TODO: this page is likely not needed anymore since Angular 9+

import { AppService } from '../services/app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'moo-nav',
    templateUrl: './nav.template.html',
    styleUrls: ['./nav.style.scss']
})
export class NavComponent implements OnInit {
	private timeout?: number;
	public count: number;

	constructor(public appService: AppService, private router: Router) {
		this.count = 0;
	}

	public ngOnInit(): void {
		this.count = 0;

		if (!this.appService.first) {
			this.appService.first = true;
			
			clearTimeout(this.timeout);

			this.timeout = window.setTimeout(() => {
				this.navHome();
			}, 1);
		} else {
			window.setTimeout(() => {
				this.navBack();

				this.backLoop();
			}, 100);
		}
	}

	public navHome(): void {
		this.appService.first = true;

		this.router.navigate(['/home']);
	}

	public backLoop(): void {
		// console.log(this.router.url);

		if (this.router.url !== '/') {
			return;
		}

		clearTimeout(this.timeout);

		this.timeout = window.setTimeout(() => {
			this.count += 1;

			// console.log('loop back');
			this.navBack();
			this.backLoop();
		}, 100 + this.count * 100);
	}

	public navBack(): void {
		if (this.router.url === '/') {
			window.history.back();
		}
	}

	public ngOnDestroy() {
		clearTimeout(this.timeout);
	}
}
