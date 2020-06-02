import { PdfMovimientosService } from './../../services/pdf-movimientos.service';
import { UsuarioService } from './../../services/usuario.service';
import { FacturaService } from './../../services/factura.service';
import { ModalUploadService } from './../../services/modal-upload.service';
import { Contrarecibo, Movimiento } from './../../models/movimiento';
import { traduccion } from './../../i18n/es-MX';
import { Component, OnInit, ViewChild, OnDestroy, TemplateRef, ElementRef } from '@angular/core';
import { L10n } from '@syncfusion/ej2-base'
import { EditSettingsModel, PageSettingsModel, FilterSettingsModel, Grid, IFilter, Filter, GridComponent } from '@syncfusion/ej2-angular-grids';
//import * as moment from 'moment';
import { Subscription } from 'rxjs';
//import { BsModalService } from 'ngx-bootstrap/modal';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DateRangePicker } from '@syncfusion/ej2-angular-calendars';
import { DataManager, DataUtil } from "@syncfusion/ej2-data";
import { createElement } from '@syncfusion/ej2-base';



L10n.load(traduccion);
@Component({
  selector: 'app-contra-recibos',
  templateUrl: './contra-recibos.component.html',
  styleUrls: ['./contra-recibos.component.css']
})
export class ContraRecibosComponent implements OnInit, OnDestroy {
  @ViewChild('grid') grid: GridComponent;
  @ViewChild('detalle') detalle: any;
  gridInstance: Grid;
  subscription: Subscription;
  cargando: boolean = false;
  editSettings: EditSettingsModel = { allowDeleting: false, allowEditing: false };
  pageSettings: PageSettingsModel = { pageSizes: true, pageCount: 10 };
  filterSettings: FilterSettingsModel = { type: "Menu", };
  filterMenu: FilterSettingsModel = { type: "Menu", mode: "Immediate" };
  formatoptions = { type: 'dateTime', format: 'dd/MM/y' };
  selectOptions: any = {
    //persistSelection: true, type: "Multiple",
    //checkboxOnly: true 
  };
  contraRecibos: Contrarecibo[] = [];
  _contraRecibo: Contrarecibo = {};


  public menu: any;
  //public templateOptions: IFilter;
  public fechaEmisionFilter: DateRangePicker;
  public contenedorFiltroFechaEmision: any =null;



  constructor(
    public _modalUploadService: ModalUploadService,
    public _facturaService: FacturaService,
    private _usuarioService: UsuarioService,
    private modalService: NgbModal,
    private _pdfService: PdfMovimientosService,
    private elementRef: ElementRef
  ) { }






  verDetalle(contrarecibo: Contrarecibo) {
    this._contraRecibo = contrarecibo;
    //this._contraRecibo.detalle= this._facturaService.obtenerMovimientosFicticios('Pesos',2);
    //this.modalService.open(this.detalle, { size: 'lg' });      
    this.cargando = true;
    this._facturaService.obtenerDetalleContraRecibo(contrarecibo.movimientoID).subscribe(
      (movs: Movimiento[]) => {
        this._contraRecibo.detalle = movs;
        //console.log(this._contraRecibo.detalle);
        this.modalService.open(this.detalle, { size: 'md' });
        this.cargando = false;
      });
  }


  actionComplete(args) {
    if (args.requestType == "filterafteropen" && args.columnName == "fechaEmision") {
      args.filterModel.dlgObj.element.querySelector('.e-flm_optrdiv').hidden = true;      
        this.contenedorFiltroFechaEmision = this.elementRef.nativeElement;        
        this.contenedorFiltroFechaEmision.querySelector('.e-flmenu-cancelbtn')
                                            .addEventListener('click', this.borrarFiltroFechaEmision.bind(this, "fechaEmision"));      
    }
  }

  borrarFiltroFechaEmision(event) {        
    this.fechaEmisionFilter = null;
  }

  cambiarFecha(e) {    
    if (e.value) {      
      this.grid.filterSettings.columns = [
        { "value": e.value[0], "operator": "greaterthanorequal", "field": 'fechaEmision', "predicate": "and" },
        { "value": e.value[1], "operator": "lessthanorequal", "field": 'fechaEmision', "predicate": "and" }
      ]
    }
    else {
      //
      this.grid.filterSettings.columns = [];
      this.grid.removeFilteredColsByField("fechaEmision");
    }

  }




  ngOnInit(): void {



    this.cargando = true;
    this._facturaService.obtenerContraRecibosPendientes(this._usuarioService.usuario.Proveedor)
      .subscribe(movs => {
        this.contraRecibos = movs;
        this.cargando = false;
      });
  }
  verPDF(contrarecibo: Contrarecibo) {
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

