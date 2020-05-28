import { PdfMovimientosService } from './../../services/pdf-movimientos.service';

import { UsuarioService } from './../../services/usuario.service';
import { FacturaService } from './../../services/factura.service';
import { ModalUploadService } from './../../services/modal-upload.service';
import { Contrarecibo, Movimiento } from './../../models/movimiento';
import { traduccion } from './../../i18n/es-MX';
import { Component, OnInit, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import { L10n } from '@syncfusion/ej2-base'
import { EditSettingsModel, PageSettingsModel, FilterSettingsModel, Grid } from '@syncfusion/ej2-angular-grids';
//import * as moment from 'moment';
import { Subscription } from 'rxjs';
//import { BsModalService } from 'ngx-bootstrap/modal';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


L10n.load(traduccion);
@Component({
  selector: 'app-contra-recibos',
  templateUrl: './contra-recibos.component.html',
  styleUrls: ['./contra-recibos.component.css']
})
export class ContraRecibosComponent implements OnInit, OnDestroy {
  @ViewChild('grid') grid: Grid;
  @ViewChild('detalle') detalle: any;
  gridInstance: Grid;
  subscription: Subscription;
  cargando: boolean = false;
  editSettings: EditSettingsModel = { allowDeleting: false, allowEditing: false };
  pageSettings: PageSettingsModel = { pageSizes: true, pageCount: 10 };
  filterSettings: FilterSettingsModel = { type: "CheckBox" };
  filterMenu: FilterSettingsModel = { type: "Menu" };
  formatoptions = { type: 'dateTime', format: 'dd/MM/y' };
  selectOptions: any = {
    //persistSelection: true, type: "Multiple",
    //checkboxOnly: true 
  };
  contraRecibos: Contrarecibo[] = [];
  _contraRecibo: Contrarecibo = {};

  constructor(
    public _modalUploadService: ModalUploadService,
    public _facturaService: FacturaService,
    private _usuarioService: UsuarioService,
    private modalService: NgbModal,
    private _pdfService: PdfMovimientosService
  ) { }



  verDetalle(contrarecibo: Contrarecibo) {
    this._contraRecibo = contrarecibo;
    //this._contraRecibo.detalle= this._facturaService.obtenerMovimientosFicticios('Pesos',2);
    //this.modalService.open(this.detalle, { size: 'lg' });      
    this.cargando=true;
    this._facturaService.obtenerDetalleContraRecibo(contrarecibo.movimientoID).subscribe(
      (movs: Movimiento[]) => {
        this._contraRecibo.detalle=movs;
        console.log(this._contraRecibo.detalle);
        this.modalService.open(this.detalle, { size: 'md' });      
        this.cargando=false;
      });
  }


  ngOnInit(): void {

    this._facturaService.obtenerContraRecibosPendientes(this._usuarioService.usuario.Proveedor)
      .subscribe(movs => {
        this.contraRecibos = movs;
      });
  }

  verPDF(contrarecibo: Contrarecibo){
    // this.cargando=true;
    // this._contraRecibo = contrarecibo;
    // this._facturaService.obtenerDetalleContraRecibo(contrarecibo.movimientoID).subscribe(
    //   (movs: Movimiento[]) => {
    //     this._contraRecibo.detalle=movs;                
    //     this._pdfService.obtenerDetalleContrarecibos(this._contraRecibo);
    //     this.cargando=false;
    //   });   
  }

  created(e) {
    this.grid.showSpinner();
  }
  ngOnDestroy(): void {
    //this.subscription.unsubscribe();
  }

}
