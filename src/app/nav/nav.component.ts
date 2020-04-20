import { Component, HostListener, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';

import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'moo-nav',
    templateUrl: './nav.template.html',
    styleUrls: ['./nav.style.scss']
})
export class NavComponent implements OnInit {
	
	constructor(public appService: AppService, private router: Router) {
	}

	public ngOnInit(): void {
		if (!this.appService.first) {
			setTimeout(() => {
				this.nav();
			}, 1);
		} else {
			window.history.back();
		}
	}

	public nav(): void {
		this.appService.first = true;

		this.router.navigate(['/home']);
	}
}
