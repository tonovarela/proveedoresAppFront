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
    private renderer: Renderer2
    //private elementRef: ElementRef
  ) {
  }
  verDetalle(contrarecibo: Contrarecibo) {
    this._contraRecibo = contrarecibo;        
    this._facturaService.obtenerDetalleContraRecibo(contrarecibo.movimientoID).subscribe(
      (movs: Movimiento[]) => {
        this._contraRecibo.detalle = movs;
        this.modalService.open(this.detalle, { size: 'md' });      
      });
  }

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


  aplicarFiltroGeneral() {
     if (this._usuarioService.filtroAplicar==null || this.grid == undefined){
       return;
     }        
     const folio =this._usuarioService.filtroAplicar.folio;

      this.grid.filterSettings.columns = [
        { "value": `${folio}`, "operator": "equal", "field": "folio", },
      ];      
      this._usuarioService.filtroAplicar=null;
      this._contraRecibo= this.contraRecibos.find(x=>x.folio==folio);
      this.verDetalle(this._contraRecibo);
          
  }

 

  ngOnInit(): void {

    

    this.subscription = this._usuarioService.filtroGeneral.subscribe(x => {
      this.aplicarFiltroGeneral();
    });
    this.cargando = true;
    this._facturaService.obtenerContraRecibosPendientes(this._usuarioService.usuario.Proveedor)
      .subscribe(movs => {
        this.contraRecibos = movs;
        this.cargando = false;
      });
  }
  verPDF(contrarecibo: Contrarecibo) {  
  }

  created(e) {    
    this.aplicarFiltroGeneral();
    console.log("Se termino de cargar");

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();    
    //this.subscription.unsubscribe();
    console.log("Adios");
  }

}

