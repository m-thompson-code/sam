import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ImageComponent } from './image.component';

@NgModule({
  declarations: [
    ImageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ ImageComponent ]
})
export class ImageModule {
}
