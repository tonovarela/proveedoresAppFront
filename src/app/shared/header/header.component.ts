import { FacturaService } from './../../services/factura.service';
import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { of, Subscription, fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { filter, groupBy, mergeMap, toArray, map, concatMap, tap } from 'rxjs/operators';



import { Factura } from 'src/app/models/movimiento';
import { FilteringEventArgs, } from '@syncfusion/ej2-angular-dropdowns';


declare function cerrarBusqueda();
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  moduloActivo: string;
  cargandoFacturas: boolean = true;
  facturas: Factura[] = [];
  facturasFiltradas: Factura[] = [];
  private subscription: Subscription;



  constructor(
    private _router: Router,
    public _usuarioService: UsuarioService,
    private router: Router,
    private facturaService: FacturaService,
    @Inject(DOCUMENT) private document: Document
  ) { 

    this.subscription = this.getDataRoute().subscribe(data => {
      this.moduloActivo = data.modulo;      
      this.filtrarFacturas();      
      //console.log(this.facturasFiltradas);
      
    });

  }



  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  filtrarFacturas(facturas?:Factura[]) {

    if (facturas!=undefined){
      this.facturasFiltradas = facturas.filter(x => x.modulo == this.moduloActivo);
    }else{
      this.facturasFiltradas = this.facturas.filter(x => x.modulo == this.moduloActivo);
    }
    
  }

  ngOnInit(): void {
    const proovedor = this._usuarioService.usuario.Proveedor.trim();
    this.cargandoFacturas = true;

    this.facturaService
      .obtenerFacturas(proovedor)
      .subscribe((x: Factura[]) => {
        this.facturas = x;        
         this.filtrarFacturas(x);
        this.cargandoFacturas = false;
      });


    


    fromEvent(this.document, 'keyup')
      .pipe(filter(x => x["keyCode"] == 27))
      .subscribe(x => {
        cerrarBusqueda();
      })
  }

  public fields: Object = { value: 'referencia' };
  public value: string = '';



  public onFiltering(e: FilteringEventArgs) {


  }

  buscar(mov?) {

    if (mov != undefined) {
      this.value = mov.referencia;
    }
    const r = this.facturasFiltradas.filter(x => x.referencia == this.value);
    if (r.length > 0) {
      cerrarBusqueda();
      const factura = r[0];
      this._usuarioService.filtroAplicar = factura;
      this._usuarioService.filtroGeneral.emit(true)
      this.router.navigateByUrl(factura.modulo);
    }
    //this.value = "";
  }


  nuevaBusqueda() {
    this.value = "";
  }

  cierraBusqueda() {
    //this.value = "";
  }


  getDataRoute() {
    return this._router.events.pipe(
      filter(event => {
        return event instanceof ActivationEnd && event.snapshot.firstChild === null;
      }),
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }


}
