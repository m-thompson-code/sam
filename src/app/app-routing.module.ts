import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard } from './guards/can-deactivate.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: './home/home.module#HomeModule',
        canDeactivate: [
            CanDeactivateGuard
        ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
