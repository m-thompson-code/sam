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

import { SpacedModule } from './spaced/spaced.module';
import { MobileSpacedModule } from './mobileSpaced/mobileSpaced.module';
import { TextPlacementTestModule } from './textPlacementTest/textPlacementTest.module';


import { IconModule } from './icon/icon.module';
import { ImageModule } from './image/image.module';
import { InputModule } from './input/input.module';
import { PreloaderModule } from './preloader/preloader.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    DragulaModule.forRoot(),
    BrowserModule,

    SpacedModule,
    MobileSpacedModule,
    TextPlacementTestModule,

    IconModule,
    InputModule,
    ImageModule,
    PreloaderModule,
  ],
  providers: [DragulaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
