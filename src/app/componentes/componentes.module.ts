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


@NgModule({
  declarations: [
    LoaderComponent,
    ModalUploadComponent,
    DetalleContraReciboComponent,
    DetallePagoComponent,
    BusquedaComponent,
    TotalesComponent
  ],
  exports:[
   LoaderComponent,
   ModalUploadComponent,
   DetalleContraReciboComponent,
   DetallePagoComponent,
   BusquedaComponent,
   TotalesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AutoCompleteModule
  ]
})
export class ComponentesModule { }
