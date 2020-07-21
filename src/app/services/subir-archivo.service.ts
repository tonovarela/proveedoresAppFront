import { PagoAprobado } from './../models/movimiento';

import { UsuarioService } from './usuario.service';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Movimiento } from '../models/movimiento';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';



@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {
  public notificacion = new EventEmitter<Movimiento>();

  
  URL_SERVICE: string =environment.URL_VALIDADORFILE;    
  //"http://localhost:44382"  
  validarEstructura: boolean =true;
  constructor(private _http: HttpClient,
    private _usuarioService: UsuarioService) { }




  public revisarArchivo(archivo: File, tipoArchivo: string, movimiento: PagoAprobado | Movimiento) {

    if (movimiento.tipo == "Factura-Ingreso") {
      return this.revisarPendientesCobro(movimiento, tipoArchivo, archivo);
    }

    if (movimiento.tipo == "Pago") {
      return this.revisarPagosAprobados(movimiento, tipoArchivo, archivo);
    }
  }




  private revisarPendientesCobro(movimiento: Movimiento, tipoArchivo: string, archivo: File): Observable<any> {
    const url = `${this.URL_SERVICE}/api/pendientescobro/revisar${tipoArchivo}?validar=${this.validarEstructura}`;    
    const formData = new FormData();
    formData.append('archivo', archivo, archivo.name);
    formData.append('monto', movimiento.importe.toString());
    formData.append('rfc', this._usuarioService.usuario.RFC);
    formData.append('condicionesPago', "------");
    formData.append('metodoPago', movimiento.metodopago);
    formData.append('metodoPagoDesc', movimiento.metodoPagoDesc);
    formData.append('formaPago', movimiento.formaPago);
    formData.append('formaPagoDesc', movimiento.formaPagoDesc);
    formData.append('usoCFDI', movimiento.usoCFDI);
    formData.append('usoCFDIDesc', movimiento.usoCDFIDesc);
    formData.append('factura', movimiento.referencia);
    formData.append('folio', movimiento.folio.toString());
    formData.append('idMovimiento', movimiento.movimientoID.toString());
    formData.append('movimiento', `${movimiento.movimientoDescripcion}-${movimiento.folio}`.trim());
    formData.append('proveedor', `${this._usuarioService.usuario.Proveedor.trim()}`);
    formData.append('tipo', `${movimiento.tipo}`);
    formData.append('moneda', `${movimiento.moneda}`);

    return this._http.post(url, formData, { reportProgress: true })
      .pipe(
        map(resp => {
          if (resp['esIgual']) {
            if (tipoArchivo == "xml") {
              movimiento.tieneXML = true;
            } else {
              movimiento.tienePDF = true;
            }
            this.notificacion.emit(movimiento);
          }
          return resp;
        })
      );

  }


  private revisarPagosAprobados(movimiento: Movimiento, tipoArchivo: string, archivo: File): Observable<any> {
    const url = `${this.URL_SERVICE}/api/pagosaprobados/revisar${tipoArchivo}?validar=${this.validarEstructura}`;
    const formData = new FormData();
    formData.append('archivo', archivo, archivo.name);
    formData.append('monto', movimiento.importe.toString());
    formData.append('rfc', this._usuarioService.usuario.RFC);    
    formData.append('movimiento', `${movimiento.movimientoDescripcion}-${movimiento.folio}`.trim());
    formData.append('factura', '');
    formData.append('folio', `${movimiento.folio}`.trim());    
    formData.append('idMovimiento', movimiento.movimientoID.toString());
    formData.append('proveedor', `${this._usuarioService.usuario.Proveedor.trim()}`);
    formData.append('tipo', `${movimiento.tipo}`);
    formData.append('moneda', `${movimiento.moneda}`);

    return this._http.post(url, formData, { reportProgress: true })
      .pipe(
        map(resp => {
          if (resp['esIgual']) {
            if (tipoArchivo == "xml") {
              movimiento.tieneXML = true;
            } else {
              movimiento.tienePDF = true;
            }
            this.notificacion.emit(movimiento);
          }
          return resp;
        })
      );
    
  }


  anexarMovimientoIntelisis(pathArchivo, id, rama) {

// let fakeResponse = {
//       ok: true,
//       esIgual: false,
//       errores: ["Varela 1", "Varela 2", "Varela 3"],
//       mensaje: `Esta es una respuesta fake del documento , Pendiente por definir la validación`
//     };
//     return Observable.of(fakeResponse).delay(500);    
    return this._http.post(`${environment.URL_SERVICIOS}/facturas/registro/documento`,
      { path: `${pathArchivo}`, id,rama });
  }

  //Revisa validez ante el SAT
  validarXML(archivo: File) {
    const url = `${this.URL_SERVICE}/api/factura/validar`;
    const formData = new FormData();
    formData.append('archivo', archivo, archivo.name);
    return this._http.post(url, formData, { reportProgress: true });
  }
}
