import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { of } from "rxjs";
import { environment } from "src/environments/environment";
import {
  RequestSolicitud,
  ResponseSolicitudes,
  Solicitud,
} from "../models/solicitud";
import { map } from "rxjs/operators";
import { ResponseBusquedaCliente } from "../models/responseBusquedaCliente";

@Injectable({
  providedIn: "root",
})
export class SolicitudService {
  URL_SERVICE: string = environment.URL_SERVICIOS;
  solicitudSeleccionada: Solicitud | null = null;

  constructor(private _http: HttpClient) {}

  public obtenerSolicitudes() {
    return this._http.get<ResponseSolicitudes>(`${this.URL_SERVICE}/solicitud`);
  }

  public buscarProveedores(patron: string) {
    return this._http
      .post<ResponseBusquedaCliente>(`${this.URL_SERVICE}/cliente/buscar`, {
        patron: patron.toLowerCase(),
      })
      .pipe(
        map((response) => {
          if (response.data && response.data.length > 0) {
            return {
              proveedores: response.data.map((p) => ({
                ...p,
                Asignado: false,
              })),
            };
          }
          return { proveedores: [] };
        }),
      );
  }

  public registrar(requestSolicitud: RequestSolicitud) {
    return this._http.post(`${this.URL_SERVICE}/solicitud`, requestSolicitud);
  }

  public setSolicitudSeleccionada(solicitud: Solicitud): void {
    this.solicitudSeleccionada = solicitud;
  }

  public getSolicitudSeleccionada(): Solicitud | null {
    return this.solicitudSeleccionada;
  }

  public actualizarEstado(request: { id_solicitud: string; id_estado: number; estado_previo: number }) {
    return this._http.put(`${this.URL_SERVICE}/solicitud/actualizar/estado`, request);
  }
}
