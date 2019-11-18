import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SpacedComponent } from './spaced.component';

@NgModule({
  declarations: [
    SpacedComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ SpacedComponent ]
})
export class SpacedModule {
}
