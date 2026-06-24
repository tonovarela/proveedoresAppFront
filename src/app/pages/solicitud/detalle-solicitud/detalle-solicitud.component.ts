import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Solicitud } from '../../../models/solicitud';
import { Mensaje } from '../../../models';
import { SolicitudService } from '../../../services/solicitud.service';
import { Grid, PageSettingsModel, EditSettingsModel, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ModalUploadService } from '../../../services/modal-upload.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { SubirArchivoService } from '../../../services/subir-archivo.service';
import { Subscription } from 'rxjs';

type EstadoDocumento = 'pendiente' | 'aprobado' | 'rechazado';

interface DocumentoRepse {
  descripcion: string;
  tipo: string;
  nombreArchivo: string;
  fechaSubida: Date | null;
  estado: EstadoDocumento;
}

@Component({
  selector: 'app-detalle-solicitud',
  templateUrl: './detalle-solicitud.component.html',
  styleUrls: ['./detalle-solicitud.component.css']
})
export class DetalleSolicitudComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('gridDocs') gridDocs: Grid;
  @ViewChild('docContainer') docContainerRef: ElementRef;
  @ViewChild('modalMotivo') modalMotivoRef: any;

  private resizeBound = this.onResizeDocs.bind(this);
  private uploadSub: Subscription;

  docSeleccionado: DocumentoRepse | null = null;
  docEnSubida: DocumentoRepse | null = null;
  motivoRechazo: string = '';
  solicitud: Solicitud | null = null;
  movimientos: any[] = [];
  usuario: string = 'Juan Pérez';

  pageSettings: PageSettingsModel = { pageSize: 10, pageSizes: true };
  editSettings: EditSettingsModel = { allowEditing: false, allowDeleting: false };
  filterSettings: FilterSettingsModel = { type: 'CheckBox' };
  filterMenu: FilterSettingsModel = { type: 'Menu' };

  documentosRepse: DocumentoRepse[] = [
    { descripcion: 'Recibo de nómina Trabajadores XML', tipo: 'ZIP · XML', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
    { descripcion: 'Recibo de nómina Trabajadores PDF', tipo: 'ZIP · PDF', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
    { descripcion: 'Copia del registro REPSE vigente', tipo: 'PDF', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
    { descripcion: 'Constancia de situación fiscal', tipo: 'PDF', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
    { descripcion: 'Declaración de entero de retención de sueldos y salarios y comprobante de pago', tipo: 'PDF', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
    { descripcion: 'Declaración definitiva y comprobante de pago de IVA', tipo: 'PDF', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
    { descripcion: 'Declaración definitiva y comprobante de pago de ISR', tipo: 'PDF', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
    { descripcion: 'Cédula de determinación de cuotas IMSS', tipo: 'PDF', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
    { descripcion: 'Resumen de liquidación de IMSS', tipo: 'PDF', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
    { descripcion: 'Comprobante de pago IMSS', tipo: 'PDF', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
    { descripcion: 'Opinión de cumplimiento SAT', tipo: 'PDF', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
    { descripcion: 'Opinión de cumplimiento IMSS', tipo: 'PDF', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
    { descripcion: 'Opinión de cumplimiento INFONAVIT', tipo: 'PDF', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
    { descripcion: 'Cédula de determinación de aportaciones y amortización IMSS-INFONAVIT', tipo: 'PDF', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
    { descripcion: 'Resumen de liquidación IMSS-INFONAVIT', tipo: 'PDF', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
    { descripcion: 'Comprobante de pago IMSS-INFONAVIT', tipo: 'PDF', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
    { descripcion: 'Declaración informativa IMSS', tipo: 'PDF', nombreArchivo: '', fechaSubida: null, estado: 'pendiente' },
  ];
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
    private solicitudService: SolicitudService,
    public _modalUploadService: ModalUploadService,
    private _proveedorService: ProveedorService,
    private _subirArchivoService: SubirArchivoService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.cargarDetalle();
    this.uploadSub = this._subirArchivoService.notificacionSubirOpinionCumplimiento
      .subscribe(() => {
        if (this.docEnSubida) {
          this.docEnSubida.nombreArchivo = this._modalUploadService.tipoArchivo === 'zip'
            ? 'archivo.zip'
            : 'archivo.pdf';
          this.docEnSubida = null;
          this.gridDocs.refresh();
        }
      });
  }

  ngAfterViewInit(): void {
    window.addEventListener('resize', this.resizeBound);
    setTimeout(() => this.ajustarAlturaGrid());
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeBound);
    if (this.uploadSub) { this.uploadSub.unsubscribe(); }
  }

  dataBoundDocs(): void {
    this.ajustarAlturaGrid();
  }

  onResizeDocs(): void {
    this.ajustarAlturaGrid();
  }

  ajustarAlturaGrid(): void {
    if (!this.gridDocs || !this.docContainerRef) { return; }
    const container = this.docContainerRef.nativeElement as HTMLElement;
    const headerEl = container.querySelector('.card-header-custom') as HTMLElement;
    const headerH = headerEl ? headerEl.offsetHeight : 48;
    const containerTop = container.getBoundingClientRect().top;
    const bottomPadding = 16;
    const newHeight = window.innerHeight - containerTop - headerH - bottomPadding;
    this.gridDocs.height = Math.max(newHeight, 200);
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

  subirDocumento(doc: DocumentoRepse): void {
    this.docEnSubida = doc;
    this._proveedorService.revisarArchivo = '0';
    const tipoArchivo = doc.tipo.includes('ZIP') ? 'zip' : 'pdf';
    this._modalUploadService.mostrarModal(tipoArchivo, null);
  }

  descargarDocumento(doc: DocumentoRepse): void {
    console.log('Descargar:', doc.nombreArchivo);
  }

  aprobarDocumento(doc: DocumentoRepse): void {
    doc.estado = 'aprobado';
    this.gridDocs.refresh();
  }

  abrirModalRechazo(doc: DocumentoRepse): void {
    this.docSeleccionado = doc;
    this.motivoRechazo = '';
    this.modalService.open(this.modalMotivoRef, { size: 'md', centered: true });
  }

  confirmarRechazo(modal: any): void {
    if (!this.motivoRechazo.trim() || !this.docSeleccionado) { return; }
    this.docSeleccionado.estado = 'rechazado';
    this.gridDocs.refresh();
    modal.close();
    this.docSeleccionado = null;
    this.motivoRechazo = '';
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
