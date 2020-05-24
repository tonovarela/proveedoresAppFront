import { LoaderComponent } from './loader/loader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalUploadComponent } from './modal-upload/modal-upload.component';
import { DetalleContraReciboComponent } from './detalle-contra-recibo/detalle-contra-recibo.component';



@NgModule({
  declarations: [
    LoaderComponent,
    ModalUploadComponent,
    DetalleContraReciboComponent
  ],
  exports:[
   LoaderComponent,
   ModalUploadComponent,
   DetalleContraReciboComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentesModule { }
