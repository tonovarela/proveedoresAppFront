import { RespuestaAnexo, Movimiento, Anexo } from './../models/movimiento';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AnexoIconoComponent } from '../componentes/anexo-icono/anexo-icono.component';

@Injectable({
  providedIn: 'root'
})
export class AnexoService {

  URL_SERVICE: string = environment.URL_VALIDADORFILE;

  //"http://localhost:44382" ;

  movimientoActual: Movimiento;
  constructor(private _http: HttpClient) { }





  ListarPorID(movimiento: Movimiento) {
    const url = `${this.URL_SERVICE}`;
    return this._http.get<RespuestaAnexo>(`${url}/api/anexo/movimiento/${movimiento.movimientoID}?tipo=${movimiento.tipo}`)
  }

  eliminarAnexo(idAnexo: string) {
    const url = `${this.URL_SERVICE}`;
    //Me rendi en configurar el verbo DELETE en el backend
    return this._http.post(`${url}/api/anexo/borrar/${idAnexo}`, {});
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
