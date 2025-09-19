import { AnexoFacturaComponent } from './anexo-factura/anexo-factura.component';
import { ComunicadosProveedorComponent } from './comunicados/comunicados-proveedor/comunicados-proveedor.component';
import { ProveedorGuard } from './../services/guards/proveedor.guard';

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
import { VerificaAdminGuard } from '../services/guards/verifica-admin.guard';
import { DocanexosComponent } from './docanexos/docanexos.component';
import { ListadoComponent } from './listado/listado.component';
import { PerfilProveedorComponent } from './perfil-proveedor/perfil-proveedor.component';
import { CambiarPasswordComponent } from './cambiar-password/cambiar-password.component';
const pagesRoutes: Routes = [
    {
        path: '', component: PagesComponent,
        canActivate: [ LoginGuard ],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,            
                data: { titulo: 'Dashboard' }
            },
            
            { path: 'comunicados', component:ComunicadosComponent, data: { titulo: "Comunicados",modulo:"comunicados" },canActivate:[VerificaAdminGuard] },
            { path:'listado', component:ListadoComponent,data:{titulo:"Proveedores",modulo:"#"},canActivate:[VerificaAdminGuard]},
            { path:'perfil-proveedor', component:PerfilProveedorComponent,data:{titulo:"En este módulo no se validaran los documentos",modulo:"#"},canActivate:[VerificaAdminGuard]},
            { path:'docanexos', component:DocanexosComponent,data:{titulo:"Documentos anexos",modulo:"#"},canActivate:[VerificaAdminGuard]},
            { path: 'comunicados/agregar', component:DetalleComponent, data: { titulo: "Agregar comunicado",modulo:"comunicados" } ,canActivate:[VerificaAdminGuard]},
            { path: 'comunicados/editar/:id', component:DetalleComponent, data: { titulo: "Editar comunicado",modulo:"comunicados" } ,canActivate:[VerificaAdminGuard]},
            { path: 'comunicados/disponibilidad/:id', component:DisponibilidadComponent, data: { titulo: "Comunicado por proveedor",modulo:"comunicados" },canActivate:[VerificaAdminGuard] },

            
            { path: 'comunicados/proveedor', component:ComunicadosProveedorComponent, data: { titulo: "Avisos",modulo:"comunicados" },canActivate:[ProveedorGuard] },                        
            { path: 'facturas-emitidas', component: PendientesCobroComponent, data: { titulo: "Facturas emitidas",modulo:"pendientes-cobro" } ,canActivate:[ProveedorGuard]},
            { path: 'anexo-factura/:id', component: AnexoFacturaComponent, data: { titulo: "Anexo Factura",modulo:"anexo-factura" } ,canActivate:[ProveedorGuard]},
            { path: 'contra-recibos', component: ContraRecibosComponent, data: { titulo: "Contra recibos pendientes",modulo:"contra-recibos" },canActivate:[ProveedorGuard] },
            { path: 'pagos-aprobados', component: PagosAprobadosComponent, data: { titulo: "Pagos aprobados" ,modulo:"pagos-aprobados"} ,canActivate:[ProveedorGuard]},
            { path: 'pagos-programados', component: PagosProgramadosComponent, data: { titulo: "Pagos programados" ,modulo:"pagos-programados"} ,canActivate:[ProveedorGuard]},
            { path:'repse',component:},
            { path: 'cambiar-password', component: CambiarPasswordComponent },
            { path: 'account-settings', component:AccountSettingsComponent,data:{titulo:"Settings" ,modulo:"#"}  },
            { path: 'perfil', component:PerfilComponent,data:{titulo:"Perfil",modulo:"#" }  },
            { path: '', redirectTo: '/facturas-emitidas', pathMatch: 'full' }
        ]
    }
];

export const PAGESROUTES = RouterModule.forChild(pagesRoutes);