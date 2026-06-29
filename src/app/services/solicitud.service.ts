import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { of } from "rxjs";
import { environment } from "src/environments/environment";
import {
  DocumentoRepse,
  EstadoDocumento,
  RequestSolicitud,
  ResponseDocumentosSolicitud,
  ResponseSolicitud,
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

  public obtener(id_solicitud: string) {
    return this._http.get<ResponseSolicitud>(`${this.URL_SERVICE}/solicitud/${id_solicitud}`);
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


  public documentos($id_solicitud: string) {
      return this._http.get<ResponseDocumentosSolicitud>(`${this.URL_SERVICE}/documentos/${$id_solicitud}`)
      .pipe(
        map((response) => {
          if (response.documentos && response.documentos.length > 0) {
            const documentos: DocumentoRepse[] = response.documentos.map((d) => ({
              id_tipo_documento: d.id_tipo_documento || '',
              descripcion: d.descripcion || '',
              ruta: d.ruta || '',
              nombre: d.nombre || '',
              tipo: d.formato || '',
              nombreArchivo: d.ruta|| '',
            
              fechaSubida: d.fecha_registro ? new Date(d.fecha_registro) : null,
              estado: d.descripcionEstado as EstadoDocumento ,              
            }));
            return { documentos };
        }
        return { documentos: [] };
      }));
  }

  public eliminarDocumento(request: { id_solicitud: string; id_tipo_documento: string ,nombre:string}) {
    //return this._http.delete(`${this.URL_SERVICE}/documentos/eliminar`, { params: new HttpParams().set('id_solicitud', request.id_solicitud).set('id_tipo_documento', request.id_tipo_documento).set('nombre', request.nombre) });
    return  this._http.post(`${this.URL_SERVICE}/documentos/eliminar`, {  ...request });
  }

  public actualizarEstadoDocumento(request: { id_solicitud: string; id_tipo_documento: string; id_estado:number; motivo?: string }) {
    return this._http.put(`${this.URL_SERVICE}/documentos/actualizar/estado`, request);
  }


  public descargarDocumento(id_solicitud: string, id_tipo_documento: string) {
    const url = `${this.URL_SERVICE}/documentos/descargar/${id_solicitud}?tipo=${id_tipo_documento}`;
    return this._http.get(url, { responseType: 'blob' });
  }
}
