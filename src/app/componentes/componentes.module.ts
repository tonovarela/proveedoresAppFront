import { LoaderComponent } from './loader/loader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalUploadComponent } from './modal-upload/modal-upload.component';
import { DetalleContraReciboComponent } from './detalle-contra-recibo/detalle-contra-recibo.component';
import { DetallePagoComponent } from './detalle-pago/detalle-pago.component';



@NgModule({
  declarations: [
    LoaderComponent,
    ModalUploadComponent,
    DetalleContraReciboComponent,
    DetallePagoComponent
  ],
  exports:[
   LoaderComponent,
   ModalUploadComponent,
   DetalleContraReciboComponent,
   DetallePagoComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentesModule { }
