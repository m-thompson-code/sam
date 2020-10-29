import { Component, OnInit, Input } from '@angular/core';

// import { environment } from '@environment';

export interface SlideImage {
    src?: string | ArrayBuffer | null | undefined;
    url?: string | ArrayBuffer | null | undefined;
    type?: "image" | "video";
}

export interface SlideAsset extends SlideImage {
    src?: string | ArrayBuffer | null | undefined;
    url?: string | ArrayBuffer | null | undefined;
    type: "image" | "video";
}

@Component({
    selector: 'moo-gallery',
    templateUrl: './gallery.template.html',
    styleUrls: ['./gallery.style.scss']
})
export class GalleryComponent implements OnInit {
    @Input() public assets: SlideAsset[] = [];
    public activeSlides: SlideAsset[] = [];

    @Input() public currentIndex: number = 0;

    public animate?: boolean;

    public slideDir?: 'left' | 'right';

    public panTransformStyle: string = '';

    public dragging: boolean = false;

    constructor() {

    }

    public ngOnInit(): void {
        this.updateCurrentImage();
    }

    public increaseIndex(): void {
        if (this.animate) {
            return;
        }

        this.animate = true;
        this.slideDir = 'right';

        setTimeout(() => {
            this.currentIndex += 1;

            if (this.currentIndex > this.assets.length - 1) {
                this.currentIndex = 0;
            }

            this.updateCurrentImage();
        }, 400);
    }
    
    public decreaseIndex(): void {
        if (this.animate) {
            return;
        }
        
        this.animate = true;
        this.slideDir = 'left';

        setTimeout(() => {
            this.currentIndex -= 1;

            if (this.currentIndex < 0) {
                this.currentIndex = this.assets.length - 1;
            }
    
            this.updateCurrentImage();
        }, 400);
    }

    public updateCurrentImage(): void {
        if (this.assets.length) {
            if (this.assets.length === 1) {
                this.activeSlides = [
                    this.assets[this.currentIndex],
                ];
            } else {
                const before = this.assets[this.currentIndex - 1] || this.assets[this.assets.length - 1];
                const current = this.assets[this.currentIndex];
                const after = this.assets[this.currentIndex + 1] || this.assets[0];

                this.activeSlides = [
                    before,
                    current,
                    after,
                ];

                const videos = document.getElementsByTagName('video');
                
                for (let i = 0; i < videos.length; i++) {
                    const video = videos[i];

                    video.pause();
                }
            }
        } else {
            this.activeSlides = [];
        }

        this.animate = false;
        this.slideDir = undefined;
    }

    public panHandler(event: any): void {
        const hammerEvent: HammerInput = event as HammerInput;

        if (this.assets.length === 1) {
            return;
        }

        if (this.animate) {
            return;
        }

        const deltaX = hammerEvent?.deltaX || 0;

        if (deltaX) {
            this.panTransformStyle = `translateX(${deltaX || 0}px)`;
        } else {
            this.panTransformStyle = '';
        }

        this.dragging = true;
    }

    public panEndHandler(event: any): void {
        const hammerEvent: HammerInput = event as HammerInput;

        if (this.assets.length === 1) {
            return;
        }

        if (this.animate) {
            return;
        }
        
        const deltaX = hammerEvent?.deltaX || 0;
        const velocityX = hammerEvent?.velocityX || 0;

        if (deltaX > 30 || velocityX > 1.5) {
            this.decreaseIndex();
        } else if (deltaX < -30 || velocityX < -1.5) {
            this.increaseIndex();
        }

        setTimeout(() => {
            this.panTransformStyle = '';
        }, 100);

        this.dragging = false;
    }
}
