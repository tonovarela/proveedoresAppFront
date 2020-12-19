import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {

  transform(fecha:Date): string {    
     let mes=moment(fecha).locale('es').format('MMMM');
    return `${moment(fecha).format('D')} ${mes[0].toUpperCase()+mes.slice(1)} ${moment(fecha).format('yyyy')}`;
  }

}
