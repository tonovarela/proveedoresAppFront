import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseSolicitudes, Solicitud } from '../models/solicitud';
import { ProveedorAsignado } from '../models/proveedorAsignado';
import { map } from 'rxjs/operators';
import { ResponseBusquedaCliente } from '../models/responseBusquedaCliente';

export interface ResponseBusquedaProveedores {
  proveedores?: ProveedorAsignado[];
}



@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  URL_SERVICE: string = environment.URL_SERVICIOS;
  solicitudSeleccionada: Solicitud | null = null;

  constructor(private _http: HttpClient) { }

  public obtenerSolicitudes() {
    return this._http.get<ResponseSolicitudes>(`${this.URL_SERVICE}/solicitud`);
  }

  
  public buscarProveedores(patron: string) {  
    return this._http.post<ResponseBusquedaCliente>(`${this.URL_SERVICE}/cliente/buscar`, { patron:patron.toLowerCase() }).pipe(
      map(response => {
        if (response.data && response.data.length > 0) {
          return { proveedores: response.data.map(p => ({ ...p ,Asignado:false})) };
        }
        return { proveedores: [] };
      }
    )
  )
  }
  
  // public buscarProveedores(nombre: string) {
  //   const termino = nombre.toLowerCase();
  //   const resultado = PROVEEDORES_MOCK.filter(p =>
  //     p.Nombre.toLowerCase().includes(termino) ||
  //     p.Proveedor.toLowerCase().includes(termino)
  //   );
  //   return of({ proveedores: resultado });
  // }

  public setSolicitudSeleccionada(solicitud: Solicitud): void {
    this.solicitudSeleccionada = solicitud;
  }

  public getSolicitudSeleccionada(): Solicitud | null {
    return this.solicitudSeleccionada;
  }
}
