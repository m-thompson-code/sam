import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';

import { CanDeactivateGuard } from '../guards/can-deactivate.guard';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canDeactivate: [
            CanDeactivateGuard
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
