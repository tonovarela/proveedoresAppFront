import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { TotalSaldoCRPipe } from './../../pipes/total-saldo-cr.pipe';
import { UiService } from './../../services/ui.service';
import { SubirArchivoService } from './../../services/subir-archivo.service';
import { UsuarioService } from './../../services/usuario.service';
import { FacturaService } from './../../services/factura.service';
import { ModalUploadService } from './../../services/modal-upload.service';
import { Movimiento, MovCR, CR_Request, Contrarecibo, PagoAprobado, Anexo } from './../../models/movimiento';
import { Component, OnInit, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { L10n } from '@syncfusion/ej2-base'
import { EditSettingsModel, PageSettingsModel, FilterSettingsModel, Grid, IFilter, parentsUntil } from '@syncfusion/ej2-angular-grids';
import { setSpinner } from '@syncfusion/ej2-popups';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { FechaDictionary } from 'src/app/utils/dates';
import { filter } from 'rxjs/operators';
import { AnexoService } from 'src/app/services/anexo.service';



setSpinner({ template: '<div class="loader-centerd-screen"> <div>' });
@Component({
  selector: 'app-pendientes-cobro',
  templateUrl: './pendientes-cobro.component.html',
  styleUrls: ['./pendientes-cobro.component.css']
})

export class PendientesCobroComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: Grid;

   URL:string

  movimientosCR_$ = new EventEmitter<void>();
  subscripcionMovMoneda: Subscription;
  gridInstance: Grid;
  subscriptionMovFile: Subscription;
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

  monedasUnicas: boolean = true;
  movimientosDescripcionUnica = true;
  cumpleSaldoContrarecibo: boolean = true;
  movimientos: Movimiento[] = [];

 


  public fechaEmisionFilter: any;
  public fechaVencimientoFilter: any;
  public contenedorFiltroFechaEmision: any = null;
  public contenedorFiltroFechaVencimiento: any = null;
  public fecha: FechaDictionary = new FechaDictionary();


  constructor(
    private _router: Router,
    private _subirUsuarioService: SubirArchivoService,
    private _currencyPipe: CurrencyPipe,
    public _modalUploadService: ModalUploadService,
    private _facturaService: FacturaService,
    private _uiService: UiService,
    public _usuarioService: UsuarioService,
    public _anexoService: AnexoService
  ) {
  }

  ngOnInit(): void {
    this.URL = environment.URL_VALIDADORFILE;
    this._usuarioService.usuario.PuedeAnexarDocumento=false;
    this._usuarioService.usuario.PuedeGenerarContraRecibo=true;
    this.subscription = this._usuarioService
      .filtroGeneral
      .subscribe(x => {
        this.aplicarFiltroGeneral();
      });
    this.cargando = true;


    this.subscriptionMovFile = this._subirUsuarioService.notificacion
      .pipe(filter((x: Movimiento) => x.tipo == "Factura-Ingreso"))
      .subscribe((mov: Movimiento) => {
        this.movimientos.forEach(movimiento => {
          if (movimiento.movimientoID == mov.movimientoID)
            movimiento = mov;
            if (movimiento.estaActualizando){              
              movimiento.estaActualizando=false;
              this.cargarAnexos(movimiento);
            }     
        }
        );
      });

    this.subscripcionMovMoneda = this.movimientosCR_$.subscribe(() => {
      this.validarReglasContraRecibo();
    });
    this.cargaInfoPendientesCobro();
  }


  cargaInfoPendientesCobro() {
    
    this._facturaService
      .obtenerPendientesCobro(this._usuarioService.usuario.Proveedor)
      .subscribe(movs => {
        
        this.movimientos = movs;        
        this.movimientos.forEach(x => { x.anexos=[]});
        this.cargando = false;          
      });
  }


  created(e) {
    this.aplicarFiltroGeneral();

    this.grid.element.addEventListener("click", e => {       
      if (parentsUntil(e.target as Element, "e-detailrowexpand")) { 
     //collapsing all the expanding records using collapseAll method 
        //this.grid.detailRowModule.collapseAll(); 
        let row = parentsUntil(e.target as Element, "e-row"); 
        let rowIndex = parseInt(row.getAttribute("aria-rowindex"));         
        let movimiento=this.movimientos[rowIndex];
        this.cargarAnexos(movimiento);        
     // expanding the particular using expand method 
     this.grid.detailRowModule.expand(rowIndex);                                    
      } 
    }); 
  }


  aplicarFiltroGeneral() {
    if (this._usuarioService.filtroAplicar == null || this.grid == undefined) {
      return;
    }
    if (this._usuarioService
      .filtroAplicar
      .modulo != "pendientes-cobro") {
      return;
    }
    const folio = this._usuarioService
      .filtroAplicar
      .folio;
    this.grid.filterSettings.columns = [
      { "value": `${folio}`, "operator": "equal", "field": "folio", },
    ];
    this._usuarioService.filtroAplicar = null;

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


  
   irPagosAprobados(){
    this._router.navigateByUrl('pagos-aprobados');
   }

  validarReglasContraRecibo() {
    let movimientosPorGenerar = this.movimientos.filter(mov => mov.solicitaContraRecibo);
    if (!this.tieneMonedasUnicas()) {
      this.monedasUnicas = false;
      this._uiService.mostrarToasterWarning("Monedas",
        "Para generar contra-recibo se necesitan movimiento con el mismo tipo de moneda");
    } else {
      this.monedasUnicas = true;
    }
    if (!this.tieneMovimientosDescripcionUnica() && movimientosPorGenerar.length > 0) {
      this.movimientosDescripcionUnica = false;
      this._uiService.mostrarToasterWarning("Movimientos",
        "Para generar contra-recibo es necesario seleccionar movimientos del mismo tipo");
    } else {
      this.movimientosDescripcionUnica = true;
    }



    const maxContrarecibo: number = this._usuarioService.usuario.MontoMaxContraRecibo;
    const total: number = new TotalSaldoCRPipe().transform(movimientosPorGenerar, true);
    this.cumpleSaldoContrarecibo = total < maxContrarecibo
  }

  ngOnDestroy(): void {
    this.subscriptionMovFile.unsubscribe();
    this.subscripcionMovMoneda.unsubscribe();
    this.subscription.unsubscribe();
  }

  //Evento del checkbox
  cambio(mov: Movimiento) {
    this.movimientos.forEach(x => {
      if (x.movimientoID == mov.movimientoID) {
        x.solicitaContraRecibo = !mov.solicitaContraRecibo;
        this.movimientosCR_$.emit();
      }

    })
  }

  async generarContraRecibo() {

    if (!this.cumpleSaldoContrarecibo) {
      this._uiService.mostrarAlertaError("Cuota de contra-recibo excedido ",
        `Solo se puede generar contra-recibo con un total máximo de ${this._currencyPipe.transform(this._usuarioService.usuario.MontoMaxContraRecibo)} pesos`);
      return;
    }
    if (!this.monedasUnicas) {
      this._uiService.mostrarAlertaError("Monedas ",
        `Solo puede generar un contra-recibo con facturas con el mismo tipo de moneda`);
      return;
    }

    if (!this.movimientosDescripcionUnica) {
      this._uiService.mostrarAlertaError("Descripción movimientos ",
        `Para generar contrarecibo es necesario seleccionar movimientos del mismo tipo`);
      return;
    }
    const resultado = await this._uiService.mostrarAlertaConfirmacion("Confirmación",
      `Confirma generar el contrar-recibo de las facturas seleccionadas?`, 'Si, generar contrarecibo', 'No');
    if (!resultado.value)
      return

    this.cargando = true;
    //Movimientos para generar contrarecibo
    const movimientosPorGenerar = this.movimientos
      .filter(mov => mov.solicitaContraRecibo);
    const usuario = this._usuarioService.usuario;


    let movimientosRequest: MovCR[] = movimientosPorGenerar
      .map((m: Movimiento) => {
        return {
          folio: m.folio,
          referencia: m.referencia,
          importe: m.importe
        };
      });

    const request: CR_Request = {
      proveedor: usuario.Proveedor,
      movimientos: movimientosRequest,
      movimiento: movimientosPorGenerar[0].movimientoDescripcion
    };

    this.cargando = true;
    this._facturaService.generarContraRecibo(request).subscribe(x => {
      const data = x["data"];
      //this.cargando = false;
      this._uiService.mostrarAlertaSuccess("Listo", `Se ha generado el contrarecibo ${data[0]["MOVID"]}`);
      this.cargaInfoPendientesCobro();
    });

    // setTimeout(() => {
    //   this.cargando = false;


  }


  tieneMonedasUnicas() {
    let monedas = [];
    this.movimientos.forEach(x => {
      if (x.solicitaContraRecibo) {
        monedas.push(x.moneda);
      }
    });
    let unique = [...new Set(monedas)];

    return unique.length <= 1;
  }

  tieneMovimientosDescripcionUnica() {
    let movimientosPorGenerar = this.movimientos.filter(mov => mov.solicitaContraRecibo);
    let movsUnicos = new Set();
    const p = movimientosPorGenerar.forEach(x => {
      movsUnicos.add(x.movimientoDescripcion.trim());
    });
    return movsUnicos.size == 1;
  }


  cambiarMovimientosFiltro() {
    this.grid.getCurrentViewRecords().forEach((x: Movimiento) => {
      if (x.CR == true && x.tieneXML == true && x.tienePDF == true) {
        x.solicitaContraRecibo = !this.filtroCheck;
      }
    });
    this.movimientosCR_$.emit();
    this.grid.refresh();

  }


  cargarAnexos(movimiento:  Movimiento | Contrarecibo | PagoAprobado ){
    movimiento.anexos=[];     
        movimiento.estaActualizando=true;
            this._anexoService.ListarPorID(movimiento).subscribe(data=>{            
              if (data.total>0){
                movimiento.anexos=data.anexos;
              }                             
              movimiento.estaActualizando=false;
            });

  }

  borrarAnexo(anexo: Anexo,movimiento :Movimiento | Contrarecibo | PagoAprobado ){    
    movimiento.estaActualizando=true;
    this._anexoService.eliminarAnexo(anexo.id).subscribe(x=>{
      movimiento.estaActualizando=false;
      this.cargarAnexos(movimiento);
    });

  }


}
