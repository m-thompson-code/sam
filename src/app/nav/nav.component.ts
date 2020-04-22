import { Component, HostListener, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';

import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'moo-nav',
    templateUrl: './nav.template.html',
    styleUrls: ['./nav.style.scss']
})
export class NavComponent implements OnInit {
	timeout: any;
	count: 0;
	constructor(public appService: AppService, private router: Router) {
	}

	public ngOnInit(): void {
		if (!this.appService.first) {
			this.appService.first = true;
			
			clearTimeout(this.timeout);

			this.timeout = setTimeout(() => {
				this.navHome();
			}, 1);
		} else {
			setTimeout(() => {
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
		console.log(this.router.url);
		if (this.router.url !== '/') {
			return;
		}

		clearTimeout(this.timeout);

		this.timeout = setTimeout(() => {
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
