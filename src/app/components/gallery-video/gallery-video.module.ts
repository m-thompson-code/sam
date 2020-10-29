import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryVideoComponent } from './gallery-video.component';

import { DirectivesModule } from '@app/directives';

@NgModule({
    declarations: [GalleryVideoComponent],
    imports: [
        CommonModule,

        DirectivesModule,
    ],
    exports: [GalleryVideoComponent]
})
export class GalleryVideoModule { }
