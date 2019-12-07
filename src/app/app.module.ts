import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DragulaModule, DragulaService } from 'ng2-dragula';
import * as firebase from "firebase/app";

import 'firebase/auth';
import 'firebase/database';
// import 'firebase/firestore';
// import 'firebase/storage';
// import 'firebase/messaging';
// import 'firebase/functions';

// Initialize Firebase Server
import { firebaseConfig } from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';


import { SpacedModule } from './components/spaced/spaced.module';
import { MobileSpacedModule } from './components/mobileSpaced/mobileSpaced.module';
import { TextPlacementTestModule } from './components/textPlacementTest/textPlacementTest.module';

import { IconModule } from './components/icon/icon.module';
import { ImageModule } from './components/image/image.module';
import { InputModule } from './components/input/input.module';
import { PreloaderModule } from './components/preloader/preloader.module';
import { DotsModule } from './components/dots/dots.module';
import { SliderModule } from './components/slider/slider.module';

import { PipeModule } from './pipes/pipe.module';

import { CanDeactivateGuard } from './guards/can-deactivate.guard';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,

        DragulaModule.forRoot(),
        BrowserModule,

        SpacedModule,
        MobileSpacedModule,
        TextPlacementTestModule,

        IconModule,
        InputModule,
        ImageModule,
        PreloaderModule,
        DotsModule,
        SliderModule,

        PipeModule
    ],
    providers: [
        DragulaService,
        CanDeactivateGuard,

        AppService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
