import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DragulaModule, DragulaService } from 'ng2-dragula';
import * as firebase from "firebase/app";

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

import { AppService } from './services/app.service';
import { AnalyticsService } from './services/analytics.service';

import { PreloaderModule } from './components/preloader/preloader.module';

import { PipeModule } from './pipes/pipe.module';

import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { NavComponent } from './nav/nav.component';

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
    ],
    imports: [
        AppRoutingModule,

        DragulaModule.forRoot(),
        BrowserModule,

        PreloaderModule,

        PipeModule,
    ],
    providers: [
        DragulaService,
        CanDeactivateGuard,

        AppService,
        AnalyticsService,
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
