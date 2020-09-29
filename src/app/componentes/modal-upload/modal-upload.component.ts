
import { SubirArchivoService } from './../../services/subir-archivo.service';
import { UiService } from './../../services/ui.service';
import { ModalUploadService } from './../../services/modal-upload.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { RevisionCP } from 'src/app/models/movimiento';
import { ExcelService } from 'src/app/services/excel-service.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styleUrls: ['./modal-upload.component.css']
})
export class ModalUploadComponent implements OnInit, OnDestroy {
  mensaje: string = "";
  errores: string[] = [];
  archivoSubir: File;
  archivoSubiendo: boolean = false;


  tipoArchivo = '';



  detalleErroresCP: RevisionCP[] = [];


  @ViewChild('archivo') archivoRef: ElementRef;



  constructor(public _modalUploadService: ModalUploadService,
    public _uiService: UiService,
    public _subirArchivoService: SubirArchivoService,
    private _excelService: ExcelService

  ) { }


  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }
  cerrarModal() {
    this._modalUploadService.ocultarModal();
    this.mensaje = "";
    this.errores = [];
    this.detalleErroresCP = [];
    this.archivoRef.nativeElement.value = "";
    this.archivoSubir = null;
    this.archivoSubiendo = false;
  }
  subirArchivo() {

    if (!this.archivoSubir) {
      return;
    }
    this.archivoSubiendo = true;
    this.tipoArchivo = this._modalUploadService.tipoArchivo;
    this._subirArchivoService.revisarArchivo(this.archivoSubir,
      this._modalUploadService.tipoArchivo,
      this._modalUploadService.movimiento)
      .subscribe((response) => {
        this.archivoSubiendo = false;
        if (response['esIgual']) {

          if (this._modalUploadService.tipoArchivo != "*") {
            //Registrar bitacora XML y PDF
            this.registrarBitacoraIntelisis(response["path"]);
          } else {
            //Registrar bitacora Evidencia          
            this.registrarBitacoraEvidencia(response["pathArchivo"]);

          }
          this._modalUploadService.ocultarModal();
          this.cerrarModal();
          this._uiService.mostrarAlertaSuccess("Listo", response["mensaje"]);
        } else {
          this.mensaje = response["mensaje"];
          this.errores = response["errores"];
          if (response["detalleErroresCP"] != undefined) {
            this.detalleErroresCP = response["detalleErroresCP"];
          }



        }
      });


  }



  registrarBitacoraEvidencia(path: string) {
    const movimiento = this._modalUploadService.movimiento;
    let rama = "CXP"
    this._subirArchivoService
      .anexarEvidenciaIntelisis(path, movimiento, rama)
      .subscribe();

  }


  registrarBitacoraIntelisis(path: string) {
    const movimiento = this._modalUploadService.movimiento;
    let rama = ""
    if (this._modalUploadService.movimiento.tipo == "Factura-Ingreso") {
      rama = 'CXP';
    }
    if (this._modalUploadService.movimiento.tipo == "Pago") {
      rama = 'DIN';
    }
    if (rama == "") {
      return;
    }
    this._subirArchivoService
      .anexarMovimientoIntelisis(path, movimiento, rama)
      .subscribe();

  }


  exportarReporteErrores() {
    let info = [];
    if (this.tipoArchivo.toUpperCase() == "XML") {
      info = this.detalleErroresCP.map(d => {
        return {
          "idDocumento": d.idDocumento,
          "Importe en sistema": d.importeRegistrado == -1 ? "No existe" : d.importeRegistrado,
          "Importe en XML": d.importeXML == -1 ? "No existe" : d.importeXML
        };
      });
    } else {

      info = this.detalleErroresCP.map(d => {
        return {
          "idDocumento": d.idDocumento,
          "Error": 'No existe en el PDF',
        };
      });
    }

    this._excelService.exportAsExcelFile(info, "Error en Movimientos")

  }


  seleccionarArchivo(archivo: File) {
    this.mensaje = "";
    this.errores = [];
    if (!archivo) {
      console.log("No hay archivo");
      return;
    }


    if (archivo.type.indexOf(this._modalUploadService.tipoArchivo) < 0) {
      this.mensaje = `El archivo debe de ser de  tipo ${this._modalUploadService.tipoArchivo} `;
    }

    if (this._modalUploadService.tipoArchivo === "*") {      
      if (archivo.type.toLowerCase().indexOf("pdf") > 0 
         || archivo.type.toLowerCase().indexOf("png") > 0
         || archivo.type.toLowerCase().indexOf("jpeg") > 0
         || archivo.type.toLowerCase().indexOf("bmp") > 0
         || archivo.type.toLowerCase().indexOf("jpg") > 0
         || archivo.type.toLowerCase().indexOf("gif") > 0
         || archivo.type.toLowerCase().indexOf("svg") > 0
         ) {
        this.mensaje = "";
      } else {
        this.mensaje = `El archivo debe de ser una imagen o un PDF `;
      }

    }

    if (this.mensaje.length > 0) {
      return;
    }
    this.archivoSubir = archivo;


  }




}
