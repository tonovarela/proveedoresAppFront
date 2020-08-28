import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalSaldoCRPipe } from './total-saldo-cr.pipe';
import { NumFacturasCRPipe } from './num-facturas-cr.pipe';
import { SafePipe } from './safe.pipe';



@NgModule({
  declarations: [ TotalSaldoCRPipe, NumFacturasCRPipe, SafePipe],
  imports: [
    CommonModule
  ],
  exports:[TotalSaldoCRPipe, NumFacturasCRPipe,SafePipe]
})
export class PipesModule { }
