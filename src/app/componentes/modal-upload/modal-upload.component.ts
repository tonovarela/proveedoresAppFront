
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
  errores:string[]=[];
  archivoSubir: File;
  archivoSubiendo:boolean =false;


  tipoArchivo='';



  detalleErroresCP:RevisionCP[]=[];  
   

  @ViewChild('archivo') archivoRef: ElementRef;


  
  constructor(public _modalUploadService: ModalUploadService,
    public _uiService: UiService,
    public _subirArchivoService: SubirArchivoService,
    private _excelService :ExcelService

  ) { }
  

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
  
  }
  cerrarModal() {    
    this._modalUploadService.ocultarModal();
    this.mensaje = "";
    this.errores=[];
    this.detalleErroresCP=[];
    this.archivoRef.nativeElement.value = "";
    this.archivoSubir = null;
    this.archivoSubiendo=false;
  }
  subirArchivo() {
    
    if (!this.archivoSubir) {      
      return;
    }    
    this.archivoSubiendo=true;  
    this.tipoArchivo=this._modalUploadService.tipoArchivo;     
    this._subirArchivoService.revisarArchivo(this.archivoSubir,
                                            this._modalUploadService.tipoArchivo,
                                            this._modalUploadService.movimiento)
      .subscribe((response) => {
        this.archivoSubiendo=false;        
        if (response['esIgual']) {              
          this.registrarBitacoraIntelisis(response["path"]);
          this._modalUploadService.ocultarModal();                 
          this.cerrarModal();
          this._uiService.mostrarAlertaSuccess("Listo",response["mensaje"]);
        } else {
          this.mensaje = response["mensaje"];
          this.errores= response["errores"];
          if (response["detalleErroresCP"]!=undefined){
            this.detalleErroresCP=response["detalleErroresCP"];           
          }
          
          
          
        }
      });

      
  }

  registrarBitacoraIntelisis(path:string){    
    const id=this._modalUploadService.movimiento.movimientoID;
    if (this._modalUploadService.movimiento.tipo=="Factura-Ingreso"){
      this._subirArchivoService
                              .anexarMovimientoIntelisis(path,id,'CXP')
                              .subscribe();             
    }
    if (this._modalUploadService.movimiento.tipo=="Pago"){
      this._subirArchivoService
                              .anexarMovimientoIntelisis(path,id,'DNI')
                              .subscribe();             
    }
  }


  exportarReporteErrores() {
    let info=[];
    if (this.tipoArchivo.toUpperCase()=="XML"){
       info=this.detalleErroresCP.map(d=>{
        return {
          "idDocumento":d.idDocumento,
          "Importe en sistema":d.importeRegistrado==-1?"No existe":d.importeRegistrado,
          "Importe en XML":d.importeXML==-1?"No existe":d.importeXML
        };
      });    
    }else{

      info=this.detalleErroresCP.map(d=>{
        return {
          "idDocumento":d.idDocumento,
          "Error":'No existe en el PDF',          
        };
      });
    }
    
    this._excelService.exportAsExcelFile(info,"Error en Movimientos")
   
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
