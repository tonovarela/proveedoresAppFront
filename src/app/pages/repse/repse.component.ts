import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models';
import { ProveedorService } from 'src/app/services';

@Component({
  selector: 'app-repse',
  templateUrl: './repse.component.html',
  styleUrls: ['./repse.component.css']
})
export class RepseComponent implements OnInit, OnDestroy {

  usuario: Usuario = {};
  idSolicitud: string="123456797979";

  subscriptionNotificacion: Subscription;

  constructor(
    private _proveedorService: ProveedorService,
    private _router: Router
  ) { }

  ngOnDestroy(): void {
    if (this.subscriptionNotificacion) {
      this.subscriptionNotificacion.unsubscribe();
    }
  }

  ngOnInit(): void {
    if (this._proveedorService.usuario == null) {
      this._router.navigateByUrl("/listado");
      return;
    }
    this.usuario = this._proveedorService.usuario;
  }

  regresar() {
    this._router.navigateByUrl("/listado");
  }

}
