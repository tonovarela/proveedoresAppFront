import { Movimiento, Contrarecibo, PagoAprobado } from './../../models/movimiento';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-totales',
  templateUrl: './totales.component.html',
  styleUrls: ['./totales.component.css']
})
export class TotalesComponent implements OnInit {

  @Input('movimientos') _movimientos: Movimiento[] | Contrarecibo[] | PagoAprobado[];
  totalPesos: number;
  totalOtraMoneda: number;

  constructor() { }

  ngOnInit(): void {
    this.totalPesos = 0;
    this.totalOtraMoneda = 0;
    this._movimientos.forEach((x: Movimiento) => {
      if (x.moneda.trim().toLowerCase() == "pesos") {
        this.totalPesos += x.importe;
      } else {
        this.totalOtraMoneda += x.importe;
      }
    });


  }

}
