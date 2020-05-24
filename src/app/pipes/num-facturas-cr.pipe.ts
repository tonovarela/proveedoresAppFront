import { Pipe, PipeTransform } from '@angular/core';
import { Movimiento } from '../models/movimiento';

@Pipe({
  name: 'numFacturasCR',
  pure:false
})
export class NumFacturasCRPipe implements PipeTransform {

  transform(movimientos: Movimiento[]): number {    
    return movimientos.filter(mov => mov.solicitaContraRecibo).length;
    
  }
}
