import { LoginGuard } from './../services/guards/usuario.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PagosAprobadosComponent } from './pagos-aprobados/pagos-aprobados.component';
import { ContraRecibosComponent } from './contra-recibos/contra-recibos.component';
import { PendientesCobroComponent } from './pendientes-cobro/pendientes-cobro.component';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
const pagesRoutes: Routes = [
    {
        path: '', component: PagesComponent,
        canActivate: [ LoginGuard ],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                //canActivate : [VerificaTokenGuard],
                data: { titulo: 'Dashboard' }
            },
            { path: 'pendientes-cobro', component: PendientesCobroComponent, data: { titulo: "Pendientes de cobro" } },
            { path: 'contra-recibos', component: ContraRecibosComponent, data: { titulo: "Contra recibos pendientes" } },
            { path: 'pagos-aprobados', component: PagosAprobadosComponent, data: { titulo: "Pagos aprobados" } },
            { path: 'account-settings', component:AccountSettingsComponent,data:{titulo:"Settings" }  },
            { path: 'perfil', component:PerfilComponent,data:{titulo:"Perfil" }  },
            { path: '', redirectTo: '/pendientes-cobro', pathMatch: 'full' }
        ]
    }
];

export const PAGESROUTES = RouterModule.forChild(pagesRoutes);