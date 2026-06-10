import { Component, OnInit, ViewChild } from '@angular/core';
import { Grid, EditSettingsModel, PageSettingsModel, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Solicitud } from '../../models/solicitud';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { ModalSolicitudComponent } from './modal-solicitud/modal-solicitud.component';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent implements OnInit {
 @ViewChild('modalSolicitud') modalSolicitud: ModalSolicitudComponent;
 @ViewChild('grid') grid: Grid;
 solicitudes: Solicitud[] = [];
 editSettings: EditSettingsModel = { allowDeleting: false, allowEditing: false };
 pageSettings: PageSettingsModel = { pageSizes: true, pageCount: 10 };
 filterSettings: FilterSettingsModel = { type: "CheckBox" };
 filterMenu: FilterSettingsModel = { type: "Menu" };
 formatoptions = { type: 'dateTime', format: 'dd/MM/yyyy' };
 selectOptions: any = { };

 constructor(private solicitudService: SolicitudService) { }

 ngOnInit(): void {
   this.solicitudService.obtenerSolicitudes().subscribe((response) => {
       console.log(response.solicitudes);
     if (response.solicitudes) {
       this.solicitudes = response.solicitudes;
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
   console.log('Solicitud guardada en padre:', solicitud);
   // TODO: Agregar la solicitud a la lista o hacer llamada al servicio
   this.solicitudService.obtenerSolicitudes().subscribe((response) => {
     if (response.solicitudes) {
       this.solicitudes = response.solicitudes;
     }
   });
 }
}
