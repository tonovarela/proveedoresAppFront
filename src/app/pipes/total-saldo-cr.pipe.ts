import { Pipe, PipeTransform } from '@angular/core';
import { Movimiento } from '../models/movimiento';

@Pipe({
  name: 'totalSaldoCR',
  pure:false
})
export class TotalSaldoCRPipe implements PipeTransform {

  transform(movimientos: Movimiento[]): number {
    let total = 0;
    movimientos.forEach(mov => {
      if (mov.solicitaContraRecibo)
        total += mov.saldo;
    });
    return total;
  }

}
