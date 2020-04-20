import { NgModule } from '@angular/core';

import { DragulaModule } from 'ng2-dragula';

import { CommonModule } from '@angular/common';

import { NavComponent } from './nav.component'
import { NavRoutingModule } from './nav-routing.module';

@NgModule({
    declarations: [
        NavComponent
    ],
    imports: [
        CommonModule,
        NavRoutingModule,
    ],
})
export class NavModule { }
