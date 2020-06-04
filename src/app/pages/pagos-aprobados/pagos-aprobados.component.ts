import { Movimiento } from './../../models/movimiento';
import { UsuarioService } from './../../services/usuario.service';
import { FacturaService } from './../../services/factura.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Grid, EditSettingsModel, PageSettingsModel, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { FechaDictionary } from 'src/app/utils/dates';




@Component({
  selector: 'app-pagos-aprobados',
  templateUrl: './pagos-aprobados.component.html',
  styleUrls: ['./pagos-aprobados.component.css']
})
export class PagosAprobadosComponent implements OnInit {


  @ViewChild('grid') grid: Grid;
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
  

  pagosAprobados: Movimiento[] = [];

  public fechaEmisionFilter: any;
  public fechaVencimientoFilter: any;
  public contenedorFiltroFechaEmision: any = null;
  public contenedorFiltroFechaVencimiento: any = null;
  public fecha:FechaDictionary=new FechaDictionary();


  constructor(private _facturaService: FacturaService, private _usuarioService: UsuarioService) { }


  ngOnInit(): void {
    this.cargando=true;
    this._facturaService.obtenerPagosAprobados(this._usuarioService.usuario.Proveedor).subscribe( (movs:Movimiento[]) => {
      this.pagosAprobados= movs;      
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
    if (args.requestType == "filterafteropen" && args.columnName == "fechaVencimiento") {
      args.filterModel.dlgObj.element.querySelector('.e-flm_optrdiv').hidden = true;
      const btn = (document.getElementsByClassName('e-primary e-flat')[0] as any);
      btn.hidden= true;
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




}
