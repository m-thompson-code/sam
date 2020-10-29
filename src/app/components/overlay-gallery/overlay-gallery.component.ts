import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';

import { OverlayGalleryService } from '@app/services/overlay-gallery.service';

import { GalleryComponent } from '@app/components/gallery/gallery.component';

@Component({
    selector: 'moo-overlay-gallery',
    templateUrl: './overlay-gallery.template.html',
    styleUrls: ['./overlay-gallery.style.scss']
})
export class OverlayGalleryComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('gallery', {static: false}) public galleryRef!: GalleryComponent;

    public show?: boolean;

    private _keyDownFunc?: (event: KeyboardEvent) => void;

    private _timeout?: number;

    public templateReady: boolean = false;

    constructor(public overlayGalleryService: OverlayGalleryService) {

    }

    public ngOnInit(): void {
        this.overlayGalleryService.deactivateHandler = () => {
            this.deactivate();    
        }

       this.activate();
    }

    public ngAfterViewInit(): void {
        setTimeout(() => {
            this.templateReady = true;
        })
    }

    public activate(): void {
        this.show = true;

        const offsetY = window.pageYOffset;
        document.body.style.top = `${-offsetY}px`;
        document.body.classList.add('js-lock-position');

        this.bindKeyDownListeners();
    }

    private bindKeyDownListeners(): void {
        this._keyDownFunc = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                this.galleryRef.decreaseIndex();
            } else if (event.key === 'ArrowRight') {
                this.galleryRef.increaseIndex();
            } else if (event.key === 'Escape') {
                this.deactivate();
            }
        }
		
		document.addEventListener('keydown', this._keyDownFunc);
    }
    
    public deactivate(): void {
        this.show = false;

        clearTimeout(this._timeout);
        this._timeout = window.setTimeout(() => {
            const offsetY = Math.abs(parseInt(document.body.style.top || "0", 10));
            document.body.classList.remove('js-lock-position');
            document.body.style.removeProperty('top');
            window.scrollTo(0, offsetY || 0);
    
            this._timeout = window.setTimeout(() => {
                this.overlayGalleryService.active = false;

                // Setting active to false is handled by overlay component
                this.overlayGalleryService.assets = [];
                this.overlayGalleryService.initalIndex = 0;
            }, 0);
        }, 200);
    }

    public ngOnDestroy(): void {
        if (this._keyDownFunc) {
            document.removeEventListener('keydown', this._keyDownFunc);
        }

        clearTimeout(this._timeout);
    }
}
