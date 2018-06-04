import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// import firebase from 'firebase';
import * as firebase from "firebase";

import { SpacedModule } from './spaced/spaced.module';
import { TextPlacementTestModule } from './textPlacementTest/textPlacementTest.module';

import { InputModule } from './input/input.module';
import { PreloaderModule } from './preloader/preloader.module';

import { AppComponent } from './app.component';

// Initialize Firebase Server
import { firebaseConfig } from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    SpacedModule,
    TextPlacementTestModule,

    InputModule,
    PreloaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
