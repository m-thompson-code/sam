import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { MarginPipe } from './margin.pipe';
import { NoSanitizeStylePipe } from './noSanitizeStyle.pipe';

@NgModule({
    imports: [],
    declarations: [
        MarginPipe,
        NoSanitizeStylePipe,
    ],
    exports:[
        MarginPipe,
        NoSanitizeStylePipe,
    ],
})

export class PipeModule {

}
