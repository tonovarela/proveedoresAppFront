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

const PROVEEDORES_MOCK: ProveedorAsignado[] = [
  { Proveedor: 'PROV-001', Nombre: 'Aceros del Norte S.A. de C.V.',       RFC: 'ANO850312AB1' },
  { Proveedor: 'PROV-002', Nombre: 'Constructora Álvarez e Hijos',         RFC: 'CAH910705CD2' },
  { Proveedor: 'PROV-003', Nombre: 'Distribuidora Central de México',      RFC: 'DCM780220EF3' },
  { Proveedor: 'PROV-004', Nombre: 'Electrónica Moderna S.A.',             RFC: 'EMO920615GH4' },
  { Proveedor: 'PROV-005', Nombre: 'Ferretera Industrial del Bajío',       RFC: 'FIB881130IJ5' },
  { Proveedor: 'PROV-006', Nombre: 'Grupo Logístico Peña',                 RFC: 'GLP001010KL6' },
  { Proveedor: 'PROV-007', Nombre: 'Herramientas y Equipos Torres',        RFC: 'HET750318MN7' },
  { Proveedor: 'PROV-008', Nombre: 'Importadora Ramírez del Sur',          RFC: 'IRS930425OP8' },
  { Proveedor: 'PROV-009', Nombre: 'Ingeniería de Sistemas Aplicados',     RFC: 'ISA860912QR9' },
  { Proveedor: 'PROV-010', Nombre: 'Laboratorio Químico Norteño',          RFC: 'LQN991225ST0' },
];

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

  
  public _buscarProveedores(patron: string) {  
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
  
  public buscarProveedores(nombre: string) {
    const termino = nombre.toLowerCase();
    const resultado = PROVEEDORES_MOCK.filter(p =>
      p.Nombre.toLowerCase().includes(termino) ||
      p.Proveedor.toLowerCase().includes(termino)
    );
    return of({ proveedores: resultado });
  }

  public setSolicitudSeleccionada(solicitud: Solicitud): void {
    this.solicitudSeleccionada = solicitud;
  }

  public getSolicitudSeleccionada(): Solicitud | null {
    return this.solicitudSeleccionada;
  }
}
