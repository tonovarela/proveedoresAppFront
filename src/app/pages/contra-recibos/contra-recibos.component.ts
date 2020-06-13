import { filter } from 'rxjs/operators';
import { PdfMovimientosService } from './../../services/pdf-movimientos.service';
import { UsuarioService } from './../../services/usuario.service';
import { FacturaService } from './../../services/factura.service';
import { ModalUploadService } from './../../services/modal-upload.service';
import { Contrarecibo, Movimiento } from './../../models/movimiento';
import { Component, OnInit, ViewChild, OnDestroy, TemplateRef, ElementRef, AfterViewInit, Renderer2, HostListener } from '@angular/core';
import { EditSettingsModel, PageSettingsModel, FilterSettingsModel, Grid, GridComponent } from '@syncfusion/ej2-angular-grids';
import { Subscription, fromEvent } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FechaDictionary } from 'src/app/utils/dates';
import { ActivatedRoute } from '@angular/router';




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
  filterSettings: FilterSettingsModel = { type: "CheckBox", };
  filterMenu: FilterSettingsModel = { type: "Menu", mode: "Immediate" };
  formatoptions = { type: 'dateTime', format: 'dd/MM/y' };
  selectOptions: any = {
    //persistSelection: true, type: "Multiple",
    //checkboxOnly: true 
  };
  contraRecibos: Contrarecibo[] = [];
  _contraRecibo: Contrarecibo = {};
  _referencia:string="";

  public fechaEmisionFilter: any;
  public fechaVencimientoFilter: any;
  public contenedorFiltroFechaEmision: any = null;
  public contenedorFiltroFechaVencimiento: any = null;
  public fecha: FechaDictionary = new FechaDictionary();

  constructor(
    public _modalUploadService: ModalUploadService,
    public _facturaService: FacturaService,
    private _usuarioService: UsuarioService,
    private modalService: NgbModal,
    private _pdfService: PdfMovimientosService,    
  ) {
  }



  ngOnInit(): void {
    this.subscription = this._usuarioService
      .filtroGeneral      
      .subscribe(x => {        
        this.aplicarFiltroGeneral();
      });
    this.cargando = true;
    this._facturaService.obtenerContraRecibosPendientes(this._usuarioService.usuario.Proveedor)
      .subscribe(movs => {
        this.contraRecibos = movs;
        this.cargando = false;
      });
  }

  verDetalle(contrarecibo: Contrarecibo, referencia?:string) {

    this._contraRecibo = contrarecibo;
    if (referencia!=undefined){
      this._referencia=referencia;
    }
    this.modalService.open(this.detalle, { size: 'md' });
    
  }


  
  aplicarFiltroGeneral() {
    if (this._usuarioService.filtroAplicar == null || this.grid == undefined        ) {
      return;
    }
    if (this._usuarioService.filtroAplicar.modulo!="contra-recibos") {
      return;
    }
    const folio = this._usuarioService.filtroAplicar.folio;
    this._referencia=this._usuarioService.filtroAplicar.referencia;
    
    this.grid.filterSettings.columns = [
      { "value": `${folio}`, "operator": "equal", "field": "folio", },
    ];      
    this._contraRecibo = this.contraRecibos.find(x => x.folio == folio);    
    
    this.verDetalle(this._contraRecibo,this._referencia);
    this._usuarioService.filtroAplicar = null;
    //this._referencia='';
  }

  // verPDF(contrarecibo: Contrarecibo) {
  // }
  created(e) {
    this.aplicarFiltroGeneral();    
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();    
    
  }



  //#region funciones de Filtado Grid
  actionComplete(args) {
    if (args.requestType == "filterafteropen" && args.columnName == "fechaEmision") {
      args.filterModel.dlgObj.element.querySelector('.e-flm_optrdiv').hidden = true;
      const btn = (document.getElementsByClassName('e-primary e-flat')[0] as any);
      btn.hidden = true;
      this.contenedorFiltroFechaEmision = args.filterModel.dlgObj.element
        //this.elementRef.nativeElement
        .querySelector('.e-flmenu-cancelbtn')
        .addEventListener('click', this.borrarFiltroFechaEmision.bind(this));
    }
    if (args.requestType == "filterafteropen" && args.columnName == "fechaVencimiento") {
      args.filterModel.dlgObj.element.querySelector('.e-flm_optrdiv').hidden = true;
      const btn = (document.getElementsByClassName('e-primary e-flat')[0] as any);
      btn.hidden = true;
      this.contenedorFiltroFechaVencimiento = args.filterModel.dlgObj.element
        //this.elementRef.nativeElement        
        .querySelector('.e-flmenu-cancelbtn')
        .addEventListener('click', this.borrarFiltroFechaVencimiento.bind(this));
    }
  }

  borrarFiltroFechaEmision(event) {
    this.fechaEmisionFilter = null;
    this.grid.removeFilteredColsByField("fechaEmision");
  }
  borrarFiltroFechaVencimiento(event) {
    this.fechaVencimientoFilter = null;
    this.grid.removeFilteredColsByField("fechaVencimiento");
  }

  cambioFechaVencimiento(e) {
    if (e.value) {
      this.grid.filterSettings.columns = [
        { "value": e.value[0], "operator": "greaterthanorequal", "field": "fechaVencimiento", "predicate": "and" },
        { "value": e.value[1], "operator": "lessthanorequal", "field": "fechaVencimiento", "predicate": "and" }
      ]
    }
    else {

      this.grid.filterSettings.columns = [];
      //this.grid.removeFilteredColsByField("fechaVencimiento");
    }
  }


  cambioFechaEmision(e) {
    if (e.value) {
      this.grid.filterSettings.columns = [
        { "value": e.value[0], "operator": "greaterthanorequal", "field": "fechaEmision", "predicate": "and" },
        { "value": e.value[1], "operator": "lessthanorequal", "field": "fechaEmision", "predicate": "and" }
      ]
    }
    else {
      this.grid.filterSettings.columns = [];
      //this.grid.removeFilteredColsByField("fechaEmision");
    }
  }
 //#endregion

}

