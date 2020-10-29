import { Component, Input, ViewChild, ElementRef, OnDestroy, NgZone, AfterViewInit, Renderer2 } from '@angular/core';

import { AppService } from '@app/services/app.service';
import { SlideAsset } from '../gallery/gallery.component';

@Component({
    selector: 'moo-gallery-video',
    templateUrl: './gallery-video.template.html',
    styleUrls: ['./gallery-video.style.scss']
})
export class GalleryVideoComponent implements AfterViewInit, OnDestroy {
    @ViewChild('video', {static: true}) private video!: ElementRef<HTMLVideoElement>;

    private _src: string | ArrayBuffer | null | undefined = '';

    // Used for the template since binding a set property is bad performance
    public src_template: string | ArrayBuffer | null | undefined = '';

    @Input()
    public set src(src: string | ArrayBuffer | null | undefined) {
        const _src: string | ArrayBuffer | null | undefined = src || '';

        if (_src) {
            // TODO: listen to video
            this.handleSrc(_src);
        }

        this._src = _src || '';
    };

    public get src(): string | ArrayBuffer | null | undefined {
        return this._src;
    };

    private _getDimensionsInterval?: number;

    public videoWidth: number = 0;
    public videoHeight: number = 0;

    @Input() containerElement?: HTMLElement;
    @Input() slideAsset?: SlideAsset;

    private _detachListeners?: () => void;

    constructor(private ngZone: NgZone, private renderer: Renderer2, private appService: AppService) {
    }

    public handleSrc(src: string | ArrayBuffer | null | undefined): void {
        this.videoWidth = 0;
        this.videoHeight = 0;

        this._detachListeners && this._detachListeners();

        const _load_off = this.renderer.listen(this.video.nativeElement, 'loadedmetadata', this.onload.bind(this));
        const _error_off = this.renderer.listen(this.video.nativeElement, 'error', this.onerror.bind(this));
        
        this._detachListeners = () => {
            _load_off();
            _error_off();
        };

        clearInterval(this._getDimensionsInterval);
        this._getDimensionsInterval = window.setInterval(() => {
            if (this.video.nativeElement.videoWidth && this.video.nativeElement.videoHeight) {
                clearInterval(this._getDimensionsInterval);
                this.videoWidth = this.video.nativeElement.videoWidth;
                this.videoHeight = this.video.nativeElement.videoHeight;
            }
        }, 100);
        
        this.src_template = src;
    }

    public onload(event: any): void {
        this.ngZone.run(() => {
            this.videoWidth = this.video.nativeElement.videoWidth;
            this.videoHeight = this.video.nativeElement.videoHeight;
        });
    }

    public onerror(error: any): void {
        this.ngZone.run(() => {
            console.error(error);
        });
    }

    public ngAfterViewInit(): void {
        if (!this.src) {
            if (this.appService.env === 'dev') {
                debugger;
            }
        }

        if (!this.video) {
            if (this.appService.env === 'dev') {
                debugger;
            }
        }
    }

    public ngOnDestroy(): void {
        this._detachListeners && this._detachListeners();
    }
}
