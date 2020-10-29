import { Injectable } from '@angular/core';

import { SlideAsset } from '@app/components/gallery/gallery.component';

import { AppService } from '@app/services/app.service';

@Injectable({
    providedIn: 'root',
})
export class OverlayGalleryService {
    public assets?: SlideAsset[];

    public active?: boolean;

    public initalIndex: number = 0;

    public deactivateHandler?: () => void;
    
    constructor(private appService: AppService) {
    }

    public activate(activateIndex: number, assets: SlideAsset[]): void {
        this.assets = assets;
        this.initalIndex = activateIndex;

        setTimeout(() => {
            this.active = true;
        }, 0);
    }
    
    public deactivate(): void {
        if (!this.deactivateHandler) {
            console.error("deactivate missing deactiveHandler");

            if (this.appService.env === 'dev') {
                debugger;
            }

            return;
        }

        this.deactivateHandler();
    }
}
