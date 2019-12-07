import { Component, HostListener, ViewChild, ElementRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';
import { Project } from '../app.component';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

declare var M;

@Component({
    selector: 'moo-project',
    templateUrl: './project.template.html',
    styleUrls: ['./project.style.scss']
})
export class ProjectComponent  implements OnInit, OnDestroy {
	activeSlide: number = 0;
	urlIndex: number;

	activeProject: Project;

	paramSubscription: Subscription;

	constructor(public appService: AppService, private activatedRoute: ActivatedRoute) {
	}

	ngOnInit() {
        this.paramSubscription = this.activatedRoute.params.subscribe(params => {
			this.urlIndex = +params['projectIndex'];
			if (this.urlIndex === 99) {
				this.activeProject = this.appService.projects[1];
			} else {
				this.activeProject = this.appService.projects[this.urlIndex];
			}
		});
	}

	ngOnDestroy() {
		this.paramSubscription && this.paramSubscription.unsubscribe && this.paramSubscription.unsubscribe();
	}
}
