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
	constructor(public appService: AppService, private router: Router) {
	}

	public ngOnInit(): void {
		if (!this.appService.first) {
			this.appService.first = true;
			
			clearTimeout(this.timeout);

			this.timeout = setTimeout(() => {
				this.nav();
			}, 1);
		} else {
			console.log('first');
			window.history.back();

			clearTimeout(this.timeout);

			this.timeout = setTimeout(() => {
				console.log('second');

				window.history.back();
				this.backLoop();
			}, 1);
		}
	}

	public nav(): void {
		this.appService.first = true;

		this.router.navigate(['/home']);
	}

	public backLoop(): void {
		clearTimeout(this.timeout);

		this.timeout = setTimeout(() => {
			console.log('loop back');
			window.history.back();
			this.backLoop();
		}, 100);
	}

	public ngOnDestroy() {
		clearTimeout(this.timeout);
	}
}
