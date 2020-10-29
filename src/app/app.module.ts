import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';

import { DragulaModule, DragulaService } from 'ng2-dragula';
import firebase from "firebase/app";

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/database';
// import 'firebase/firestore';
// import 'firebase/storage';
// import 'firebase/messaging';
// import 'firebase/functions';

// Initialize Firebase
import { firebaseConfig } from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

firebase.analytics();

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PreloaderModule } from '@app/components/preloader/preloader.module';
import { OverlayGalleryModule } from '@app/components/overlay-gallery';

import { DirectivesModule } from '@app/directives';

import { PipeModule } from '@app/pipes/pipe.module';

import { CanDeactivateGuard } from '@app/guards/can-deactivate.guard';
import { NavComponent } from '@app/nav/nav.component';

import { AppService } from '@app/services/app.service';
import { AnalyticsService } from '@app/services/analytics.service';
import { OverlayGalleryService } from '@app/services/overlay-gallery.service';

import * as hammer from 'hammerjs';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
    overrides = <any> {
        pinch: { enable: false },
        rotate: { enable: false },
        pan: {
            direction: hammer.DIRECTION_HORIZONTAL,
            enable: true,
        },
    }
}

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
    ],
    imports: [
        AppRoutingModule,

        DragulaModule.forRoot(),
        BrowserModule,
        HammerModule,

        PreloaderModule,
        OverlayGalleryModule,

        DirectivesModule,

        PipeModule,
    ],
    providers: [
        DragulaService,
        CanDeactivateGuard,

        AppService,
        AnalyticsService,

        OverlayGalleryService,

        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: MyHammerConfig
        },
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
