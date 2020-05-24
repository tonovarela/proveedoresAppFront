import { Movimiento, Contrarecibo } from './../models/movimiento';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, filter } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  URL_SERVICIOS: string = environment.URL_SERVICIOS;
  constructor(private _http: HttpClient) { }

  obtenerPendientesCobro(proveedor) {
    return this._http.get<Movimiento[]>(`${this.URL_SERVICIOS}/facturas/pendientescobro/${proveedor}`)
      .pipe(
        map(resp => resp["data"]),
        map(data => data.map(m => {
          let mov: Movimiento = {
            movimientoID:m["ID"],
            folio: m["Folio"],
            movimientoDescripcion:m["Movimiento"],          
            referencia:m["Referencia"],
            saldo: Number(m["Saldo"]),
            fechaEmision:moment(m["FechaEmision"]).toDate(),
            fechaVencimiento:moment(m["Vencimiento"]).toDate(),
            moneda: m["Moneda"].trim(),            
            solicitaContraRecibo:false,            
          };          
          return mov; 
        }))
      );
  }
  obtenerContraRecibosPendientes(proveedor) {
    return this._http.get<Contrarecibo[]>(`${this.URL_SERVICIOS}/facturas/contrarecibospendientes/${proveedor}`)
      .pipe(
        map(resp => resp["data"]),
        map(data => data.map(m => {
          let mov: Contrarecibo = {
            movimientoID:m["ID"],
            folio: m["Folio"],
            movimientoDescripcion:m["Movimiento"],          
            referencia:m["Referencia"],
            saldo: Number(m["Saldo"]),
            fechaEmision:moment(m["FechaEmision"]).toDate(),
            fechaVencimiento:moment(m["Vencimiento"]).toDate(),
            moneda: m["Moneda"],      
            detalle:this.obtenerMovimientosFicticios('Pesos',5)            
          };          
          return mov; 
        }))
      );
  }

  obtenerMovimientosFicticios(moneda, total) {
    let movimientos =[];
    for (let i = moneda == "Pesos" ? total : 0; i < (moneda == "Pesos" ? total : 0) + total; i++) {
      movimientos.push({
        folio: (i + 1),
        solicitaContraRecibo: false,
        movimientoID: (i + 1),
        movimientoDescripcion: "Movimiento Ficticio ",
        referencia: "59897"+(i + 1),
        moneda: moneda,
        saldo: Math.random() * (10000 - 50 + 1) + 50,
        tienePDF: true,
        tieneXML: true,
        fechaEmision: moment('2020-01-05').toDate(),
        fechaVencimiento: moment('2020-01-05').toDate()
      });
    }
    return movimientos;
  }

}
