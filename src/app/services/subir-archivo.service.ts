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

  //URL_SERVICE: string = 'http://192.168.5.28/proveedores';
  URL_SERVICE: string = 'http://localhost:44382/';
  //#436784
  validarEstructura: boolean = false;
  constructor(private _http: HttpClient,
    private _usuarioService: UsuarioService) { }

  revisarArchivo(archivo: File, tipo: string, movimiento: PagoAprobado | Movimiento) {
    const url = `${this.URL_SERVICE}/api/factura/revisar${tipo}?validar=${this.validarEstructura}`;
    const formData = new FormData();
    formData.append('archivo', archivo, archivo.name);
    formData.append('monto', movimiento.importe.toString());
    formData.append('rfc', this._usuarioService.usuario.RFC);
    formData.append('condicionesPago', "------");
    formData.append('metodoPago', movimiento.metodopago);
    formData.append('formaPago', movimiento.formaPago);
    formData.append('usoCFDI', movimiento.usoCFDI);
    formData.append('idMovimiento', movimiento.movimientoID.toString());
    formData.append('movimiento', `${movimiento.movimientoDescripcion}-${movimiento.folio}`.trim());
    formData.append('proveedor', `${this._usuarioService.usuario.Proveedor.trim()}`);
    formData.append('tipo', `${movimiento.tipo}`);
    formData.append('moneda', `${movimiento.moneda}`);
    

    if (movimiento.tipo == "Pago") {
      let fakeResponse = {
        ok: true,
        esIgual: false,
        errores: ["Varela 1", "Varela 2", "Varela 3"],
        mensaje: `Esta es una respuesta fake del documento ${tipo}, Pendiente por definir la validación`
      };          
      return Observable.of(fakeResponse).delay(2000);
    }
    return this._http.post(url, formData, { reportProgress: true }).pipe(
      map(resp => {
        if (resp['esIgual']) {
          if (tipo == "xml") {
            movimiento.tieneXML = true;
          } else {
            movimiento.tienePDF = true;
          }
          this.notificacion.emit(movimiento);
        }
        return resp;
      }),

    );
  }




  anexarMovimientoIntelisis(pathArchivo, id) {
    return this._http.post(`${environment.URL_SERVICIOS}/facturas/registro/documento`,
      { path: `${pathArchivo}`, id });
  }

  //Revisa validez ante el SAT
  validarXML(archivo: File) {
    const url = `${this.URL_SERVICE}/api/factura/validar`;
    console.log(url);
    const formData = new FormData();
    formData.append('archivo', archivo, archivo.name);
    return this._http.post(url, formData, { reportProgress: true });
  }
}
