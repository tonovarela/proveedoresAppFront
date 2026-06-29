import { PipesModule } from './../pipes/pipes.module';
import { LoaderComponent } from './loader/loader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns'
import { ModalUploadComponent } from './modal-upload/modal-upload.component';
import { DetalleContraReciboComponent } from './detalle-contra-recibo/detalle-contra-recibo.component';
import { DetallePagoComponent } from './detalle-pago/detalle-pago.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TotalesComponent } from './totales/totales.component';
import { AnexoIconoComponent } from './anexo-icono/anexo-icono.component';
import { SnowEffectComponent } from './snow-effect/snow-effect.component';
import { RepseDocumentosComponent } from './repse-documentos/repse-documentos.component';
import { MensajesComponent } from './mensajes/mensajes.component';
import { DetalleSolicitudInfoComponent } from './detalle-solicitud-info/detalle-solicitud-info.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  GridAllModule, GridModule, PagerModule,
  PageService, SortService, FilterService, ResizeService, ReorderService,
  SelectionService, ToolbarService, EditService, DetailRowService
} from '@syncfusion/ej2-angular-grids';


@NgModule({
  declarations: [
    LoaderComponent,
    ModalUploadComponent,
    DetalleContraReciboComponent,
    DetallePagoComponent,
    BusquedaComponent,
   TotalesComponent,
   AnexoIconoComponent,
   SnowEffectComponent,
   RepseDocumentosComponent,
   MensajesComponent,
   DetalleSolicitudInfoComponent
  ],
  exports:[
   LoaderComponent,
   ModalUploadComponent,
   DetalleContraReciboComponent,
   DetallePagoComponent,
   BusquedaComponent,
   TotalesComponent,
   AnexoIconoComponent,
   SnowEffectComponent,
   RepseDocumentosComponent,
   MensajesComponent,
   DetalleSolicitudInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    RouterModule,
    AutoCompleteModule,
    GridAllModule,
    GridModule,
    PagerModule,
    NgbModule,
  ],
  providers: [
    PageService, SortService, FilterService, ResizeService, ReorderService,
    SelectionService, ToolbarService, EditService, DetailRowService
  ]
})
export class ComponentesModule { }
