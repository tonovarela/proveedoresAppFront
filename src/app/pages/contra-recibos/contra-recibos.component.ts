
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
  @ViewChild('detalle') detalle:any;
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
  detalleContraRecibo: Movimiento[] = [];

  constructor(    
    public _modalUploadService: ModalUploadService,
    public _facturaService: FacturaService,
    private _usuarioService: UsuarioService,
    private modalService: NgbModal
  ) { }



  verDetalle( movs) {
    this.detalleContraRecibo = movs;
    this.modalService.open(this.detalle,{ size: 'lg' });
  }


  ngOnInit(): void {

    this._facturaService.obtenerContraRecibosPendientes(this._usuarioService.usuario.Proveedor)
      .subscribe(movs => {
        this.contraRecibos = movs;
      });
  }

  created(e) {
    this.grid.showSpinner();
  }
  ngOnDestroy(): void {
    //this.subscription.unsubscribe();
  }

}
