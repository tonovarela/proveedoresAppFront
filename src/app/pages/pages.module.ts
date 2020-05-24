import { PipesModule } from './../pipes/pipes.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';    
import { ToastrModule } from 'ngx-toastr';  

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentesModule } from './../componentes/componentes.module';
import { SharedModule } from './../shared/shared.module';
import { PagesComponent } from './pages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PAGESROUTES } from './app.routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendientesCobroComponent } from './pendientes-cobro/pendientes-cobro.component';
import { ContraRecibosComponent } from './contra-recibos/contra-recibos.component';
import { PagosAprobadosComponent } from './pagos-aprobados/pagos-aprobados.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PerfilComponent } from './perfil/perfil.component';
import { GridModule, PagerModule,DetailRowService, PageService, SortService, FilterService, ReorderService,ResizeService,SelectionService, ToolbarService,EditService } from '@syncfusion/ej2-angular-grids';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';



@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    PendientesCobroComponent,
    ContraRecibosComponent,
    PagosAprobadosComponent,
    AccountSettingsComponent,
    PerfilComponent
  ],
  providers: [ PageService,SortService,DetailRowService, FilterService,ReorderService,ResizeService,SelectionService,ToolbarService,EditService],
  imports: [  
    SharedModule,  
    PAGESROUTES,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    GridModule,
    CheckBoxModule,
    ComponentesModule,
     PagerModule,
     PipesModule,
     BrowserAnimationsModule,          
     ToastrModule.forRoot(),
     NgbModule
  ]
})
export class PagesModule { }
