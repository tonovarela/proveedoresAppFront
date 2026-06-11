import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalSaldoCRPipe } from './total-saldo-cr.pipe';
import { NumFacturasCRPipe } from './num-facturas-cr.pipe';
import { SafePipe } from './safe.pipe';
import { FechaPipe } from './fecha.pipe';
import { FormatoMesPipe } from './formato-mes.pipe';



@NgModule({
  declarations: [ TotalSaldoCRPipe, NumFacturasCRPipe, SafePipe, FechaPipe, FormatoMesPipe],
  imports: [
    CommonModule
  ],
  exports:[TotalSaldoCRPipe, NumFacturasCRPipe,SafePipe,FechaPipe]
})
export class PipesModule { }
