import { NgModule } from '@angular/core';

import { DragulaModule } from 'ng2-dragula';

import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component'
import { HomeRoutingModule } from './home-routing.module';

import { SpacedModule } from '../components/spaced/spaced.module';
import { MobileSpacedModule } from '../components/mobileSpaced/mobileSpaced.module';
import { TextPlacementTestModule } from '../components/textPlacementTest/textPlacementTest.module';

import { IconModule } from '../components/icon/icon.module';
import { ImageModule } from '../components/image/image.module';
import { InputModule } from '../components/input/input.module';
import { TextareaModule } from '../components/textarea/textarea.module';
import { PreloaderModule } from '../components/preloader/preloader.module';
import { DotsModule } from '../components/dots/dots.module';

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,

        DragulaModule.forRoot(),

        SpacedModule,
        MobileSpacedModule,
        TextPlacementTestModule,

        IconModule,
        InputModule,
        TextareaModule,
        ImageModule,
        PreloaderModule,
        DotsModule,
    ],
})
export class HomeModule { }
