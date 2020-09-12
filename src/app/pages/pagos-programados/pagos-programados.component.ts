import { ComunicadoService } from 'src/app/services/comunicado.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Grid, EditSettingsModel, PageSettingsModel, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { FechaDictionary } from '../../../app/utils/dates';

import { Anexo, PagoAprobado, Movimiento, Contrarecibo } from '../../../app/models/movimiento';


import { ModalUploadService } from '../../../app/services/modal-upload.service';
import { SubirArchivoService } from '../../../app/services/subir-archivo.service';
import { AnexoService } from 'src/app/services/anexo.service';
import { FacturaService } from '../../../app/services/factura.service';
import { UsuarioService } from '../../../app/services/usuario.service';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-pagos-programados',
  templateUrl: './pagos-programados.component.html',
  styleUrls: ['./pagos-programados.component.css']
})
export class PagosProgramadosComponent implements OnInit {
  @ViewChild('grid') grid: Grid;
  @ViewChild('detalle') detalle: any;
  gridInstance: Grid;
  subscription: Subscription;
  cargando: boolean = false;
  filtroCheck = false;
  editSettings: EditSettingsModel = { allowDeleting: false, allowEditing: false };
  pageSettings: PageSettingsModel = { pageSizes: true, pageCount: 10 };
  filterSettings: FilterSettingsModel = { type: "CheckBox" };
  filterMenu: FilterSettingsModel = { type: "Menu" };
  formatoptions = { type: 'dateTime', format: 'dd/MM/y' };
  selectOptions: any = {
    //persistSelection: true, type: "Multiple",
    //checkboxOnly: true 
  };

  public row: any;

  pagosProgramados: PagoAprobado[] = [];
  _pagoActual: PagoAprobado = null;
  _referencia: string = "";

  public fechaEmisionFilter: any;
  public fechaVencimientoFilter: any;
  public contenedorFiltroFechaEmision: any = null;
  public contenedorFiltroFechaVencimiento: any = null;
  public fecha: FechaDictionary = new FechaDictionary();


  constructor(private _facturaService: FacturaService,
    private _usuarioService: UsuarioService,
    private modalService: NgbModal,
    public _modalUploadService: ModalUploadService,
    public _subirArchivoService: SubirArchivoService,
    public _anexoService: AnexoService,
    private _comunicadoService:ComunicadoService
  ) { }


  ngOnInit(): void {
    this._comunicadoService.verificarNotificacion.emit(true);
    this.subscription = this._usuarioService
      .filtroGeneral
      .subscribe(x => {
        this.aplicarFiltroGeneral();
      });

    // this.subscriptionNotification = this._subirArchivoService.notificacion
    //   .pipe(filter((x: Movimiento) => x.tipo == "Pago"))
    //   .subscribe(mov => {        
    //     this.pagosProgramados.forEach(movimiento => {
    //       if (movimiento.movimientoID == mov.movimientoID){
    //         movimiento = mov;            
    //       }
            
    //     }
    //     );        
    //   })

    this.cargando = true;
    this._facturaService
      .obtenerPagosProgramados(this._usuarioService.usuario.Proveedor)
      .subscribe((pagos: PagoAprobado[]) => {
        this.pagosProgramados = pagos;
        this.pagosProgramados.forEach(x => {x.totalMovimientos = 0; x.anexos=[]});
        this.cargando = false;
      });    
  }


 


  aplicarFiltroGeneral() {
    if (this._usuarioService.filtroAplicar == null || this.grid == undefined) {
      return;
    }    
    if (this._usuarioService.filtroAplicar.modulo != "pagos-programados") {
      return;
    }
    const folio = this._usuarioService.filtroAplicar.folio;
    const referencia = this._usuarioService.filtroAplicar.referencia;
    this.grid.filterSettings.columns = [
      { "value": `${folio}`, "operator": "equal", "field": "folio", },
    ];
    this._pagoActual = this.pagosProgramados.find(x => x.folio == folio);
    if (this._pagoActual != undefined) {
      this.verDetalle(this._pagoActual, referencia);
    }
    this._usuarioService.filtroAplicar = null;
  }

  actionComplete(args) {
    if (args.requestType == "filterafteropen" && args.columnName == "fechaEmision") {

      args.filterModel.dlgObj.element.querySelector('.e-flm_optrdiv').hidden = true;
      const btn = (document.getElementsByClassName('e-primary e-flat')[0] as any);
      btn.hidden = true;
      this.contenedorFiltroFechaEmision = args.filterModel.dlgObj.element
        .querySelector('.e-flmenu-cancelbtn')
        .addEventListener('click', this.borrarFiltroFechaEmision.bind(this));
    }
  }

  verDetalle(mov: PagoAprobado, referencia?: string) {
    this._pagoActual = mov;
    this._referencia = referencia;
    this.modalService.open(this.detalle, { size: 'lg' });
  }

  borrarFiltroFechaEmision(event) {
    this.fechaEmisionFilter = null;
    this.grid.removeFilteredColsByField("fechaEmision");
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


  created(e) {
    this.aplicarFiltroGeneral();
    
  
  }

  



  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    // this.subscriptionNotification.unsubscribe();
  }

}
