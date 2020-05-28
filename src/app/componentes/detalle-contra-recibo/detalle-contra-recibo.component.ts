import { Movimiento } from './../../models/movimiento';
import { ExcelService } from './../../services/excel-service.service';
//import { FacturaService } from './../../services/factura.service';
import { PdfMovimientosService } from './../../services/pdf-movimientos.service';
import { Component, OnInit, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-detalle-contra-recibo',
  templateUrl: './detalle-contra-recibo.component.html',
  styleUrls: ['./detalle-contra-recibo.component.css']
})
export class DetalleContraReciboComponent implements OnInit {
  @Input('contraRecibo') _contraRecibo;
  constructor(private _pdfService: PdfMovimientosService,
              private _excelService: ExcelService,
              private _currencyPipe:CurrencyPipe,              
              ) { }

  ngOnInit(): void {
  }

  pdfDetalle() {
    this._pdfService.obtenerDetalleContrarecibos(this._contraRecibo);
  }
  excelDetalle() {
    const detalle = this._contraRecibo.detalle.map(mov => {
      return {
        folio: mov.folio,
        referencia: mov.referencia,
        fechaEmision: mov.fechaEmision,
        vencimiento: mov.fechaVencimiento,
        saldo: this._currencyPipe.transform(mov.saldo)
      }

    });
    this._excelService.exportAsExcelFile(detalle, "Detalle contra-recibo");
  }

}
