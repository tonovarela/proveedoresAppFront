
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';    
import { ToastrModule } from 'ngx-toastr';  
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './../shared/shared.module';




import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { GridModule, PagerModule,DetailRowService, PageService, SortService, FilterService, ReorderService,ResizeService,SelectionService, ToolbarService,EditService } from '@syncfusion/ej2-angular-grids';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';
//import { AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns';

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
import { BrowserModule } from '@angular/platform-browser';
import { PagosProgramadosComponent } from './pagos-programados/pagos-programados.component';
import { ComunicadosComponent } from './comunicados/comunicados.component';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { DetalleComponent } from './comunicados/detalle/detalle.component';
import { CommonModule } from '@angular/common';

import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { DisponibilidadComponent } from './comunicados/disponibilidad/disponibilidad.component';
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
    DisponibilidadComponent
  ],
  providers: [ 
    //{provide:LOCALE_ID,useValue:"es-MX"},
  PageService,SortService,DetailRowService, FilterService,ReorderService,ResizeService,SelectionService,ToolbarService,EditService],
  imports: [  
    SharedModule,  
    PAGESROUTES,
    FormsModule,
    ReactiveFormsModule,
    //BrowserModule,
    //CommonModule,
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
       preventDuplicates:true
     }),
     NgbModule
  ]
})
export class PagesModule { }
