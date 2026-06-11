import { Component, OnInit, ViewChild } from '@angular/core';

import { Grid, EditSettingsModel, PageSettingsModel, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { RequestSolicitud, Solicitud, EstadoSolicitud } from '../../models/solicitud';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { ModalSolicitudComponent } from './modal-solicitud/modal-solicitud.component';
import { UsuarioService } from '../../services/usuario.service';
import { catchError, switchMap } from 'rxjs/operators';
import { UiService } from '../../services/ui.service';
import {  Router } from '@angular/router';


@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})


export class SolicitudComponent implements OnInit {
 @ViewChild('modalSolicitud') modalSolicitud: ModalSolicitudComponent;
 @ViewChild('grid') grid: Grid;
 solicitudes: Solicitud[] = []
 estados :EstadoSolicitud[] = [];
 editSettings: EditSettingsModel = { allowDeleting: false, allowEditing: false };
 pageSettings: PageSettingsModel = { pageSizes: true, pageCount: 10 };
 filterSettings: FilterSettingsModel = { type: "CheckBox" };
 filterMenu: FilterSettingsModel = { type: "Menu" };
 formatoptions = { type: 'dateTime', format: 'dd/MM/yyyy' };
 selectOptions: any = { };

 constructor(private solicitudService: SolicitudService,
             private usuarioService: UsuarioService,
             private uiService: UiService,
             private router: Router
            
            ) { }

 ngOnInit(): void {
    this.cargarSolicitudes();
 }


 cargarSolicitudes() {
   this.solicitudService.obtenerSolicitudes().subscribe((response) => {
     if (response.solicitudes) {
       this.solicitudes = response.solicitudes;
       this.estados = response.estados;
     }
   });
 }

 resizeGrid() {
   if (this.grid === undefined) {
     return;
   }
   if (window.innerHeight >= 655) {
     this.grid.height = window.innerHeight * 0.70;
   }
   if (window.innerHeight <= 654) {
     this.grid.height = 250;
   }
 }

 dataBound() {
   this.resizeGrid();
 }

 onresize(e) {
   this.resizeGrid();
 }

 abrirModal() {
   this.modalSolicitud.abrirModal();
 }

 onSolicitudGuardada(solicitud: any) {   
   const id_usuario = this.usuarioService.usuario!.Id_Usuario;     
   const nuevaSolicitud : RequestSolicitud = {
     proveedor: solicitud.proveedor,
     prefijo: `${solicitud.anio}/${String(solicitud.mes).padStart(2, '0') }/${solicitud.proveedor}`,     
     mensaje: solicitud.nota,
     id_usuario
   };   

   this.solicitudService.registrar(nuevaSolicitud)
   .pipe(
      catchError((error) => {
        if (error.status === 400 && error.error && error.error.message) {
          this.uiService.mostrarAlertaError('Error al registrar solicitud', error.error.message);          
        } else {
          this.uiService.mostrarAlertaError('Error al registrar solicitud', 'Ocurrió un error al registrar la solicitud. Por favor, inténtalo de nuevo.');          
        }        
        return [];
      }),      
   ).subscribe(()=>{
      this.uiService.mostrarAlertaSuccess('Solicitud registrada', 'La solicitud ha sido registrada exitosamente.');
      this.cargarSolicitudes();
   });
   
       
 }

 async cambiarEstado(solicitud: Solicitud, id_estado: number) {
  const {id_estado: estadoActual} = solicitud;
    if (estadoActual === id_estado) { return; }
     
   const request = {
      id_solicitud: solicitud.id_solicitud,
      id_estado: id_estado,
      estado_previo: estadoActual
   }
   const response = await this.solicitudService.actualizarEstado(request).toPromise();   
   //console.log('Respuesta actualización estado:', response);
  

   solicitud.id_estado = id_estado;
   const estadoSeleccionado = this.estados.find((e) => e.id_estado === id_estado);
   solicitud.estado = estadoSeleccionado?.descripcion;
   console.log('Solicitud actualizada:', request);
 }

 esEstadoAceptado(solicitud: Solicitud): boolean {
   const descripcion =
     solicitud.estado ??
     this.estados.find((e) => e.id_estado === solicitud.id_estado)?.descripcion ??
     '';
   return descripcion.trim().toLowerCase() === 'aceptado';
 }

 claseEstado(id_estado: number): string {
   const estado = this.estados.find((e) => e.id_estado === id_estado);
   const descripcion = (estado?.descripcion ?? '').toLowerCase();

   if (descripcion.includes('aprob') || descripcion.includes('acept') || descripcion.includes('autoriz')) {
     return 'estado-aprobado';
   }
   if (descripcion.includes('rechaz') || descripcion.includes('cancel') || descripcion.includes('denegad')) {
     return 'estado-rechazado';
   }
   if (descripcion.includes('pendiente') || descripcion.includes('proceso') || descripcion.includes('revis')) {
     return 'estado-pendiente';
   }
   return 'estado-default';
 }

 verDetalleSolicitud(solicitud: Solicitud) {
   this.solicitudService.setSolicitudSeleccionada(solicitud);
   this.router.navigate(['solicitud-repse/detalle', solicitud.id_solicitud]);
 }
}
