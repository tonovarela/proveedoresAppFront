import { FacturaService } from './../../services/factura.service';
import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { map, filter } from 'rxjs/operators';

import { Query, DataManager,Predicate } from '@syncfusion/ej2-data';
import { Factura } from 'src/app/models/movimiento';


declare function cerrarBusqueda();
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
   

  query:Query  ;
  facturas:Factura[]=[];
  constructor(public _usuarioService: UsuarioService,
    private router: Router,
    private facturaService:FacturaService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    const proovedor =this._usuarioService.usuario.Proveedor.trim();
    this.facturaService
                      .obtenerFacturas(proovedor)
                      .subscribe((x:Factura[])=>{
                        this.facturas=x;
                        console.log(x);
                      });
    fromEvent(this.document, 'keyup')
    .pipe(filter(x =>  x["keyCode"]==27))
      .subscribe(x => {
        cerrarBusqueda();        
      })
  }


  public fields: Object = { value: 'referencia'};
  public value: string = '';
  
 

  // public onFiltering (e)
  // {
  //    console.log(e.text);
  //   // //e.preventDefaultAction=true;
  //   //        var predicate = new Predicate('factura', 'contains', e.text);
  //   //            predicate = predicate.or('folio', 'contains', e.text);
  //   //         var query = new Query();
  //   //     //frame the query based on search string with filter type.
  //   //       query = (e.text != "") ? query.where(predicate) : query;
  //   //     //pass the filter data source, filter query to updateData method.        
        
  //   //      e.updateData(this.registros, query);
  // }

  buscar() {
    const r = this.facturas.filter(x => x.referencia == this.value);
    this.value = "";
    if (r.length > 0) {
      cerrarBusqueda();
      const factura=r[0];      
      this._usuarioService.filtroAplicar = factura;
      this._usuarioService.filtroGeneral.emit(true)      
      this.router.navigateByUrl(factura.modulo);
    }
  }


  nuevaBusqueda() {
    this.value = "RR";
  }

  cierraBusqueda() {    
    this.value = "RR";
  }



}
