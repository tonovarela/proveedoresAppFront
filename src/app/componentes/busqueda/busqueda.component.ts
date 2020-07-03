import { Component, OnInit, OnDestroy, Input, AfterViewInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Factura } from 'src/app/models/movimiento';
import { Router, ActivationEnd } from '@angular/router';
import { map, filter, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FacturaService } from 'src/app/services/factura.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input('moduloActivo') moduloActivo: string;
  cargandoFacturas: boolean = true;
  facturas: Factura[] = [];
  facturasFiltradas: Factura[] = [];
  //private subscription: Subscription;
  public fields: Object = { value: 'referencia' };
  public value: string = '';

  constructor(public _router: Router,
    private cdRef: ChangeDetectorRef,
    private facturaService: FacturaService,
    public _usuarioService: UsuarioService) {



  }
  ngAfterViewInit() {

    // ...
  }



  ngOnInit(): void {

    const proovedor = this._usuarioService.usuario.Proveedor.trim();
    this.cargandoFacturas = true;
    this.value = "";
    this.facturaService
      .obtenerFacturas(proovedor)
      .subscribe((x: Factura[]) => {
        this.facturas = x;
        this.filtrarFacturas();
        this.cargandoFacturas = false;
      });

  }


  



  buscar(mov?) {

    let parametro = "";
    if (mov != undefined) {
      parametro = mov.referencia;
    } else {
      parametro = this.value;
    }    
    const r = this.facturasFiltradas.filter(x => x.referencia == parametro);
    if (r.length > 0) {    
      const factura = r[0];
      this._usuarioService.filtroAplicar = factura;
      this._usuarioService.filtroGeneral.emit(true)
      // //  this._router.navigateByUrl(factura.modulo);
    }    



  }


  ngOnDestroy(): void {
    //this.subscription.unsubscribe();
  }







  filtrarFacturas() {

    // if (facturas != undefined) {
    //   this.facturasFiltradas = facturas.filter(x => x.modulo == this.moduloActivo);
    // } else {
    this.facturasFiltradas = this.facturas.filter(x => x.modulo == this.moduloActivo);


    //console.log(this.facturasFiltradas);


  }

}
