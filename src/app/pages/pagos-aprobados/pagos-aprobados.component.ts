import { Movimiento } from './../../models/movimiento';
import { FacturaService } from './../../services/factura.service';
import { PdfMovimientosService } from './../../services/pdf-movimientos.service';
import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-pagos-aprobados',
  templateUrl: './pagos-aprobados.component.html',
  styleUrls: ['./pagos-aprobados.component.css']
})
export class PagosAprobadosComponent implements OnInit {  
  constructor() { }

  ngOnInit(): void {
    
  }
  

}
