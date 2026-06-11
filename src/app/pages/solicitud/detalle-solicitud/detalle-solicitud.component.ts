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
  solicitud: Solicitud | null = null;
  movimientos: any[] = [];
  totalNotas: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private solicitudService: SolicitudService
  ) { }

  ngOnInit(): void {
    this.cargarDetalle();
  }

  cargarDetalle(): void {
    const solicitudHistory = history.state?.solicitud;
    const solicitudDelServicio = this.solicitudService.getSolicitudSeleccionada();
    if (solicitudDelServicio ==null){
      this.router.navigate(['/solicitud-repse']);
      console.warn('No hay solicitud seleccionada en el servicio.');
    }
    console.log('Solicitud desde history.state:', solicitudDelServicio);
    const solicitud = solicitudHistory || solicitudDelServicio;
    
    if (solicitud) {
      this.solicitud = solicitud;
      this.totalNotas = this.solicitud?.totalNotas || 0;
      this.cargarMovimientos();
    } else {
      const solicitudId = this.route.snapshot.paramMap.get('id');
      if (solicitudId) {
        console.warn('Solicitud no encontrada. ID:', solicitudId);
      }
    }
  }

  cargarMovimientos(): void {
    // TODO: Implementar obtención de movimientos del servicio
    this.movimientos = [];
  }

  volverAtras(): void {
    this.router.navigate(['/solicitud-repse']);
  }

  editarSolicitud(): void {
    // TODO: Implementar edición de solicitud
    console.log('Editar solicitud:', this.solicitud);
  }

  eliminarSolicitud(): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) {
      // TODO: Implementar eliminación
      console.log('Eliminar solicitud:', this.solicitud?.id_solicitud);
    }
  }

  descargarPDF(): void {
    // TODO: Implementar descarga de PDF
    console.log('Descargar PDF de solicitud:', this.solicitud?.id_solicitud);
  }

  getEstadoClass(): string {
    switch (this.solicitud?.id_estado) {
      case 1:
        return 'success';
      case 2:
        return 'warning';
      case 3:
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
