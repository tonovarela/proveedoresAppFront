import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Comunicado } from '../models/comunicado';

@Injectable({
  providedIn: 'root'
})
export class OpinioncumplimientoService {

  URL =environment.URL_SERVICIOS;
  constructor(private http: HttpClient) { }


  actualizarComunicado(comunicado:Comunicado){
    return this.http.put(`${this.URL}/comunicado/opinioncumplimiento`,comunicado);
  }
  // confirmar(id_proveedor: string){
  //   return this.http.post(`${this.URL}/opinioncumplimiento/confirmar`,{ id_proveedor});
  // }
  tieneRequerimiento(id_proveedor){
    return this.http.get(`${this.URL}/usuario/opinioncumplimiento/tienerequerimiento/${id_proveedor}`);
  }
}
