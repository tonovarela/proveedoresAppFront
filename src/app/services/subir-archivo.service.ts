
import { UsuarioService } from './usuario.service';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Movimiento } from '../models/movimiento';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {
  public notificacion = new EventEmitter<Movimiento>();
  URL_SERVICE: string = 'http://localhost:44382';
  validarEstructura: boolean =false;
  constructor(private _http: HttpClient,
    private _usuarioService: UsuarioService) { }

  revisarArchivo(archivo: File, tipo: string, movimiento: Movimiento) {
    const url = `${this.URL_SERVICE}/api/factura/revisar${tipo}?validar=${this.validarEstructura}`;
    const formData = new FormData();
    formData.append('archivo', archivo, archivo.name);
    formData.append('monto', movimiento.saldo.toString());
    formData.append('rfc', this._usuarioService.usuario.RFC);
    formData.append('condicionesPago',this._usuarioService.usuario.Condicion);
    formData.append('metodoPago',this._usuarioService.usuario.MetodoPago);
    formData.append('formaPago',this._usuarioService.usuario.FormaPago);
    formData.append('idMovimiento', movimiento.movimientoID.toString());

    return this._http.post(url, formData, { reportProgress: true }).pipe(
      map(resp => {        
         if (resp['esIgual']) {                
           if (tipo=="xml"){
             movimiento.tieneXML=true;
           }else{
             movimiento.tienePDF=true;
           }
           this.notificacion.emit(movimiento);
         }
        return resp;
      }),

    );
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
