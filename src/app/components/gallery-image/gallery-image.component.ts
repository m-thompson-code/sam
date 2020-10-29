import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, NgZone, AfterViewInit, Renderer2 } from '@angular/core';

import { AppService } from '@app/services/app.service';

@Component({
    selector: 'moo-gallery-image',
    templateUrl: './gallery-image.template.html',
    styleUrls: ['./gallery-image.style.scss']
})
export class GalleryImageComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('image', {static: true}) private image!: ElementRef<HTMLImageElement>;

    private _src: string | ArrayBuffer | null | undefined = '';

    // Used for the template since binding a set property is bad performance
    public src_template: string | ArrayBuffer | null | undefined = '';

    @Input()
    public set src(src: string | ArrayBuffer | null | undefined) {
        const _src: string | ArrayBuffer | null | undefined = src || '';

        if (_src) {
            // TODO: listen to image
            this.handleSrc(_src);
        }

        this._src = _src || '';
    };

    public get src(): string | ArrayBuffer | null | undefined {
        return this._src;
    };

    private _getDimensionsInterval?: number;

    public imageWidth: number = 0;
    public imageHeight: number = 0;

    @Input() containerElement?: HTMLElement;

    private _detachListeners?: () => void;

    constructor(private ngZone: NgZone, private renderer: Renderer2, private appService: AppService) {
    }

    public ngOnInit(): void {
    }

    public handleSrc(src: string | ArrayBuffer | null | undefined): void {
        this.imageWidth = 0;
        this.imageHeight = 0;

        this._detachListeners && this._detachListeners();

        const _load_off = this.renderer.listen(this.image.nativeElement, 'load', this.onload.bind(this));
        const _error_off = this.renderer.listen(this.image.nativeElement, 'error', this.onerror.bind(this));
        
        this._detachListeners = () => {
            _load_off();
            _error_off();
        };

        clearInterval(this._getDimensionsInterval);
        this._getDimensionsInterval = window.setInterval(() => {
            if (this.image.nativeElement.naturalWidth && this.image.nativeElement.naturalHeight) {
                clearInterval(this._getDimensionsInterval);
                this.imageWidth = this.image.nativeElement.naturalWidth;
                this.imageHeight = this.image.nativeElement.naturalHeight;
            }
        }, 100);
        
        this.src_template = src;
    }

    public onload(event: any): void {
        this.ngZone.run(() => {
            this.imageWidth = this.image.nativeElement.naturalWidth;
            this.imageHeight = this.image.nativeElement.naturalHeight;
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

        if (!this.image) {
            if (this.appService.env === 'dev') {
                debugger;
            }
        }
    }

    public ngOnDestroy(): void {
        this._detachListeners && this._detachListeners();
    }
}
