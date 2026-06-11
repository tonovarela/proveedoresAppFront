import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoMes'
})
export class FormatoMesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
