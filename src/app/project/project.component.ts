import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { AppService } from '../services/app.service';
import { Project, TagElement } from '../app.component';
import { AnalyticsService } from '../services/analytics.service';
import { OverlayGalleryService } from '@app/services/overlay-gallery.service';
import { AssetClickEvent } from '@app/components/slider/slider.component';

declare var M: any;

@Component({
    selector: 'moo-project',
    templateUrl: './project.template.html',
    styleUrls: ['./project.style.scss']
})
export class ProjectComponent  implements OnInit, OnDestroy {
	public activeSlide: number = 0;
	private urlIndex?: number;

	public activeProject?: Project;

	private paramSubscription?: Subscription;

	constructor(public appService: AppService, private activatedRoute: ActivatedRoute, 
		private analyticsService: AnalyticsService, private overlayGalleryService: OverlayGalleryService) {
	}

	public ngOnInit(): void {
		this.activeSlide = 0;

		this.appService.mode = 'dark';
		this.appService.first = true;
		
		document.body.className = "project";
		
        this.paramSubscription = this.activatedRoute.params.subscribe(params => {
			this.urlIndex = +params['projectIndex'];
			this.activeProject = this.appService.projects[this.urlIndex];

			this.setActiveSlide(0);
		});
	}

	public setActiveSlide(index: number): void {
		this.activeSlide = index;

		if (this.activeProject) {
			this.analyticsService.addProjectView({
				project: this.activeProject.text,
				resourceUrl: this.activeProject?.assets[this.activeSlide]?.url,
				resourceType: this.activeProject?.assets[this.activeSlide]?.type,
				index: this.activeSlide,
			});
		}
	}

	public getActive(el: HTMLElement): void {
    	el.classList.add("active");
    }

    public getNotActive(el: HTMLElement): void {
    	el.classList.remove("active");
    }

	public addTagAnalytic(tagElement: TagElement): void {
		this.analyticsService.addTagElementView({
			text: tagElement.text,
			href: tagElement.href,
		});
	}

	public handleAssetClick(assetClickEvent: AssetClickEvent): void {
		console.log(assetClickEvent);
		
		if (!this.activeProject) {
			return;
		}

		this.overlayGalleryService.activate(assetClickEvent.index, this.activeProject.assets);
	}

	public ngOnDestroy(): void {
		document.body.className = "dark";

		this.paramSubscription && this.paramSubscription.unsubscribe && this.paramSubscription.unsubscribe();
	}
}
