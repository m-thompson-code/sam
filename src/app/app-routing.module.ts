import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavComponent } from './nav/nav.component';

const routes: Routes = [
    {
        path: '',
        component: NavComponent,
    },
    {
        path: 'home',
        loadChildren: './home/home.module#HomeModule',
    },
    {
        path: 'project/:projectIndex',
        loadChildren: './project/project.module#ProjectModule',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: true,
        onSameUrlNavigation: 'reload',
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
