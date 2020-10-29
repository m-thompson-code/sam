import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryComponent } from './gallery.component';

// import { DirectivesModule } from '@app/directives';

import { GalleryImageModule } from '@app/components/gallery-image';
import { GalleryVideoModule } from '@app/components/gallery-video';

@NgModule({
    declarations: [GalleryComponent],
    imports: [
        CommonModule,

        // DirectivesModule,

        GalleryImageModule,
        GalleryVideoModule,
    ],
    exports: [GalleryComponent]
})
export class GalleryModule { }
