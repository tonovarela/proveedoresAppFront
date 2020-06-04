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


  constructor(private _http: HttpClient) {
  }
  obtenerPendientesCobro(proveedor) {
    return this._http.get<Movimiento[]>(`${this.URL_SERVICIOS}/facturas/pendientescobro/${proveedor}`)
      .pipe(
        map(resp => resp["data"]),
        map(data => data.map(m => {
          let mov: Movimiento = {
            movimientoID: m["ID"],
            folio: m["Folio"],
            movimientoDescripcion: m["Movimiento"],
            referencia: m["Referencia"],
            saldo: Number(m["Saldo"]),
            importe: Number(m["Importe"]) ,
            fechaEmision: moment(m["FechaEmision"]).toDate(),
            fechaVencimiento: moment(m["Vencimiento"]).toDate(),
            moneda: m["Moneda"].trim(),
            usoCFDI:m["UsoCFDI"],
            metodopago:m["MetodoPago"],
            formaPago:m["FormaPago"],
            solicitaContraRecibo: false,
            tienePDF: m["PDF"] == "1" ? true : false,
            tieneXML: m["XML"] == "1" ? true : false,
            tipo :"Factura-Ingreso"
          };
          return mov;
        })),
        map(movimientos => movimientos.sort((a: Movimiento, b:Movimiento) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime()))
      );
  }

  

  obtenerContraRecibosPendientes(proveedor) {
    return this._http
      .get<Contrarecibo[]>(`${this.URL_SERVICIOS}/facturas/contrarecibospendientes/${proveedor}`)
      .pipe(
        map(resp => resp["data"]),
        map(data => data.map(m => {
          let mov: Contrarecibo = {
            movimientoID: m["ID"],
            folio: m["Folio"],
            movimientoDescripcion: m["Movimiento"],
            referencia: m["Referencia"],
            saldo: Number(m["Saldo"]), 
            importe:Number(m["Importe"]), 
            fechaEmision: moment(m["FechaEmision"]).toDate(),
            fechaVencimiento: moment(m["Vencimiento"]).toDate(),
            moneda: m["Moneda"],
            //detalle:this.obtenerMovimientosFicticios('Pesos',5)            
          };
          return mov;
        })
        ),
        map(contrarecibos => contrarecibos.sort((a: Contrarecibo, b:Contrarecibo) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime()))
      );
  }


  obtenerPagosAprobados(proveedor){
    return this._http.get<Movimiento[]>(`${this.URL_SERVICIOS}/facturas/pagosaprobados/${proveedor}`)
      .pipe(
        map(resp => resp["data"]),
        map(data => data.map(m => {
          let mov: Movimiento = {
            movimientoID: m["ID"],
            folio: m["Folio"],
            movimientoDescripcion: m["Movimiento"],
            referencia: m["Referencia"],
            saldo: Number(m["Saldo"]),
            importe: Number(m["Importe"]) ,
            fechaEmision: moment(m["FechaEmision"]).toDate(),
            fechaVencimiento: moment(m["Vencimiento"]).toDate(),
            moneda: m["Moneda"].trim(),
            //solicitaContraRecibo: false,
            //tienePDF: m["PDF"] == "1" ? true : false,
            //tieneXML: m["XML"] == "1" ? true : false,
            tipo :"Pago"
          };
          return mov;
        })),
        map(movimientos => movimientos.sort((a: Movimiento, b:Movimiento) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime()))
      );
    
  }


  obtenerMovimientosFicticios(moneda, total) {
    let movimientos = [];
    for (let i = moneda == "Pesos" ? total : 0; i < (moneda == "Pesos" ? total : 0) + total; i++) {
      movimientos.push({
        folio: (i + 1),
        solicitaContraRecibo: false,
        movimientoID: (i + 1),
        movimientoDescripcion: "Movimiento Ficticio ",
        referencia: "59897" + (i + 1),
        moneda: moneda,
        saldo: Math.random() * (10000 - 50 + 1) + 50,
        importe:Math.random() * (10000 - 50 + 1) + 50,
        tienePDF: true,
        tieneXML: true,
        fechaEmision: moment('2020-01-05').toDate(),
        fechaVencimiento: moment('2020-01-05').toDate()
      });
    }
    return movimientos;
  }

  obtenerDetalleContraRecibo(id) {
    return this._http
      .get<Movimiento[]>(`${this.URL_SERVICIOS}/facturas/detallecontrarecibo/${id}`)
      .pipe(
        map(resp => resp["data"]),
        map(data => data
          .filter(m =>m["Referencia"]!=null)
          .map(m => {
            let mov: Movimiento = {            
              referencia: m["Referencia"],
              importe: Number(m["ImporteTotal"]),              
              fechaEmision: moment(m["FechaEmision"]).toDate(),              
            };
            return mov;
          }))
      );

  }

}
