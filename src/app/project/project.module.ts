import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ProjectComponent } from './project.component'
import { ProjectRoutingModule } from './project-routing.module';

import { PreloaderModule } from '../components/preloader/preloader.module';
import { DotsModule } from '../components/dots/dots.module';
import { SliderModule } from '../components/slider/slider.module';
import { SpacedModule } from '../components/spaced/spaced.module';

@NgModule({
    declarations: [
        ProjectComponent
    ],
    imports: [
        CommonModule,
        ProjectRoutingModule,

        PreloaderModule,
        DotsModule,
        SliderModule,
        SpacedModule
    ]
})
export class ProjectModule { }
