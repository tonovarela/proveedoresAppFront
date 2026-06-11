import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProveedorAsignado } from '../../../models/proveedorAsignado';
import { SolicitudService } from 'src/app/services/solicitud.service';

@Component({
  selector: 'app-modal-solicitud',
  templateUrl: './modal-solicitud.component.html',
  styleUrls: ['./modal-solicitud.component.css']
})
export class ModalSolicitudComponent implements OnInit {
  @Output() solicitudGuardada = new EventEmitter<any>();
  @Output() modalCerrado = new EventEmitter<void>();

  showModal = false;
  anios: number[] = [];
  meses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  nuevaSolicitud: { proveedor: string; nombreProveedor: string; anio: number | string; mes: number | string; nota: string } = {
    proveedor: '',
    nombreProveedor: '',
    anio: '',
    mes: '',
    nota: ''
  };

  // Autocomplete
  busquedaProveedor = '';
  sugerenciasProveedor: ProveedorAsignado[] = [];
  mostrarSugerencias = false;
  indiceSeleccionado = -1;
  private busqueda$ = new Subject<string>();

  constructor(private solicitudService: SolicitudService) {
    const anioActual = new Date().getFullYear();
    this.anios = [anioActual, anioActual - 1];

    this.busqueda$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(termino => this.solicitudService.buscarProveedores(termino))
    ).subscribe(response => {
      this.sugerenciasProveedor = response.proveedores || [];
      this.mostrarSugerencias = this.sugerenciasProveedor.length > 0;
      this.indiceSeleccionado = -1;
    });
  }

  ngOnInit(): void {
  }

  abrirModal() {
    this.nuevaSolicitud = { proveedor: '', nombreProveedor: '', anio: '', mes: '', nota: '' };
    this.busquedaProveedor = '';
    this.sugerenciasProveedor = [];
    this.mostrarSugerencias = false;
    this.indiceSeleccionado = -1;
    this.showModal = true;
  }

  onBuscarProveedor(termino: string, inputEl: HTMLInputElement) {
    this.nuevaSolicitud.proveedor = '';
    this.nuevaSolicitud.nombreProveedor = '';
    this.indiceSeleccionado = -1;
    if (termino.length >= 2) {
      this.busqueda$.next(termino);
    } else {
      this.sugerenciasProveedor = [];
      this.mostrarSugerencias = false;
    }
  }

  onTeclaAutocomplete(event: KeyboardEvent) {
    if (!this.mostrarSugerencias) { return; }
    const total = this.sugerenciasProveedor.length;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.indiceSeleccionado = (this.indiceSeleccionado + 1) % total;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.indiceSeleccionado = (this.indiceSeleccionado - 1 + total) % total;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.indiceSeleccionado >= 0) {
        this.seleccionarProveedor(this.sugerenciasProveedor[this.indiceSeleccionado]);
      }
    } else if (event.key === 'Escape') {
      this.sugerenciasProveedor = [];
      this.mostrarSugerencias = false;
      this.indiceSeleccionado = -1;
    }
  }

  seleccionarProveedor(prov: ProveedorAsignado) {
    this.nuevaSolicitud.proveedor = prov.proveedor || '';
    this.nuevaSolicitud.nombreProveedor = prov.nombre || '';
    this.busquedaProveedor = prov.nombre || '';
    this.sugerenciasProveedor = [];
    this.mostrarSugerencias = false;
    this.indiceSeleccionado = -1;
  }

  cerrarModal() {
    this.showModal = false;
    this.modalCerrado.emit();
  }

  guardarSolicitud(form: NgForm) {
    if (form.invalid) { return; }
    const solicitudFormateada = {
      ...this.nuevaSolicitud      
    };
    this.solicitudGuardada.emit(solicitudFormateada);
    this.cerrarModal();
  }
}
