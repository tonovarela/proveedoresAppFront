
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
  
  //URL_SERVICE: string = 'http://192.168.5.28/proveedores';
  URL_SERVICE: string = 'http://localhost:44382/';  
  //#436784
  validarEstructura: boolean =true;
  constructor(private _http: HttpClient,
    private _usuarioService: UsuarioService) { }

  revisarArchivo(archivo: File, tipo: string, movimiento: Movimiento) {
    const url = `${this.URL_SERVICE}/api/factura/revisar${tipo}?validar=${this.validarEstructura}`;
    const formData = new FormData();
    formData.append('archivo', archivo, archivo.name);
    formData.append('monto', movimiento.importe.toString());
    formData.append('rfc', this._usuarioService.usuario.RFC);
    formData.append('condicionesPago',"------");
    formData.append('metodoPago',movimiento.metodopago);
    formData.append('formaPago',movimiento.formaPago);
    formData.append('usoCFDI',movimiento.usoCFDI);
    formData.append('idMovimiento', movimiento.movimientoID.toString());
    formData.append('movimiento', `${movimiento.movimientoDescripcion}-${movimiento.folio}`.trim());
    formData.append('proveedor', `${this._usuarioService.usuario.Proveedor.trim()}`);
    formData.append('tipo', `${movimiento.tipo}`);
    formData.append('moneda', `${movimiento.moneda}`);
    

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

  anexarMovimientoIntelisis(nombreArchivo,id){
   return this._http.post(`${environment.URL_SERVICIOS}`,
                            {path:`\\192.168.2.217\${nombreArchivo}`,id});    
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
