import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryImageComponent } from './gallery-image.component';

import { DirectivesModule } from '@app/directives';

@NgModule({
    declarations: [GalleryImageComponent],
    imports: [
        CommonModule,

        DirectivesModule,
    ],
    exports: [GalleryImageComponent]
})
export class GalleryImageModule { }
