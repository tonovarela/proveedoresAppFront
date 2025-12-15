import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription,from,of  } from 'rxjs';
import { OpinionCumplimiento, Usuario } from 'src/app/models';
import { ProveedorService,SubirArchivoService,UsuarioService,ModalUploadService } from 'src/app/services';


import * as JSZip from 'jszip/dist/jszip';
import { switchMap, tap, filter, first } from 'rxjs/operators';


interface DocumentoRepseView {
  descripcion:string;
  id_documento?:number;
  nombreArchivo:string;
  fechaSubida:Date;
  estatus:boolean;
}

 interface ZipFile {
   name: string;
   dir: boolean;
   date: Date;
   data: any;
}

interface ResponseXML {
  emisor: string;
  receptor: string;
  fecha: Date;
  error?: {mensaje:string,fileName:string};
}


@Component({
  selector: 'app-repse',
  templateUrl: './repse.component.html',
  styleUrls: ['./repse.component.css']
})
export class RepseComponent implements OnInit ,OnDestroy{

  //tipoArchivo:number=0;
  usuario: Usuario = {};

  DocumentosRepse:DocumentoRepseView[]=[
    { descripcion:"Copia del registro  REPSE vigente", id_documento:null, nombreArchivo:"", fechaSubida:null, estatus:false },
    { descripcion:"Constancia de situación fiscal", id_documento:null, nombreArchivo:"", fechaSubida:null, estatus:false },
    { descripcion:"Declaracion de entero de retenció de sueldos y salarios y comprobante de pago", id_documento:null, nombreArchivo:"", fechaSubida:null, estatus:false },
    { descripcion:"Declaracion definitiva y comprobante de pago de IVA", id_documento:null, nombreArchivo:"", fechaSubida:null, estatus:false },
    { descripcion:"Declaracion definitiva y comprobante de pago de ISR", id_documento:null, nombreArchivo:"", fechaSubida:null, estatus:false },
    { descripcion:"Cédula de determinacion de cuotas IMSS", id_documento:null, nombreArchivo:"", fechaSubida:null, estatus:false },
    { descripcion:"Resumen de liquidacion de IMSS", id_documento:null, nombreArchivo:"", fechaSubida:null, estatus:false },
    { descripcion:"Comprobante de pago IMSS", id_documento:null, nombreArchivo:"", fechaSubida:null, estatus:false },
    { descripcion:"Opinion de cumplimiento SAT", id_documento:null, nombreArchivo:"", fechaSubida:null, estatus:false },
    { descripcion:"Opinion de cumplimiento IMSS", id_documento:null, nombreArchivo:"", fechaSubida:null, estatus:false },
    { descripcion:"Opinion de cumplimiento INFONAVIT", id_documento:null, nombreArchivo:"", fechaSubida:null, estatus:false },
    { descripcion:"Cédula de determinación de aportaciones y amortización IMSS-INFONAVIT", id_documento:null, nombreArchivo:"", fechaSubida:null, estatus:false },
    { descripcion:"Resumen de liquidacion IMSS-INFONAVIT", id_documento:null, nombreArchivo:"", fechaSubida:null, estatus:false },
    { descripcion:"Comprobante de pago IMSS-INFONAVIT", id_documento:null, nombreArchivo:"", fechaSubida:null, estatus:false },
    { descripcion:"Declaración informativa IMSS ()", id_documento:null, nombreArchivo:"", fechaSubida:null, estatus:false },

  ];
  
  subscriptionNotificacion: Subscription;
  constructor(private _proveedorService:ProveedorService, 
              private _router:Router,               
              private _subirArchivoService: SubirArchivoService,
              private _usuarioService:UsuarioService,
              private _modalUploadSevice:ModalUploadService) { }

              
ngOnDestroy(): void {

  if (this.subscriptionNotificacion){
    this.subscriptionNotificacion.unsubscribe();
  }
  
  }

  ngOnInit(): void {    
    if (this._proveedorService.usuario ==null){
     this._router.navigateByUrl("/listado");
     return;
    }       
    this.usuario= this._proveedorService.usuario; 
        
  }
  

  subirArchivo() {          
     this._proveedorService.revisarArchivo="0";
     this._modalUploadSevice.mostrarModal("pdf", null);
  }


  regresar(){
    this._router.navigateByUrl("/listado");
  }

  


  async leerArchivoXML(fileZip:any):Promise<ResponseXML>{     
        const parser = new DOMParser();
        const contenidoDelArchivo = await fileZip.async('string');
        const xmlDoc = parser.parseFromString(contenidoDelArchivo,"text/xml");
                              
        try {

          const root = xmlDoc.childNodes[0];   
          const fecha = (root as Element).attributes["Fecha"].value;          
          const nodes= root.childNodes;        
          const nodesArray = Array.from(nodes);
          const [emisor] =nodesArray.filter(n=>n.nodeName=="cfdi:Emisor");
          const [receptor] =nodesArray.filter(n=>n.nodeName=="cfdi:Receptor");        
          const emisorNode = emisor as Element;
          const receptorNode = receptor as Element;
          console.log({
                  emisor:emisorNode.attributes["Rfc"].value,
                  receptor:receptorNode.attributes["Rfc"].value,
                  fecha,
                  error:null
                 });
           return {
                  emisor:emisorNode.attributes["Rfc"].value,
                  receptor:receptorNode.attributes["Rfc"].value,
                  fecha:new Date(fecha),                  
                  error:null
                 };           
          
        } catch (error) {
          return {
            emisor:null,
            receptor:null,
            fecha:null,
            error: {mensaje:error.message,fileName:fileZip.name},          
          };
        }
                
  }



  async ngOnFile(event: any) {    
    const fileList = event.target.files;
    const zipLoaded = new JSZip.default();      
    const promise =from(zipLoaded.loadAsync(fileList[0])).pipe(
      switchMap((zip: any):Observable<ZipFile[]> => {
        return of(Object.keys(zip.files).map((key)=>zip.files[key]))        
      })).toPromise();

    const filesPromise = await promise;      
    const files = filesPromise                          
                          .filter(f=>!(f.name.includes("__MACOSX")))                            
                          .filter(f=>!(f.name.includes(".DS_Store")))
                          .filter(f=>!f.dir)
                          .filter(f=>f.name.toLowerCase().endsWith(".xml"));                            
                            
    for (const file of files) {
        const responseXML= await this.leerArchivoXML(file);        
        console.log(responseXML);
        
    }
                                        

    
  }

}
