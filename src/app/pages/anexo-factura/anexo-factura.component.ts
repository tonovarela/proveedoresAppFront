import { UiService } from './../../services/ui.service';
import { Subscription, Observable, forkJoin, of } from 'rxjs';
import { ComunicadoService } from './../../services/comunicado.service';
import { Anexo, Contrarecibo, Movimiento, PagoAprobado } from './../../models/movimiento';
import { ModalUploadService } from './../../services/modal-upload.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnexoService } from 'src/app/services/anexo.service';
import { SubirArchivoService } from 'src/app/services/subir-archivo.service';
import { filter, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-anexo-factura',
  templateUrl: './anexo-factura.component.html',
  styleUrls: ['./anexo-factura.component.css']
})
export class AnexoFacturaComponent implements OnInit, OnDestroy {
  movimiento: Movimiento = null;
  subscriptionMovFile: Subscription;
  URL: string
  constructor(public activeRoute: ActivatedRoute,
    public router: Router,
    public _anexoService: AnexoService,
    public _comunicadoService: ComunicadoService,
    public _subirUsuarioService: SubirArchivoService,
    public _modalUploadService: ModalUploadService) { }




  ngOnInit(): void {
    this.URL = environment.URL_VALIDADORFILE;
    this._comunicadoService.verificarNotificacion.emit(true);

    this.subscriptionMovFile = this._subirUsuarioService.notificacion
      .pipe(filter((x: Movimiento) => x.tipo == "Factura-Ingreso"))
      .subscribe((mov: Movimiento) => {
        this.cargarAnexos();
      });


    this.activeRoute.params.subscribe((params: Params) => {
      const movimiento = this._anexoService.movimientoActual;
      if (params["id"] == undefined) {
        this.router.navigateByUrl("/facturas-emitidas");
        return;
      }
      if (movimiento == undefined) {
        this.router.navigateByUrl("/facturas-emitidas");
        return;
      }
      if (movimiento.movimientoID != params["id"]) {
        this.router.navigateByUrl("/facturas-emitidas");
        return
      }
      this.movimiento = this._anexoService.movimientoActual;
      this.cargarAnexos();
    });
  }


  ngOnDestroy(): void {
    this.subscriptionMovFile.unsubscribe();
  }


  regresar() {
    this.router.navigateByUrl("/facturas-emitidas");
  }

  borrarAnexo(anexo: Anexo) {
    this.movimiento.estaActualizando = true;
    this._anexoService.eliminarAnexo(anexo.id).subscribe(data => {      
      if (data["ok"]==true){      
        this._anexoService.borrarEvidenciaIntelisis(anexo).subscribe();
      }
      this.movimiento.estaActualizando = false;
      this.cargarAnexos();                   
    });

  }



  cargarAnexos() {
    this.movimiento.anexos = [];
    this.movimiento.estaActualizando = true;
    this._anexoService.ListarPorID(this.movimiento).subscribe(data => {
      if (data.total > 0) {
        this.movimiento.anexos = data.anexos;
      }
      this.movimiento.estaActualizando = false;
    });

  }



}
