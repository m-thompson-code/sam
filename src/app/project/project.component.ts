import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AppService } from '../app.service';
import { Project } from '../app.component';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

declare var M: any;

@Component({
    selector: 'moo-project',
    templateUrl: './project.template.html',
    styleUrls: ['./project.style.scss']
})
export class ProjectComponent  implements OnInit, AfterViewInit, OnDestroy {
	public activeSlide: number = 0;
	private urlIndex?: number;

	public activeProject?: Project;

	private paramSubscription?: Subscription;

	constructor(public appService: AppService, private activatedRoute: ActivatedRoute) {
	}

	public ngOnInit(): void {
		this.activeSlide = 0;

		this.appService.mode = 'dark';
		this.appService.first = true;
		
		document.body.className = "project";
		
        this.paramSubscription = this.activatedRoute.params.subscribe(params => {
			this.activeSlide = 0;

			this.urlIndex = +params['projectIndex'];
			if (this.urlIndex === 99) {
				this.activeProject = this.appService.projects[1];
			} else {
				this.activeProject = this.appService.projects[this.urlIndex];
			}
		});
	}

	public getActive(el: HTMLElement): void {
    	el.classList.add("active");
    }

    public getNotActive(el: HTMLElement): void {
    	el.classList.remove("active");
    }

	public ngAfterViewInit(): void {
	}

	public ngOnDestroy(): void {
		document.body.className = "dark";

		this.paramSubscription && this.paramSubscription.unsubscribe && this.paramSubscription.unsubscribe();
	}
}
