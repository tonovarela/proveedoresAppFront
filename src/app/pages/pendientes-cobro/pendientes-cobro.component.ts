import { TotalSaldoCRPipe } from './../../pipes/total-saldo-cr.pipe';
import { UiService } from './../../services/ui.service';
import { SubirArchivoService } from './../../services/subir-archivo.service';
import { UsuarioService } from './../../services/usuario.service';
import { FacturaService } from './../../services/factura.service';
import { ModalUploadService } from './../../services/modal-upload.service';
import { Movimiento } from './../../models/movimiento';
import { traduccion } from './../../i18n/es-MX';
import { Component, OnInit, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { L10n } from '@syncfusion/ej2-base'
import { SaamService } from 'src/app/services/saam.service';
import { EditSettingsModel, PageSettingsModel, FilterSettingsModel, Grid } from '@syncfusion/ej2-angular-grids';
import { setSpinner } from '@syncfusion/ej2-popups';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { timeInterval, map, filter } from 'rxjs/operators';
setSpinner({ template: '<div class="loader-centerd-screen"> <div></div></div>' });
L10n.load(traduccion);
//declare function iniciar_pluginCheck();
@Component({
  selector: 'app-pendientes-cobro',
  templateUrl: './pendientes-cobro.component.html',
  styleUrls: ['./pendientes-cobro.component.css']
})

export class PendientesCobroComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: Grid;

  movimientosCR_$ = new EventEmitter<void>();
  subscripcionMovMoneda: Subscription;

  gridInstance: Grid;
  subscriptionMovFile: Subscription;
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

  movimientos: Movimiento[] = [];
  constructor(
    private _subirUsuarioService: SubirArchivoService,
    public _modalUploadService: ModalUploadService,
    private _facturaService: FacturaService,
    private _uiService: UiService,
    public _usuarioService: UsuarioService
  ) {
  }

  ngOnInit(): void {

    this.subscriptionMovFile = this._subirUsuarioService.notificacion.subscribe((mov: Movimiento) => {
      let _movimientos = this.movimientos.filter(movimiento => movimiento.movimientoID != mov.movimientoID);
      _movimientos.unshift(mov);
      this.movimientos = _movimientos;
    });
    this.subscripcionMovMoneda = this.movimientosCR_$.subscribe(() => {
      if (!this.tieneMonedasUnicas()) {
        this._uiService.mostrarToasterWarning("Monedas",
          "Para generar contrarecibo se necesitan movimiento con el mismo tipo de moneda");
      }
    });

    this._facturaService.obtenerPendientesCobro(this._usuarioService.usuario.Proveedor).subscribe(movs => {
      this.movimientos = movs;
      this.movimientos=this.movimientos.concat(this._facturaService.obtenerMovimientosFicticios("Pesos",5));
      this.movimientos=this.movimientos.concat(this._facturaService.obtenerMovimientosFicticios("Dolares",1));      
    });
  }

  ngOnDestroy(): void {
    this.subscriptionMovFile.unsubscribe();
    this.subscripcionMovMoneda.unsubscribe();

  }



  cambio(mov: Movimiento) {

    this.movimientos.forEach(x => {
      if (x.movimientoID == mov.movimientoID) {
        x.solicitaContraRecibo = !mov.solicitaContraRecibo;
        this.movimientosCR_$.emit();
      }

    })
  }




  async generarContraRecibo() {
    let movimientosPorGenerar = this.movimientos.filter(mov => mov.solicitaContraRecibo);
    const maxContrarecibo: number = this._usuarioService.usuario.MontoMaxContraRecibo;
    const total: number = new TotalSaldoCRPipe().transform(movimientosPorGenerar);
    if (total > maxContrarecibo) {
      this._uiService.mostrarAlertaError("Cuota de contra-recibo excedido ",
        `Solo se puede generar contra-recibo con un máximo de ${maxContrarecibo}`);
      return;
    }
    if (!this.tieneMonedasUnicas()) {
      this._uiService.mostrarAlertaError("Monedas ",
        `Solo puede generar un contra-recibo con facturas con el mismo tipo de moneda`);
      return;
    }
    const resultado = await this._uiService.mostrarAlertaConfirmacion("Confirmación",
      `Confirma generar el contrar-recibo de las facturas seleccionadas?`);
    if (!resultado.value)
      return

    this.cargando = true;

    setTimeout(() => {
      this.cargando = false;
      this._uiService.mostrarAlertaSuccess("Listo",
        "Se ha generado el contrarecibo");
    }, 3000);
  }


  public tieneMonedasUnicas() {
    let monedas = [];
    this.movimientos.forEach(x => {
      if (x.solicitaContraRecibo) {
        monedas.push(x.moneda);
      }
    });
    let unique = [...new Set(monedas)];

    return unique.length <= 1;
  }

  cambiarMovimientosFiltro() {
    this.grid.getCurrentViewRecords().forEach((x: Movimiento) => {
      if (x.tienePDF && x.tieneXML) {
        x.solicitaContraRecibo = !this.filtroCheck;
      }
    });
    this.movimientosCR_$.emit();
    this.grid.refresh();

  }

  // agregarMovimientosFicticios(moneda, total) {
  //   for (let i = moneda == "Pesos" ? total : 0; i < (moneda == "Pesos" ? total : 0) + total; i++) {
  //     this.movimientos.unshift({
  //       folio: (i + 1),
  //       solicitaContraRecibo: false,
  //       movimientoID: (i + 1),
  //       movimientoDescripcion: "Movimiento Ficticio ",
  //       referencia: "5989791",
  //       moneda: moneda,
  //       saldo: Math.random() * (10000 - 50 + 1) + 50,
  //       tienePDF: true,
  //       tieneXML: true,
  //       fechaEmision: moment('2020-01-05').toDate(),
  //       fechaVencimiento: moment('2020-01-05').toDate()
  //     });
  //   }
  // }



}
