import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppService } from './services/app.service';
import { AnalyticsService } from './services/analytics.service';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { OverlayGalleryService } from './services/overlay-gallery.service';

export interface TagElement {
	text: string;
	href?: string;
}

export interface Tag {
	text: string;
	elements: TagElement[];
}

export interface Asset {
	type: 'image' | 'video';
	url: string;
	thumbnail_url: string;
}

export interface DBProject {
	text: string; // Dispaly text
	href: string; // Href on click
	useSlideshow: boolean; // Use slideshow instead of href on click
	assets: Asset[];
	desc: string;
	tags: Tag[];
}

export interface Project extends DBProject {
	width: number; // Width of text
	margin: number; // ?
	marginRight: number; // ?
}

@Component({
    selector: 'app-root',
    templateUrl: './app.template.html',
    styleUrls: ['./app.style.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
	@ViewChild("backgroundImageHolder", { static: true }) backgroundImageHolder?: ElementRef;

	public loading : boolean;

	public dataLoading: boolean;
	public backgroundImageLoading: boolean;

	private _routerEventsSub?: Subscription;

	private _detachListeners?: () => void;

	constructor(private router: Router, private renderer: Renderer2, public appService: AppService, 
		private analyticsService: AnalyticsService, public overlayGalleryService: OverlayGalleryService) {
		this.loading = false;
		this.dataLoading = false;
		this.backgroundImageLoading = false;
	}

	public ngOnInit(): void {
		this.dataLoading = true;
		this.backgroundImageLoading = true;
		this.loading = true;

		this._loadProjects();

		// Handle getting screen height css variables
        const appHeight = () => {
            try {
                const doc = document.documentElement;

                const windowHeight = window.innerHeight;

                doc.style.setProperty('--app-height-100', `${windowHeight}px`);
                doc.style.setProperty('--app-height-95', `${windowHeight * .95}px`);
                doc.style.setProperty('--app-height-50', `${windowHeight * .5}px`);
            } catch(error) {
                if (this.appService.env === 'dev') {
                    console.error(error);
                    debugger;
                }
            }
        }

        const _onResize = () => {
            appHeight();
            // updateResponsiveService();
        }

        const _off__resize = this.renderer.listen('window', 'resize', _onResize);
        const _off__orientationchange = this.renderer.listen('window', 'orientationchange', _onResize);
        
        this._detachListeners = () => {
            _off__resize();
            _off__orientationchange();
        };

        appHeight();
	}

	public ngAfterViewInit(): void {
		this._routerEventsSub = this.router.events.subscribe(routerEvent=> {
			this._checkRouterEvent(routerEvent as RouterEvent);
		});
		
		setTimeout(() => {
			try {
				if (!this.backgroundImageHolder) {
					throw {
						message: "Unexpected missing backgroundImageHolder",
					};
				}

				const _computedStyle: CSSStyleDeclaration = window.getComputedStyle(this.backgroundImageHolder.nativeElement);
				const src = _computedStyle && _computedStyle['backgroundImage'] || "";

				const urlMatches = src.match(/\((.*?)\)/);

				var url = urlMatches && urlMatches.length && urlMatches[1].replace(/('|")/g,'') || "";

				var img = new Image();

				img.onload = () => {
					this.backgroundImageLoading = false;
					this.loading = this.backgroundImageLoading || this.dataLoading;
				};

				img.onerror = (error) => {
					console.error(error);
					this.backgroundImageLoading = false;
					this.loading = this.backgroundImageLoading || this.dataLoading;
				};

				img.src = url;
			}catch(error) {
				console.error(error);
				this.backgroundImageLoading = false;
				this.loading = this.backgroundImageLoading || this.dataLoading;
			}
			
		}, 1);
	}

	private _loadProjects(): Promise<void> {
		return this.appService.loadProjects().then(() => {
			this.dataLoading = false;

			this.loading = this.backgroundImageLoading || this.dataLoading;
		});
	}

	private _checkRouterEvent(routerEvent: RouterEvent): void {
		// Tracking page views
		if (routerEvent instanceof NavigationEnd) {
			try {
                this.analyticsService.addPageView({
                    url: routerEvent.urlAfterRedirects,
                });
			} catch(error) {
				if (this.appService.env !== 'prod') {
                    console.error(error);
                    debugger;
				}
			}
        }
    }

	public ngOnDestroy(): void {
		this._routerEventsSub?.unsubscribe();

		if (this._detachListeners) {
			this._detachListeners();
		}
	}
}
