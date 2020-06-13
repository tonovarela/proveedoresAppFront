import { FacturaService } from './../../services/factura.service';
import { PdfMovimientosService } from './../../services/pdf-movimientos.service';
import { PagoAprobado, PagoDetalle } from './../../models/movimiento';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-pago',
  templateUrl: './detalle-pago.component.html',
  styleUrls: ['./detalle-pago.component.css']
})
export class DetallePagoComponent implements OnInit {
  @Input('pago') _pago : PagoAprobado;
  @Input('referencia') _referencia : PagoAprobado;
  total:number =0;
  cargando: boolean=false;
  constructor(private _pdfMovimientosService: PdfMovimientosService,
              private _facturaService:FacturaService) { }

  ngOnInit(): void {
    this.cargando=true;
    this._facturaService.obtenerDetallePagoAprobado(this._pago.folio).subscribe(
      (movs: PagoDetalle[]) => {        
        this._pago.detalle=movs; 
        this._pago.detalle.forEach(x=>{          
          this.total+=x.importe;
        });         
        this.cargando=false;
        if (this._referencia!='') {          
          const elemento =this._pago.detalle.filter(x => x.factura == this._referencia);
          this._pago.detalle = this._pago.detalle.filter(x => x.factura != this._referencia);
          this._pago.detalle.unshift(elemento[0]);
        }
        //this.cargando = false;
      });

    
  }

  movimientoFiltrado(movimiento){       
    return movimiento.factura==this._referencia?'movFiltrado':'';        
  }


  verPdf(){
    this._pdfMovimientosService.detallePago(this._pago);
    //console.log(this._pago);
  }

}
