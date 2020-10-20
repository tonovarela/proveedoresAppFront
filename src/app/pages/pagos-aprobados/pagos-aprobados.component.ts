
import { UsuarioService } from './../../services/usuario.service';
import { FacturaService } from './../../services/factura.service';
import { ModalUploadService } from './../../services/modal-upload.service';
import { ComunicadoService } from './../../services/comunicado.service';
import { SubirArchivoService } from './../../services/subir-archivo.service';

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Grid, EditSettingsModel, PageSettingsModel, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FechaDictionary } from 'src/app/utils/dates';
import { Subscription } from 'rxjs';

import { filter } from 'rxjs/operators';


import { Movimiento, Contrarecibo, PagoAprobado, PagoDetalle, Anexo } from './../../models/movimiento';



@Component({
  selector: 'app-pagos-aprobados',
  templateUrl: './pagos-aprobados.component.html',
  styleUrls: ['./pagos-aprobados.component.css']
})
export class PagosAprobadosComponent implements OnInit, OnDestroy {


  @ViewChild('grid') grid: Grid;
  @ViewChild('detalle') detalle: any;
  gridInstance: Grid;
  subscription: Subscription;
  subscriptionNotification: Subscription;
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

  pagosAprobados: PagoAprobado[] = [];
  _pagoActual: PagoAprobado = null;
  _referencia: string = "";

  public fechaEmisionFilter: any;
  public fechaVencimientoFilter: any;
  public contenedorFiltroFechaEmision: any = null;
  public contenedorFiltroFechaVencimiento: any = null;
  public fecha: FechaDictionary = new FechaDictionary();


  constructor(private _facturaService: FacturaService,
    public _usuarioService: UsuarioService,
    private modalService: NgbModal,
    public _modalUploadService: ModalUploadService,
    public _subirArchivoService: SubirArchivoService,  
    private _comunicadoService:ComunicadoService ,
    
  ) { }




  rowDB(args ){

    if(args.data.esRequerido ==1 ){                  
      args.row.classList.add('bgcolor');      
    }
  }

  ngOnInit(): void {
    this._usuarioService.usuario.PuedeGenerarContraRecibo=true;
    this._usuarioService.autorizacionCR().subscribe();
    this._comunicadoService.verificarNotificacion.emit(true);
    this.subscription = this._usuarioService
      .filtroGeneral
      .subscribe(x => {
        this.aplicarFiltroGeneral();
      });

    this.subscriptionNotification = this._subirArchivoService.notificacion
      .pipe(filter((x: Movimiento) => x.tipo == "Pago"))
      .subscribe(mov => {        
        this.pagosAprobados.forEach(movimiento => {
          if (movimiento.movimientoID == mov.movimientoID){
            movimiento = mov;
            // if (movimiento.estaActualizando){              
            //   movimiento.estaActualizando=false;
            //   this.cargarAnexos(movimiento);
            // }            
          }
            
        }
        );        
      })


    this.cargando = true;
    this._facturaService
      .obtenerPagosAprobados(this._usuarioService.usuario.Proveedor)
      .subscribe((pagos: PagoAprobado[]) => {
        
        this.pagosAprobados = pagos;
        this.pagosAprobados.forEach(x => {x.totalMovimientos = 0; x.anexos=[]});
        this.cargando = false;
      });
    //this.obtenerPagosFicticios();
    ///this.cargando=false;
  }


  referenciasFicticias(total) {
    const t = total;
    let resultado: any[] = [];
    for (let index = 0; index < t; index++) {
      const element = Math.trunc(Math.random() * (10000 - 50 + 1) + 50);
      resultado.push(element.toString())
    }
    return resultado;
  }

  // obtenerPagosFicticios() {
  //   for (let i = 0; i < 20; i++) {
  //     const r = this.referenciasFicticias(Math.random() * (50 - 5 + 1) + 5);
  //     this.pagosAprobados.push(
  //       {
  //         movimientoID: 1000,
  //         folio: 152261,
  //         movimientoDescripcion: `Pago Ficticio ${i}`,
  //         referencia: r.join(","),
  //         totalMovimientos: r.length,
  //         saldo: 100000000,
  //         importe: Math.random() * (100000 - 50 + 1) + 50,
  //         fechaEmision: new Date(),
  //         fechaVencimiento: new Date(),
  //         moneda: 'Pesos',
  //         tipo: "Pago"
  //       }
  //     )
  //   }


  // }

  aplicarFiltroGeneral() {
    if (this._usuarioService.filtroAplicar == null || this.grid == undefined) {
      return;
    }
    if (this._usuarioService.filtroAplicar.modulo != "pagos-aprobados") {
      return;
    }
    const folio = this._usuarioService.filtroAplicar.folio;
    const referencia = this._usuarioService.filtroAplicar.referencia;
    this.grid.filterSettings.columns = [
      { "value": `${folio}`, "operator": "equal", "field": "folio", },
    ];
    this._pagoActual = this.pagosAprobados.find(x => x.folio == folio);
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
    this.subscriptionNotification.unsubscribe();
  }



}
