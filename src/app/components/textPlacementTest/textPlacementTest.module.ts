import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SpacedModule } from '../spaced/spaced.module';

import { TextPlacementTestComponent } from './textPlacementTest.component';

@NgModule({
  declarations: [
    TextPlacementTestComponent
  ],
  imports: [
    CommonModule,

    SpacedModule
  ],
  exports: [ TextPlacementTestComponent ]
})
export class TextPlacementTestModule {
}
