import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalSaldoCRPipe } from './total-saldo-cr.pipe';
import { NumFacturasCRPipe } from './num-facturas-cr.pipe';



@NgModule({
  declarations: [ TotalSaldoCRPipe, NumFacturasCRPipe],
  imports: [
    CommonModule
  ],
  exports:[TotalSaldoCRPipe, NumFacturasCRPipe]
})
export class PipesModule { }
