import { HttpClient } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { Movimiento, Contrarecibo } from './../models/movimiento';
import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LOGOLITO } from '../utils/logoLito';



pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfMovimientosService {


  constructor(public _currencyPipe: CurrencyPipe,
    public _datePipe: DatePipe,
    public _usuarioService: UsuarioService,    
  ) { }

  public obtenerDetalleContrarecibos(contraRecibo: Contrarecibo) {
    const docDefinition = {
      content: [
        LOGOLITO,
        {
          text: ` ${contraRecibo.movimientoDescripcion} `,
          bold: true,
          fontSize: 13,
          alignment: 'right',
          margin: [0, 0, 0, 10]
        },
        {
          text: `Fecha ${this._datePipe.transform(contraRecibo.fechaEmision, 'dd/MM/yyyy')} `,
          bold: true,
          fontSize: 11,
          alignment: 'right',

        },
        {
          text: `Recibimos de: ${this._usuarioService.usuario.Nombre}`,
          fontSize: 11,
          alignment: 'left',
          margin: [0, 0, 0, 10]
        },
        {
          text: `LOS SIGUIENTES DOCUMENTOS A REVISION`,
          bold: true,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        {
          columns: [
            {
              width: '100%',
              //layout: 'lightHorizontalLines',
              style: 'tablaMovimientos',
              table: {
                headerRows: 1,
                widths: [50, 70, 50, "*"],
                body: [
                  [
                    { text: 'Referencia', style: 'cabecera' },
                    { text: 'Fecha', style: 'cabecera' },
                    { text: 'Importe', style: 'cabecera' },
                    { text: 'Observaciones', style: 'cabecera' },
                  ],
                  ...contraRecibo.detalle.map(mov => {
                    return [
                      mov.referencia,
                      this._datePipe.transform(mov.fechaEmision, 'dd-MM-yyyy'),
                      this._currencyPipe.transform(mov.importe),
                      ''];
                  })
                ]
              }
            },
          ],
        },
        {
          text: `IMPORTE TOTAL :${this._currencyPipe.transform(contraRecibo.importe)} ${contraRecibo.moneda}`,
          fontSize: 11,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: `REVISION Y PAGOS : MIERCOLES DE 15 A 18 HRS`,
          bold: true,
          fontSize: 14,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          columns: [
            {
              text: `Vencimiento : ${this._datePipe.transform(contraRecibo.fechaVencimiento, 'dd-MM-yyyy')}`,
              bold: true,
              fontSize: 11,
              alignment: 'left',
              margin: [0, 0, 0, 20]
            },
            {
              text: `Firma: ______________________________________`,
              fontSize: 11,
              alignment: 'left',
              margin: [0, 0, 0, 20]
            },
          ]
        },
        {
          text: `Autorización:`,
          fontSize: 11,
          alignment: 'center',
          margin: [50, 0, 0, 20]
        },
      ],  
      styles: {
        tablaMovimientos: {
          fontSize: 9,
          margin: [0, 0, 0, 20],
        },
        cabecera: {
          fillColor: '#2f3d4a', color: "white"
        }
      },
    };
    pdfMake.createPdf(docDefinition).open();
  }
}
