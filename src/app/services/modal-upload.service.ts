import { Movimiento } from './../models/movimiento';
import { Injectable, EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {
  public tipoArchivo: string;  
  public movimiento: Movimiento;

  public oculto: string = 'oculto';

  constructor() { }


  ocultarModal() {
    this.oculto = 'oculto';    
    this.tipoArchivo = null;
    this.movimiento=null;

  }

  mostrarModal(tipoArchivo: string, movimiento: Movimiento) {
    this.oculto = '';
    this.movimiento=movimiento;
    this.tipoArchivo = tipoArchivo;      
  }

  

}
