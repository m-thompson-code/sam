import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { SliderComponent } from './slider.component';

@NgModule({
  declarations: [
    SliderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ SliderComponent ]
})
export class SliderModule {
}
