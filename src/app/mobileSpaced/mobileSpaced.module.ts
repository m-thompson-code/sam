import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MobileSpacedComponent } from './mobileSpaced.component';

@NgModule({
  declarations: [
    MobileSpacedComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ MobileSpacedComponent ]
})
export class MobileSpacedModule {
}
