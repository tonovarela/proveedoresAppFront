import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Solicitud } from '../../../models/solicitud';
import { Mensaje } from '../../../models';
import { SolicitudService } from '../../../services/solicitud.service';

@Component({
  selector: 'app-detalle-solicitud',
  templateUrl: './detalle-solicitud.component.html',
  styleUrls: ['./detalle-solicitud.component.css']
})
export class DetalleSolicitudComponent implements OnInit {
  solicitud: Solicitud | null = null;
  movimientos: any[] = [];
  usuario: string = 'Juan Pérez';
  mensajes: Mensaje[] = [
    {
      autor: 'Sistema',
      contenido: 'Solicitud recibida y registrada correctamente.',
      fecha: new Date('2026-06-10T09:15:00'),
      propio: false
    },
    {
      autor: 'Juan Pérez',
      contenido: 'Adjunté la constancia de situación fiscal actualizada.',
      fecha: new Date('2026-06-11T12:30:00'),
      propio: true
    },
    {
      autor: 'Revisor REPSE',
      contenido: 'Falta el comprobante de pago de IMSS del último periodo. Favor de subirlo.',
      fecha: new Date('2026-06-12T16:45:00'),
      propio: false
    },
    {
      autor: 'Juan Pérez',
      contenido: 'Listo, ya cargué el comprobante de pago de IMSS.',
      fecha: new Date('2026-06-13T10:05:00'),
      propio: true
    }
  ];
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

  agregarMensaje(mensaje: Mensaje): void {
    this.mensajes = [...this.mensajes, mensaje];
    console.log('Nuevo mensaje:', mensaje);
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
    const descripcion = (this.solicitud?.estado ?? '').toLowerCase();

    if (descripcion.includes('aprob') || descripcion.includes('acept') || descripcion.includes('autoriz')) {
      return 'aprobado';
    }
    if (descripcion.includes('rechaz') || descripcion.includes('cancel') || descripcion.includes('denegad')) {
      return 'rechazado';
    }
    if (descripcion.includes('pendiente') || descripcion.includes('proceso') || descripcion.includes('revis')) {
      return 'pendiente';
    }
    return 'default';
  }
}
