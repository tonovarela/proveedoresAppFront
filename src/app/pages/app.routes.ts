import { DisponibilidadComponent } from './comunicados/disponibilidad/disponibilidad.component';
import { DetalleComponent } from './comunicados/detalle/detalle.component';
import { ComunicadosComponent } from './comunicados/comunicados.component';
import { LoginGuard } from './../services/guards/usuario.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PagosAprobadosComponent } from './pagos-aprobados/pagos-aprobados.component';
import { PagosProgramadosComponent } from './pagos-programados/pagos-programados.component';
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
            { path: 'comunicados', component:ComunicadosComponent, data: { titulo: "Comunicados",modulo:"comunicados" } },
            { path: 'comunicados/agregar', component:DetalleComponent, data: { titulo: "Comunicado",modulo:"comunicados" } },
            { path: 'comunicados/editar/:id', component:DetalleComponent, data: { titulo: "Comunicado",modulo:"comunicados" } },
            { path: 'comunicados/disponibilidad/:id', component:DisponibilidadComponent, data: { titulo: "Comunicado",modulo:"comunicados" } },
            { path: 'facturas-emitidas', component: PendientesCobroComponent, data: { titulo: "Facturas emitidas",modulo:"pendientes-cobro" } },
            { path: 'contra-recibos', component: ContraRecibosComponent, data: { titulo: "Contra recibos pendientes",modulo:"contra-recibos" } },
            { path: 'pagos-aprobados', component: PagosAprobadosComponent, data: { titulo: "Pagos aprobados" ,modulo:"pagos-aprobados"} },
            { path: 'pagos-programados', component: PagosProgramadosComponent, data: { titulo: "Pagos programados" ,modulo:"pagos-programados"} },
            { path: 'account-settings', component:AccountSettingsComponent,data:{titulo:"Settings" ,modulo:"#"}  },
            { path: 'perfil', component:PerfilComponent,data:{titulo:"Perfil",modulo:"#" }  },
            { path: '', redirectTo: '/facturas-emitidas', pathMatch: 'full' }
        ]
    }
];

export const PAGESROUTES = RouterModule.forChild(pagesRoutes);