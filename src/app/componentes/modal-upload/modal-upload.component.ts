import { SubirArchivoService } from './../../services/subir-archivo.service';
import { UiService } from './../../services/ui.service';
import { ModalUploadService } from './../../services/modal-upload.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styleUrls: ['./modal-upload.component.css']
})
export class ModalUploadComponent implements OnInit {
  mensaje: string = "";
  errores:string[]=[];
  archivoSubir: File;
  archivoSubiendo:boolean =false;

  @ViewChild('archivo') archivoRef: ElementRef;

  
  constructor(public _modalUploadService: ModalUploadService,
    public _uiService: UiService,
    public _subirArchivoService: SubirArchivoService
  ) { }

  ngOnInit(): void {
    
  }
  cerrarModal() {    
    this._modalUploadService.ocultarModal();
    this.mensaje = "";
    this.errores=[];
    this.archivoRef.nativeElement.value = "";
    this.archivoSubir = null;
    this.archivoSubiendo=false;
  }
  subirArchivo() {
    if (!this.archivoSubir) {
      console.log("No hay archivo");
      return;
    }
    this.archivoSubiendo=true;
  
    this._subirArchivoService.revisarArchivo(this.archivoSubir,
                                            this._modalUploadService.tipoArchivo,
                                            this._modalUploadService.movimiento)
      .subscribe((response) => {
        this.archivoSubiendo=false;
        if (response['esIgual']) {
          this._modalUploadService.ocultarModal();                 
          this.cerrarModal();
          this._uiService.mostrarAlertaSuccess("Listo",response["mensaje"]);
        } else {
          this.mensaje = response["mensaje"];
          this.errores= response["errores"];
        }
      });
  }



  seleccionarArchivo(archivo: File) {
    this.mensaje = "";
    this.errores=[];
    if (!archivo) {
      console.log("No hay archivo");
      return;
    }


    if (archivo.type.indexOf(this._modalUploadService.tipoArchivo) < 0) {
      this.mensaje = `El archivo debe de ser de  tipo ${this._modalUploadService.tipoArchivo} `;
      return;
    }
    this.archivoSubir = archivo;
    // this.imagenSubir = archivo;
    // const reader = new FileReader();
    // const urlImagenTemp = reader.readAsDataURL(archivo);
    // reader.onloadend = ()  => {
    // this.imagenTemp = reader.result;
    // };

  }




}