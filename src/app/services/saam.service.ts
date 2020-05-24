//import { RespuestaSAAM, Orden } from './../../models/ordenesSAAM';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, take } from 'rxjs/operators';
import { RespuestaSAAM, Orden } from '../models/ordenesSAAM';

@Injectable({
  providedIn: 'root'
})
export class SaamService {

  constructor(private http: HttpClient) { }

  obtenerOrdenes() {
    return this.http.get<RespuestaSAAM>("https://sistemas.litoprocess.com/crece/api/v2/orden/historico/1,2/id_usuario/93")
      .pipe(    
      
        map<RespuestaSAAM,Orden[]>((x)=> {          
          return x.ordenes.map(o => {
            let orden: Orden= new Orden();
            orden.numero_orden = o["numero_orden"];
            orden.campania = o["nombreCampania"];
            //orden.fecha_registro=o["fecha_registro"];
            orden.nombre_proveedor = o["nombre_proveedor"];
            orden.estado = o["estado"];
            return orden;            
          });          
        })        
      )

  }
}
