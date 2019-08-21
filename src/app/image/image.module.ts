import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ImageComponent } from './image.component';

import { PreloaderModule } from '../preloader/preloader.module';

@NgModule({
  declarations: [
    ImageComponent
  ],
  imports: [
    PreloaderModule,
    CommonModule
  ],
  exports: [ ImageComponent ]
})
export class ImageModule {
}
