import { DragulaModule, DragulaService } from 'ng2-dragula';

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
    DragulaModule,
    BrowserModule,

    SpacedModule,
    TextPlacementTestModule,

    InputModule,
    PreloaderModule
  ],
  providers: [DragulaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
