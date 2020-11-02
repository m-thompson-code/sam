import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { NavComponent } from './nav/nav.component';

const routes: Routes = [
    {
        path: '',
        component: NavComponent,
    },
    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        runGuardsAndResolvers: 'always',
        canDeactivate: [
            CanDeactivateGuard,
        ],
    },
    {
        path: 'project/:projectIndex',
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
        runGuardsAndResolvers: 'always',
        canDeactivate: [
            CanDeactivateGuard,
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        // useHash: true,
        onSameUrlNavigation: 'reload',
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
