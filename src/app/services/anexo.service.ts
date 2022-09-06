import { RespuestaAnexo, Movimiento, Anexo } from './../models/movimiento';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, mergeMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { UiService } from './ui.service';
import { ResponseAnexo } from '../models/responseAnexo';

@Injectable({
  providedIn: 'root'
})
export class AnexoService {

  URL_SERVICE: string =environment.URL_VALIDADORFILE;
    //"http://localhost:44382";

  beta: boolean = environment.BETA;

  movimientoActual: Movimiento;
  constructor(
    private _http: HttpClient,
    private _uiService: UiService
  ) { }




 listar(){
   return this._http.get<ResponseAnexo>(`${environment.URL_SERVICIOS}/anexo`);
 }

  ListarPorID(movimiento: Movimiento) {
    const url = `${this.URL_SERVICE}`;
    return this._http.get<RespuestaAnexo>(`${url}/api/anexo/movimiento/${movimiento.movimientoID}?tipo=${movimiento.tipo}`)
  }

  eliminarAnexo(idAnexo: string) {
    const url = `${this.URL_SERVICE}`;
    //Me rendi en configurar el verbo DELETE en el backend de .net
    return this._http.post(`${url}/api/anexo/borrar/${idAnexo}?beta=${this.beta}`, {}).pipe(
      catchError(x => {
        return of({ ok: false, mensaje: x["error"]["message"] });
      }),
      mergeMap((data) => {
        if (data["ok"] == false) {
          this._uiService.mostrarAlertaError("Error  en el borrado de archivo", data["mensaje"]);
        }
        return of(data);
      })
    );



  }


  borrarEvidenciaIntelisis(anexo: Anexo) {
    const URL_SERVICIOS = environment.URL_SERVICIOS
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),

      body: {
        nombre: anexo.nombre
      }
    }
    return this._http.delete(`${URL_SERVICIOS}/facturas/evidencia`, options);
  }


}
