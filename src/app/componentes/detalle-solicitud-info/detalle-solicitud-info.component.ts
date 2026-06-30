import {
  Component, Input, Output, EventEmitter, OnChanges, SimpleChanges,
  AfterViewInit, OnDestroy, ViewChild, ElementRef
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Grid, EditSettingsModel, FilterSettingsModel, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Subscription } from 'rxjs';
import { Solicitud, DocumentoRepse, EstadoDocumento } from '../../models/solicitud';
import { Mensaje } from '../../models';
import { SolicitudService } from '../../services/solicitud.service';
import { ModalUploadService } from '../../services/modal-upload.service';
import { ProveedorService } from '../../services/proveedor.service';
import { SubirArchivoService } from '../../services/subir-archivo.service';
import { UiService } from '../../services/ui.service';
import { UsuarioService } from 'src/app/services';

@Component({
  selector: 'app-detalle-solicitud-info',
  templateUrl: './detalle-solicitud-info.component.html',
  styleUrls: ['./detalle-solicitud-info.component.css']
})
export class DetalleSolicitudInfoComponent implements OnChanges, AfterViewInit, OnDestroy {

  @Input() solicitud: Solicitud | null = null;
  @Input() panelColapsado: boolean = true;
  @Input() esAdmin: boolean = false;

  /** Notifica al padre que la solicitud pudo cambiar (estado) y debe refrescarse. */
  @Output() solicitudActualizada = new EventEmitter<void>();

  @ViewChild('gridDocs') gridDocs: Grid;
  @ViewChild('docContainer') docContainerRef: ElementRef;
  @ViewChild('modalMotivo') modalMotivoRef: any;
  @ViewChild('modalPdf') modalPdfRef: any;

  private resizeBound = this.onResizeDocs.bind(this);
  private uploadSub: Subscription;
  private idCargado: string | null = null;

  documentosRepse: DocumentoRepse[] = [];
  mensajes: Mensaje[] = [];
  usuario: string = 'Juan Pérez';

  docSeleccionado: DocumentoRepse | null = null;
  docPdfSeleccionado: DocumentoRepse | null = null;
  pdfUrl: SafeResourceUrl | null = null;
  cargandoPdf: boolean = false;
  private pdfObjectUrl: string | null = null;
  docEnSubida: DocumentoRepse | null = null;
  aprobandoDocumento: boolean = false;
  rechazandoDocumento: boolean = false;
  motivoRechazo: string = '';

  editSettings: EditSettingsModel = { allowEditing: false, allowDeleting: false };
  filterSettings: FilterSettingsModel = { type: 'CheckBox' };
  filterMenu: FilterSettingsModel = { type: 'Menu' };
  pageOptions?: PageSettingsModel = { pageSize: 20, pageSizes: true, currentPage: 1 };

  get documentosAceptados(): number {
    return this.documentosRepse.filter(doc => doc.estado === 'Aceptado').length;
  }

