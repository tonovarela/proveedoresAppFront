import { FacturaService } from './../../services/factura.service';
import { PdfMovimientosService } from './../../services/pdf-movimientos.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-contra-recibo',
  templateUrl: './detalle-contra-recibo.component.html',
  styleUrls: ['./detalle-contra-recibo.component.css']
})
export class DetalleContraReciboComponent implements OnInit {
  @Input('movimientos') _movimientos;
  constructor(private _pdfService:PdfMovimientosService) { }

  ngOnInit(): void {
    //console.log(this._movimientos);
  }

  pdfDetalle(){
    
     this._pdfService.obtenerDetalleContrarecibos(this._movimientos);
  }

}
