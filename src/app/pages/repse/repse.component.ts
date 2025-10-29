import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OpinionCumplimiento, Usuario } from 'src/app/models';
import { ProveedorService,SubirArchivoService,UsuarioService,ModalUploadService } from 'src/app/services';


@Component({
  selector: 'app-repse',
  templateUrl: './repse.component.html',
  styleUrls: ['./repse.component.css']
})
export class RepseComponent implements OnInit ,OnDestroy{

  tipoArchivo:number=0;
  usuario: Usuario = {};
  historicoOpinionCumplimiento: OpinionCumplimiento[] = [];
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
    this.cargarHistoricoCumplimiento();
    this.subscriptionNotificacion = 
    this._subirArchivoService
     .notificacionSubirOpinionCumplimiento
     .subscribe(x => {
       this.cargarHistoricoCumplimiento();
     });
  }
  

  subirArchivo() {     
     this._proveedorService.tipoArchivo= this.tipoArchivo.toString();
     this._proveedorService.revisarArchivo="0";
     this._modalUploadSevice.mostrarModal("pdf", null);
  }


  regresar(){
    this._router.navigateByUrl("/listado");
  }

  cargarHistoricoCumplimiento() {
    const proveedor = this._proveedorService.usuario.Proveedor;
    this._usuarioService.obtenerHistorialOpinionCumplimiento(proveedor)
      .subscribe(data => {
        this.historicoOpinionCumplimiento = data.documentos;
      });
  }

}
