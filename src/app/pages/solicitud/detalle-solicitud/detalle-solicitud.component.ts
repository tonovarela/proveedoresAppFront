import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Solicitud } from '../../../models/solicitud';
import { SolicitudService } from '../../../services/solicitud.service';


@Component({
  selector: 'app-detalle-solicitud',
  templateUrl: './detalle-solicitud.component.html',
  styleUrls: ['./detalle-solicitud.component.css']
})
export class DetalleSolicitudComponent implements OnInit {

  panelColapsado: boolean = true;
  solicitud: Solicitud | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private solicitudService: SolicitudService
  ) { }

  ngOnInit(): void {
    this.cargarSolicitud();
  }

  private async obtenerSolicitud(id_solicitud: string): Promise<void> {
    const response = await this.solicitudService.obtener(id_solicitud).toPromise();
    this.solicitud = response.solicitud;
  }

  async cargarSolicitud(): Promise<void> {
    const solicitudHistory = history.state?.solicitud;
    const solicitudDelServicio = this.solicitudService.getSolicitudSeleccionada();
    if (solicitudDelServicio == null) {
      this.router.navigate(['/solicitud-repse']);
      console.warn('No hay solicitud seleccionada en el servicio.');
    }

    const solicitud = solicitudHistory || solicitudDelServicio;

    if (solicitud) {
      await this.obtenerSolicitud(solicitud.id_solicitud!);
    } else {
      const solicitudId = this.route.snapshot.paramMap.get('id');
      if (solicitudId) {
        console.warn('Solicitud no encontrada. ID:', solicitudId);
      }
    }
  }

  /** El detalle informó que la solicitud pudo cambiar: refrescamos el encabezado. */
  async refrescarSolicitud(): Promise<void> {
    if (this.solicitud?.id_solicitud) {
      await this.obtenerSolicitud(this.solicitud.id_solicitud);
    }
  }

  volverAtras(): void {
    this.router.navigate(['/solicitud-repse']);
  }

  togglePanel(): void {
    this.panelColapsado = !this.panelColapsado;
  }

  getEstadoClass(): string {
    const estado = (this.solicitud?.estado ?? '').toLowerCase();

    switch (estado) {
      case 'aceptado':
        return 'aprobado';
      case 'rechazado':
        return 'rechazado';
      case 'requerimiento':
      case 'en revision':
        return 'pendiente';
      default:
        return 'default';
    }
  }
}
