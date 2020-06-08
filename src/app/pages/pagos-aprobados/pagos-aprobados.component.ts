import { Movimiento, Contrarecibo, PagoAprobado, PagoDetalle } from './../../models/movimiento';

import { UsuarioService } from './../../services/usuario.service';
import { FacturaService } from './../../services/factura.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Grid, EditSettingsModel, PageSettingsModel, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FechaDictionary } from 'src/app/utils/dates';





@Component({
  selector: 'app-pagos-aprobados',
  templateUrl: './pagos-aprobados.component.html',
  styleUrls: ['./pagos-aprobados.component.css']
})
export class PagosAprobadosComponent implements OnInit {


  @ViewChild('grid') grid: Grid;
  @ViewChild('detalle') detalle: any;
  gridInstance: Grid;

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
  

  pagosAprobados: PagoAprobado[] = [];
  _pagoActual: PagoAprobado =null;

  public fechaEmisionFilter: any;
  public fechaVencimientoFilter: any;
  public contenedorFiltroFechaEmision: any = null;
  public contenedorFiltroFechaVencimiento: any = null;
  public fecha:FechaDictionary=new FechaDictionary();


  constructor(private _facturaService: FacturaService,
     private _usuarioService: UsuarioService,
     private modalService: NgbModal,
     ) { }


  ngOnInit(): void {
    this.cargando=true;
    this._facturaService.obtenerPagosAprobados(this._usuarioService.usuario.Proveedor).subscribe( (pagos:PagoAprobado[]) => {
      this.pagosAprobados= pagos;      
      this.cargando=false;
    });


  }

  actionComplete(args) {    
    if (args.requestType == "filterafteropen" && args.columnName == "fechaEmision") {

      args.filterModel.dlgObj.element.querySelector('.e-flm_optrdiv').hidden = true;      
      const btn = (document.getElementsByClassName('e-primary e-flat')[0] as any);
      btn.hidden= true;
      this.contenedorFiltroFechaEmision = args.filterModel.dlgObj.element        
        .querySelector('.e-flmenu-cancelbtn')
        .addEventListener('click', this.borrarFiltroFechaEmision.bind(this));
    }   
  }

  verDetalle(mov:PagoAprobado) {    
    this.cargando = true;
    this._pagoActual=mov;
    this._facturaService.obtenerDetallePagoAprobado(mov.folio).subscribe(
      (movs: PagoDetalle[]) => {
        //console.log(movs);
        this._pagoActual.detalle=movs;
        this.cargando=false;                        
        this.modalService.open(this.detalle, { size: 'lg' });
        //this.cargando = false;
      });
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




}