  constructor(
    private usuarioService: UsuarioService,
    private solicitudService: SolicitudService,
    public _modalUploadService: ModalUploadService,
    private _proveedorService: ProveedorService,
    private _subirArchivoService: SubirArchivoService,
    private _uiService: UiService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['solicitud']) {
      const id = this.solicitud?.id_solicitud ?? null;
      if (id && id !== this.idCargado) {
        this.idCargado = id;
        this.cargarDocumentosYNotas(id);
      }
    }
    if (changes['panelColapsado'] && !changes['panelColapsado'].firstChange) {
      setTimeout(() => this.ajustarAlturaGrid());
    }
  }

  ngAfterViewInit(): void {
    window.addEventListener('resize', this.resizeBound);
    setTimeout(() => this.ajustarAlturaGrid());

    this.uploadSub = this._subirArchivoService.notificacionSubirArchivoRepse
      .subscribe(() => {
        if (this.docEnSubida) {
          this.docEnSubida.nombre = this._modalUploadService.tipoArchivo === 'zip'
            ? 'archivo.zip'
            : 'archivo.pdf';
          this.docEnSubida = null;
          this.recargar();
        }
      });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeBound);
    if (this.uploadSub) { this.uploadSub.unsubscribe(); }
    this.limpiarPdf();
  }

  esPdf(doc: DocumentoRepse): boolean {
    return !doc.tipo.includes('ZIP');
  }

  // ---- Carga de datos ----
  private async cargarDocumentosYNotas(id_solicitud: string): Promise<void> {
    await this.cargarDocumentos(id_solicitud);
    await this.obtenerNotas(id_solicitud);
    if (this.gridDocs) { this.gridDocs.refresh(); }
  }

  private async cargarDocumentos(id_solicitud: string): Promise<void> {
    const responseDocuments = await this.solicitudService.documentos(id_solicitud).toPromise();
    this.documentosRepse = responseDocuments.documentos;
  }

  private async obtenerNotas(id_solicitud: string): Promise<void> {
    const id_usuarioLogueado = `${this.usuarioService.usuario?.Id_Usuario || ''}`;
    const response = await this.solicitudService.obtenerNotas(id_solicitud, id_usuarioLogueado).toPromise();
    this.mensajes = response.mensajes;
  }

  /** Recarga documentos/notas y pide al padre refrescar la solicitud (estado). */
  private async recargar(): Promise<void> {
    const id = this.solicitud?.id_solicitud;
    if (id) { await this.cargarDocumentosYNotas(id); }
    this.solicitudActualizada.emit();
  }

  // ---- Ajuste de altura del grid ----
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
    const bottomPadding = 5;
    const newHeight = window.innerHeight - containerTop - headerH - bottomPadding;
    this.gridDocs.height = newHeight > 100 ? newHeight : 100;
  }

  // ---- Operaciones sobre documentos ----
  subirDocumento(doc: DocumentoRepse): void {
    this.docEnSubida = doc;
    this._proveedorService.revisarArchivo = '0';
    const tipoArchivo = doc.tipo.includes('ZIP') ? 'zip' : 'pdf';
    this._modalUploadService.mostrarModalRepse(tipoArchivo, { id_solicitud: this.solicitud?.id_solicitud!, id_tipo_documento: doc.id_tipo_documento! });
  }

  abrirDocumento(doc: DocumentoRepse): void {
    if (this.esPdf(doc)) {
      this.previsualizarPdf(doc);
    } else {
      this.descargarDocumento(doc);
    }
  }

  previsualizarPdf(doc: DocumentoRepse): void {
    this.docPdfSeleccionado = doc;
    this.cargandoPdf = true;
    this.limpiarPdf();
    const ref = this.modalService.open(this.modalPdfRef, {
      size: 'xl',
      centered: true,
      windowClass: 'modal-pdf-preview'
    });
    ref.result.then(
      () => this.cerrarPreviewPdf(),
      () => this.cerrarPreviewPdf()
    );

    this.solicitudService.descargarDocumento(this.solicitud?.id_solicitud!, doc.id_tipo_documento!)
      .subscribe((blob) => {
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        this.pdfObjectUrl = window.URL.createObjectURL(pdfBlob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfObjectUrl);
        this.cargandoPdf = false;
      }, () => {
        this.cargandoPdf = false;
        ref.dismiss();
      });
  }

  async aprobarDesdePreview(modal: any): Promise<void> {
    const doc = this.docPdfSeleccionado;
    modal.close();
    if (doc) {
      await this.aprobarDocumento(doc);
    }
  }

  rechazarDesdePreview(modal: any): void {
    const doc = this.docPdfSeleccionado;
    modal.close();
    if (doc) {
      this.abrirModalRechazo(doc);
    }
  }

  private cerrarPreviewPdf(): void {
    this.docPdfSeleccionado = null;
    this.limpiarPdf();
  }

  private limpiarPdf(): void {
    if (this.pdfObjectUrl) {
      window.URL.revokeObjectURL(this.pdfObjectUrl);
      this.pdfObjectUrl = null;
    }
    this.pdfUrl = null;
  }

  descargarDocumento(doc: DocumentoRepse): void {
    this.solicitudService.descargarDocumento(this.solicitud?.id_solicitud!, doc.id_tipo_documento!)
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.nombre || 'documento';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, (error) => {
        console.error('Error al descargar el documento:', error);
      });
  }

  async sustituirDocumento(doc: DocumentoRepse): Promise<void> {
    const result = await this._uiService.mostrarAlertaConfirmacion(
      '¿Sustituir archivo?',
      `Se reemplazará el archivo rechazado de "${doc.descripcion}" por uno nuevo.`,
      'Sí, sustituir',
      'Cancelar'
    );
    if (!result.value) { return; }
    this.subirDocumento(doc);
  }

  async eliminarDocumento(doc: DocumentoRepse): Promise<void> {
    const result = await this._uiService.mostrarAlertaConfirmacion(
      '¿Eliminar archivo?',
      `Se eliminará el archivo de "${doc.descripcion}". Esta acción no se puede deshacer.`,
      'Sí, eliminar',
      'Cancelar'
    );
    if (!result.value) { return; }
    await this.solicitudService.eliminarDocumento({ id_solicitud: this.solicitud?.id_solicitud!, id_tipo_documento: doc.id_tipo_documento!, nombre: doc.nombre! }).toPromise();

    doc.nombre = undefined;
    doc.ruta = undefined;
    await this.recargar();
    this._uiService.mostrarAlertaSuccess('Archivo eliminado', 'El archivo se eliminó correctamente.');
  }

  async aprobarDocumento(doc: DocumentoRepse): Promise<void> {
    this.aprobandoDocumento = true;
    try {
      doc.estado = 'Aceptado';
      const { id_tipo_documento } = doc!;
      const id_solicitud = this.solicitud?.id_solicitud!;
      const id_usuario = `${this.usuarioService.usuario?.Id_Usuario || ''}`;
      const request = await this.solicitudService.actualizarEstadoDocumento({
        id_solicitud,
        id_usuario,
        id_tipo_documento,
        id_estado: 4,
        motivo: ''
      }).toPromise();
      const solicitudAprobada = request["solicitudAprobada"];
      if (solicitudAprobada) {
        this._uiService.mostrarAlertaSuccess('Documento aprobado', 'La solicitud está en estado de "Aceptado"');
      }
      await this.recargar();
    } catch (error) {
      console.error('Error al aprobar el documento:', error);
    } finally {
      this.aprobandoDocumento = false;
    }
  }

  abrirModalRechazo(doc: DocumentoRepse): void {
    this.docSeleccionado = doc;
    this.motivoRechazo = '';
    this.rechazandoDocumento = false;
    this.modalService.open(this.modalMotivoRef, { size: 'md', centered: true, backdrop: 'static', keyboard: false });
  }

  async confirmarRechazo(modal: any): Promise<void> {
    if (this.rechazandoDocumento) { return; }
    if (!this.motivoRechazo.trim() || !this.docSeleccionado) { return; }
    this.rechazandoDocumento = true;
    try {
      this.docSeleccionado.estado = 'Rechazado';
      const id_tipo_documento = this.docSeleccionado.id_tipo_documento!;
      const id_solicitud = this.solicitud?.id_solicitud!;
      const id_usuario = `${this.usuarioService.usuario?.Id_Usuario || ''}`;
      await this.solicitudService.actualizarEstadoDocumento({
        id_solicitud,
        id_usuario,
        id_tipo_documento,
        id_estado: 3,
        motivo: this.motivoRechazo.trim()
      }).toPromise();
      await this.recargar();
      modal.close();
      this.docSeleccionado = null;
      this.motivoRechazo = '';
    } catch (error) {
      console.error('Error al rechazar el documento:', error);
    } finally {
      this.rechazandoDocumento = false;
    }
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

  getEstadoDocClass(estado: EstadoDocumento): string {
    switch (estado) {
      case 'Aceptado':
        return 'aprobado';
      case 'Rechazado':
        return 'rechazado';
      case 'En revision':
        return 'revision';
      case 'Requerimiento':
        return 'requerimiento';
      default:
        return 'default';
    }
  }
}
