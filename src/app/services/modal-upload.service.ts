import { Movimiento } from './../models/movimiento';
import { Injectable, EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {
  public tipoArchivo: string;
  public movimiento: Movimiento;
  public esRepse: boolean = false;
  public repseInfo: { id_solicitud: string, id_tipo_documento: string } = null;

  public oculto: string = 'oculto';

  constructor() { }


  ocultarModal() {
    this.oculto = 'oculto';
    this.tipoArchivo = null;
    this.movimiento=null;
    this.esRepse = false;
    this.repseInfo = null;
  }

  mostrarModal(tipoArchivo: string, movimiento: Movimiento ) {
    this.oculto = '';
    this.movimiento=movimiento;
    this.tipoArchivo = tipoArchivo;
    this.esRepse = false;
    this.repseInfo = null;
  }

  mostrarModalRepse(tipoArchivo: string, {id_solicitud, id_tipo_documento}: {id_solicitud: string, id_tipo_documento: string} ) {
    this.oculto = '';
    this.movimiento=null;
    this.tipoArchivo = tipoArchivo;
    this.esRepse = true;
    this.repseInfo = { id_solicitud, id_tipo_documento };
  }

  

}
