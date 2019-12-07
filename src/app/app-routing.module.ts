import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard } from './guards/can-deactivate.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: './home/home.module#HomeModule',
    },
    {
        path: 'project/:projectIndex',
        loadChildren: './project/project.module#ProjectModule',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes,{
        useHash: true,
        onSameUrlNavigation: 'reload',
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
