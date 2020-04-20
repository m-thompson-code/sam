import { Component, HostListener, ViewChild, ElementRef, NgZone, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AppService } from '../app.service';
import { Project } from '../app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

declare var M;

@Component({
    selector: 'moo-project',
    templateUrl: './project.template.html',
    styleUrls: ['./project.style.scss']
})
export class ProjectComponent  implements OnInit, AfterViewInit, OnDestroy {
	activeSlide: number = 0;
	urlIndex: number;

	activeProject: Project;

	paramSubscription: Subscription;

	constructor(public appService: AppService, private router: Router, private activatedRoute: ActivatedRoute) {
	}

	ngOnInit() {
		this.appService.mode = 'dark';
		
		document.body.className = "project";
        this.paramSubscription = this.activatedRoute.params.subscribe(params => {
			this.urlIndex = +params['projectIndex'];
			if (this.urlIndex === 99) {
				this.activeProject = this.appService.projects[1];
			} else {
				this.activeProject = this.appService.projects[this.urlIndex];
			}
		});
	}

	ngAfterViewInit() {
		// setTimeout(function(){
		// 	// This hides the address bar:
		// 	window.scrollTo(0, 100);
		// }, 0);
	}

	ngOnDestroy() {
		document.body.className = "";

		this.paramSubscription && this.paramSubscription.unsubscribe && this.paramSubscription.unsubscribe();
	}
}
