import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseSolicitudes, Solicitud } from '../models/solicitud';
import { ProveedorAsignado } from '../models/proveedorAsignado';

export interface ResponseBusquedaProveedores {
  proveedores?: ProveedorAsignado[];
}

const PROVEEDORES_MOCK: ProveedorAsignado[] = [
  { proveedor: 'PROV-001', nombre: 'Aceros del Norte S.A. de C.V.',       rfc: 'ANO850312AB1' },
  { proveedor: 'PROV-002', nombre: 'Constructora Álvarez e Hijos',         rfc: 'CAH910705CD2' },
  { proveedor: 'PROV-003', nombre: 'Distribuidora Central de México',      rfc: 'DCM780220EF3' },
  { proveedor: 'PROV-004', nombre: 'Electrónica Moderna S.A.',             rfc: 'EMO920615GH4' },
  { proveedor: 'PROV-005', nombre: 'Ferretera Industrial del Bajío',       rfc: 'FIB881130IJ5' },
  { proveedor: 'PROV-006', nombre: 'Grupo Logístico Peña',                 rfc: 'GLP001010KL6' },
  { proveedor: 'PROV-007', nombre: 'Herramientas y Equipos Torres',        rfc: 'HET750318MN7' },
  { proveedor: 'PROV-008', nombre: 'Importadora Ramírez del Sur',          rfc: 'IRS930425OP8' },
  { proveedor: 'PROV-009', nombre: 'Ingeniería de Sistemas Aplicados',     rfc: 'ISA860912QR9' },
  { proveedor: 'PROV-010', nombre: 'Laboratorio Químico Norteño',          rfc: 'LQN991225ST0' },
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

  public buscarProveedores(nombre: string) {
    const termino = nombre.toLowerCase();
    const resultado = PROVEEDORES_MOCK.filter(p =>
      p.nombre.toLowerCase().includes(termino) ||
      p.proveedor.toLowerCase().includes(termino)
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
