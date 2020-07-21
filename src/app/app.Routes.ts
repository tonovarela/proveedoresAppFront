import { PagesComponent } from './pages/pages.component';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { LoginGuard } from './services/guards/usuario.guard';


const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '', component: PagesComponent,
        canActivate: [LoginGuard],
        loadChildren: './pages/pages.module#PagesModule'
        //loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
    },
    { path: '**', component: NopagefoundComponent },
];
export const APP_ROUTES = RouterModule.forRoot(appRoutes, { useHash:true });