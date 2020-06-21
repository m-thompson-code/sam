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
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    },
    {
        path: 'project/:projectIndex',
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
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
