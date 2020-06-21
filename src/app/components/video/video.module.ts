import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VideoComponent } from './video.component';

import { PreloaderModule } from '../preloader/preloader.module';

@NgModule({
  declarations: [
    VideoComponent
  ],
  imports: [
    PreloaderModule,
    CommonModule
  ],
  exports: [ VideoComponent ]
})
export class VideoModule {
}
