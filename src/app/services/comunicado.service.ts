

import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Comunicado } from '../models/comunicado';
import { map } from 'rxjs/operators';
import { ProveedorAsignado } from '../models/proveedorAsignado';

@Injectable({
  providedIn: 'root'
})
export class ComunicadoService {
  public verificarNotificacion = new EventEmitter<boolean>();
  URL = environment.URL_VALIDADORFILE;
//"http://192.168.2.217/proveedor";

  URLRegistro =environment.URL_SERVICIOS;
  
  comunicados: Comunicado[] = [];
  asignacion: Comunicado = {};
  
  constructor(private http: HttpClient) { }

  agregar(comunicado: Comunicado) {

    //Se cambio a Laravel ya que la 217 tenia una politica de POST Max size
    return this.http.post(`${this.URLRegistro}/comunicado`, comunicado);
    //return this.http.post(`${this.URL}/api/comunicado`, comunicado);
  }


  borrar(comunicado: Comunicado) {

    return this.http.get(`${this.URL}/api/comunicado/borrar/${comunicado.id_comunicado}`).pipe(
      map(x => {
        return x["comunicados"];
      })
    );
    //this.comunicados=this.comunicados.filter(x=>x.id_comunicado!==comunicado.id_comunicado);
  }

  actualizar(comunicado: Comunicado) {
    return this.http.put(`${this.URLRegistro}/comunicado`, comunicado).pipe(
      map(x => {
        return x["comunicado"];
      })
    );

  }

   porProveedor(proveedor:string){
    return this.http.get(`${this.URL}/api/comunicado/proveedor/${proveedor}`).pipe(
      map(x=>x["comunicados"])
    );
   }

  marcarVistos(proveedor: string) {
    return this.http.get(`${this.URL}/api/comunicado/comunicadosvistos/${proveedor}`);
  }

  obtenerPendientesPorLeer(proveedor: string) {
    return this.http.get(`${this.URL}/api/comunicado/porleer/${proveedor}`);
  }


  cambiarDisponibilidadProveedor(proveedorAsignado: ProveedorAsignado, idComunicado: string) {
    return this.http.post(`${this.URL}/api/comunicado/${idComunicado}/cambiarDisponibilidadProveedor`, {
      Proveedor: proveedorAsignado.proveedor.trim(),
      Nombre: proveedorAsignado.nombre,
      RFC: proveedorAsignado.rfc,
      asignado: proveedorAsignado.asignado == false ? 0 : 1
    });
  }

  obtenerDisponibilidadProveedor(idComunicado) {
    return this.http.get<ProveedorAsignado[]>(`${this.URL}/api/comunicado/disponibilidad/${idComunicado}`).pipe(
      map(x => {
        const proveedores = x["proveedores"];

        return proveedores.map(proveedor => {
          proveedor.proveedor = proveedor.proveedor.trim()
          proveedor.asignado = proveedor.asignado == "1" ? true : false;
          return proveedor;
        });
      })
    );
  }


  listar() {
    return this.http.get(`${this.URLRegistro}/comunicado`).pipe(
      map(x => {
        this.comunicados = x["comunicados"];
        return this.comunicados;
      })
    );
  }

  detalle(id) {

    return this.http.get(`${this.URL}/api/comunicado/${id}`).pipe(
      map(x => {
        return x["comunicados"];
      })
    );
  }

  

  cambiarDisponibilidad(comunicado: Comunicado) {
    return this.http.get(`${this.URL}/api/comunicado/general/${comunicado.id_comunicado}?valor=${comunicado.general}`).pipe(
      map(x => {
        return x["comunicado"];
      })
    );

  }

  cambiarVisible(comunicado: Comunicado) {
    return this.http.get(`${this.URL}/api/comunicado/visible/${comunicado.id_comunicado}?valor=${comunicado.visible}`).pipe(
      map(x => {
        return x["comunicado"];
      })
    );

  }

}
