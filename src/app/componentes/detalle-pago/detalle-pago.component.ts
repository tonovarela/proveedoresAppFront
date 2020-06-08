import { PdfMovimientosService } from './../../services/pdf-movimientos.service';
import { PagoAprobado } from './../../models/movimiento';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-pago',
  templateUrl: './detalle-pago.component.html',
  styleUrls: ['./detalle-pago.component.css']
})
export class DetallePagoComponent implements OnInit {
  @Input('pago') _pago : PagoAprobado;
  constructor(private _pdfMovimientosService: PdfMovimientosService) { }

  ngOnInit(): void {
  }

  verPdf(){
    this._pdfMovimientosService.detallePago(this._pago);
    //console.log(this._pago);
  }

}
