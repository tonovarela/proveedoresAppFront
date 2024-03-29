
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './../shared/shared.module';




import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { GridModule, PagerModule, DetailRowService, PageService, SortService, FilterService, ReorderService, ResizeService, SelectionService, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';


import { PipesModule } from './../pipes/pipes.module';

import { PAGESROUTES } from './app.routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PendientesCobroComponent } from './pendientes-cobro/pendientes-cobro.component';
import { ContraRecibosComponent } from './contra-recibos/contra-recibos.component';
import { PagosAprobadosComponent } from './pagos-aprobados/pagos-aprobados.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PagesComponent } from './pages.component';

import { ComponentesModule } from './../componentes/componentes.module';

import { PagosProgramadosComponent } from './pagos-programados/pagos-programados.component';
import { ComunicadosComponent } from './comunicados/comunicados.component';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { DetalleComponent } from './comunicados/detalle/detalle.component';


import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { DisponibilidadComponent } from './comunicados/disponibilidad/disponibilidad.component';

import { ComunicadosProveedorComponent } from './comunicados/comunicados-proveedor/comunicados-proveedor.component';
import { AnexoFacturaComponent } from './anexo-factura/anexo-factura.component';
import { DocanexosComponent } from './docanexos/docanexos.component';
import { ListadoComponent } from './listado/listado.component';
import { PerfilProveedorComponent } from './perfil-proveedor/perfil-proveedor.component';
import { CambiarPasswordComponent } from './cambiar-password/cambiar-password.component';
registerLocaleData(es);

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    PendientesCobroComponent,
    ContraRecibosComponent,
    PagosAprobadosComponent,
    AccountSettingsComponent,
    PerfilComponent,
    PagosProgramadosComponent,
    ComunicadosComponent,
    DetalleComponent,
    DisponibilidadComponent,
    ComunicadosProveedorComponent,
    AnexoFacturaComponent,
    DocanexosComponent,
    ListadoComponent,
    PerfilProveedorComponent,
    CambiarPasswordComponent
  ],
  providers: [
    //{provide:LOCALE_ID,useValue:"es-MX"},
    PageService, SortService, DetailRowService, FilterService, ReorderService, ResizeService, SelectionService, ToolbarService, EditService],
  imports: [
    SharedModule,
    PAGESROUTES,
    FormsModule,
    ReactiveFormsModule,    
    GridAllModule,
    GridModule,
    DatePickerAllModule,
    CheckBoxModule,
    ComponentesModule,
    PagerModule,
    PipesModule,
    RichTextEditorModule,
    BrowserAnimationsModule,
    DateRangePickerModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }),
    NgbModule
  ]
})
export class PagesModule { }
