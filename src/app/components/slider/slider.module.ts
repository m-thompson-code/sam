import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { SliderComponent } from './slider.component';

import { ImageModule } from '../image/image.module';
import { VideoModule } from '../video/video.module';

import { PipeModule } from '../../pipes/pipe.module';

@NgModule({
  declarations: [
    SliderComponent
  ],
  imports: [
    CommonModule,

    ImageModule,
    VideoModule,

    PipeModule
  ],
  exports: [ SliderComponent ]
})
export class SliderModule {
}
