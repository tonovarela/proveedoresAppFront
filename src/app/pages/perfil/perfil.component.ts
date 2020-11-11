import { Subscription } from 'rxjs';
import { OpinionCumplimiento } from './../../models/opinion_cumplimiento';
import { ModalUploadService } from './../../services/modal-upload.service';
import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from 'src/app/models/proveedor';
import { SubirArchivoService } from 'src/app/services/subir-archivo.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit, OnDestroy {
  usuario: Usuario = {};
  historicoOpinionCumplimiento: OpinionCumplimiento[] = [];
  subscriptionNotificacion: Subscription;
  constructor(private _usuarioService: UsuarioService,
    private _subirArchivoService: SubirArchivoService,
    public _modalUploadService: ModalUploadService) { }


  ngOnInit(): void {
    this.usuario = this._usuarioService.usuario;
    this.cargarHistoricoCumplimiento();
    this.subscriptionNotificacion = this._subirArchivoService
      .notificacionSubirOpinionCumplimiento
      .subscribe(x => {
        this.cargarHistoricoCumplimiento();
      });

  }
  cargarHistoricoCumplimiento() {
    this._usuarioService.obtenerHistorialOpinionCumplimiento()
      .subscribe(data => {
        this.historicoOpinionCumplimiento = data.documentos;
      });
  }

  subirArchivo() {
    this._modalUploadService.mostrarModal("pdf", null);
  }

  ngOnDestroy(): void {
    this.subscriptionNotificacion.unsubscribe();
  }


}
