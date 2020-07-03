import { filter } from 'rxjs/operators';
import { Movimiento, Contrarecibo } from './../../models/movimiento';
import { ExcelService } from './../../services/excel-service.service';
import { PdfMovimientosService } from './../../services/pdf-movimientos.service';
import { FacturaService } from './../../services/factura.service';
import { Component, OnInit, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';



@Component({
  selector: 'app-detalle-contra-recibo',
  templateUrl: './detalle-contra-recibo.component.html',
  styleUrls: ['./detalle-contra-recibo.component.css']
})
export class DetalleContraReciboComponent implements OnInit {
  @Input('contraRecibo') _contraRecibo: Contrarecibo;
  @Input('referencia') _referencia;
  cargando: boolean = false;
  total: number = 0;
  constructor(private _pdfService: PdfMovimientosService,
    private _facturaService: FacturaService,
    private _excelService: ExcelService,
    private _currencyPipe: CurrencyPipe,
  ) { }

  ngOnInit(): void {
    this.cargando = true;
    this._facturaService.obtenerDetalleContraRecibo(this._contraRecibo.movimientoID).subscribe(
      (movs: Movimiento[]) => {
        this.cargando = false;
        this._contraRecibo.detalle = movs;
        this._contraRecibo.detalle.forEach(x => {
          this.total += x.importe;
        });
        if (this._referencia != '') {
          const elemento = this._contraRecibo.detalle.filter(x => x.referencia == this._referencia);
          this._contraRecibo.detalle = this._contraRecibo.detalle.filter(x => x.referencia != this._referencia);
          this._contraRecibo.detalle.unshift(elemento[0]);

        }
      });



  }


  movimientoFiltrado(movimiento) {
    return movimiento.referencia == this._referencia ? 'movFiltrado' : '';
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
